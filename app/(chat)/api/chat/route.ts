import { getServerSession } from "@/lib/amplify-server";
import { getDynamicEntitlements } from "@/lib/ai/entitlements";
import { extractAssistantId, isAssistantModel } from "@/lib/ai/models";
import { systemPrompt, type RequestHints } from "@/lib/ai/prompts";
import { createDynamicProvider } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { searchProducts } from "@/lib/ai/tools/search-products";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { homeMarketplaceItems, isProductionEnvironment } from "@/lib/constants";
import {
	createStreamId,
	deleteChatById,
	getChatById,
	getMessageCountByUserId,
	getMessagesByChatId,
	getStreamIdsByChatId,
	saveChat,
	saveMessages,
} from "@/lib/db/queries";
import type { Chat } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { geolocation } from "@vercel/functions";
import {
	appendClientMessage,
	appendResponseMessages,
	experimental_createMCPClient,
	smoothStream,
	streamText,
} from "ai";
import { differenceInSeconds } from "date-fns";
import { generateTitleFromUserMessage } from "../../actions";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const maxDuration = 60;

// Helper function to extract assistant data from model ID
function getAssistantFromModelId(selectedChatModel: string) {
	if (!isAssistantModel(selectedChatModel)) {
		return null;
	}

	const assistantId = extractAssistantId(selectedChatModel);
	if (!assistantId) {
		return null;
	}

	const assistant = homeMarketplaceItems.find(
		(item) => item.id === assistantId
	);

	return assistant || null;
}

// Helper function to log with timestamp for better debugging
function logWithTimestamp(message: string, data?: any) {
	const timestamp = new Date().toISOString();
	if (data) {
		console.log(`[${timestamp}] ${message}`, data);
	} else {
		console.log(`[${timestamp}] ${message}`);
	}
}

export async function POST(request: Request) {
	const startTime = Date.now();
	logWithTimestamp("Chat API POST request started");

	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();

	const response = new Response(readable, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});

	// Run everything in background to prevent Worker timeouts
	(async () => {
		try {
			// Quick validation upfront
			let requestBody: PostRequestBody;
			try {
				const json = await request.json();
				requestBody = postRequestBodySchema.parse(json);
				logWithTimestamp("Request parsed successfully");
			} catch (error) {
				logWithTimestamp("Invalid request body", error);
				writer.write(
					`data: ${JSON.stringify({ error: "Invalid request" })}\n\n`
				);
				await writer.close();
				return;
			}

			const session = await getServerSession();
			if (!session?.user) {
				logWithTimestamp("Unauthorized request - no session user");
				writer.write(`data: ${JSON.stringify({ error: "Unauthorized" })}\n\n`);
				await writer.close();
				return;
			}

			const { id, message, selectedChatModel, selectedVisibilityType } =
				requestBody;
			const userType: "guest" | "regular" = session.user.type;

			logWithTimestamp(`Processing request for chat ${id}`, {
				userType,
				selectedChatModel,
				selectedVisibilityType,
			});

			// Get selected assistant (if any) for dynamic entitlements and prompts
			const selectedAssistant = getAssistantFromModelId(selectedChatModel);

			// Only initialize MCP for assistant models
			let customClient: any = null;
			let toolSet: any = {};

			if (selectedAssistant && isAssistantModel(selectedChatModel)) {
				try {
					// Determine MCP URL based on selected assistant or use default
					const mcpUrl = selectedAssistant?.mcp_url;

					if (mcpUrl) {
						logWithTimestamp(`Initializing MCP client for ${mcpUrl}`);
						const transport = new StreamableHTTPClientTransport(
							new URL(mcpUrl)
						);
						customClient = await experimental_createMCPClient({ transport });
						toolSet = await customClient.tools();
						logWithTimestamp("MCP client initialized successfully");
					}
				} catch (mcpError) {
					logWithTimestamp("MCP initialization failed", mcpError);
					// Continue without MCP if it fails
					customClient = null;
					toolSet = {};
				}
			}

			// Use dynamic entitlements that include assistant models
			const assistantForEntitlements = selectedAssistant
				? { id: selectedAssistant.id, title: selectedAssistant.title }
				: null;
			const { maxMessagesPerDay, availableChatModelIds } =
				getDynamicEntitlements(userType, assistantForEntitlements);

			// Validate that the selected model is available to the user
			if (!availableChatModelIds.includes(selectedChatModel)) {
				logWithTimestamp(`Model not available: ${selectedChatModel}`);
				writer.write(
					`data: ${JSON.stringify({
						error: "Forbidden: Model not available",
					})}\n\n`
				);
				await writer.close();
				return;
			}

			// Run critical checks in parallel - skip database checks for guest users
			let messageCount = 0;
			let chat = null;

			if (session.user.type !== "guest") {
				logWithTimestamp("Running database checks for regular user");
				const [messageCountResult, chatResult] = await Promise.all([
					getMessageCountByUserId({
						id: session.user.id,
						differenceInHours: 24,
					}).catch((error) => {
						logWithTimestamp("Failed to get message count", error);
						return 0;
					}),
					getChatById({ id }).catch((error) => {
						logWithTimestamp("Failed to get chat", error);
						return null;
					}),
				]);
				messageCount = messageCountResult;
				chat = chatResult;
				logWithTimestamp(
					`Message count: ${messageCount}, Chat found: ${!!chat}`
				);
			} else {
				logWithTimestamp("Skipping database checks for guest user");
			}

			if (messageCount > maxMessagesPerDay) {
				logWithTimestamp("Rate limit exceeded", {
					messageCount,
					maxMessagesPerDay,
				});
				writer.write(
					`data: ${JSON.stringify({ error: "Rate limit exceeded" })}\n\n`
				);
				await writer.close();
				return;
			}

			if (chat?.userId && chat.userId !== session.user.id) {
				logWithTimestamp("Forbidden - chat belongs to another user");
				writer.write(`data: ${JSON.stringify({ error: "Forbidden" })}\n\n`);
				await writer.close();
				return;
			}

			// Get geolocation hints
			const { longitude, latitude, city, country } = geolocation(request);
			const requestHints: RequestHints = {
				longitude,
				latitude,
				city,
				country,
			};
			logWithTimestamp("Geolocation hints", { city, country });

			// Get previous messages for context - skip for guest users
			let previousMessages: any[] = [];
			if (session.user.type !== "guest") {
				logWithTimestamp("Fetching previous messages");
				previousMessages = await getMessagesByChatId({ id }).catch((error) => {
					logWithTimestamp("Failed to get previous messages", error);
					return [];
				});
				logWithTimestamp(`Found ${previousMessages.length} previous messages`);
			} else {
				logWithTimestamp("Skipping previous messages retrieval for guest user");
			}

			const messages = appendClientMessage({
				messages: previousMessages,
				message,
			});

			// Create appropriate provider based on whether an assistant is selected
			const provider = createDynamicProvider(selectedAssistant);
			logWithTimestamp("Provider created");

			// Log environment variables (safely)
			logWithTimestamp("Environment check", {
				isTestEnvironment: isProductionEnvironment ? "No" : "Yes",
				hasPortdexApiKey: process.env.PORTDEX_API_KEY ? "Yes" : "No",
				nodeEnv: process.env.NODE_ENV,
				envVarKeys: Object.keys(process.env)
					.filter(
						(key) =>
							key.includes("PORT") || key.includes("API") || key.includes("KEY")
					)
					.join(", "),
			});

			// Start database operations in background - only for authenticated users
			const saveOperationsPromise = (async () => {
				// Skip database operations for guest users
				if (session.user.type === "guest") {
					logWithTimestamp("Skipping database operations for guest user");
					return generateUUID(); // Return a fallback stream ID
				}

				try {
					if (!chat) {
						logWithTimestamp("Creating new chat");
						const title = await generateTitleFromUserMessage({ message });
						await saveChat({
							id,
							userId: session.user.id,
							title,
							visibility: selectedVisibilityType,
						});
						logWithTimestamp("Chat created successfully");
					}

					// Save user message
					logWithTimestamp("Saving user message");
					await saveMessages({
						messages: [
							{
								chatId: id,
								id: message.id,
								role: "user",
								parts: message.parts,
								attachments: message.experimental_attachments ?? [],
								createdAt: new Date(),
							},
						],
					});
					logWithTimestamp("User message saved successfully");

					// Create stream ID
					const streamId = generateUUID();
					await createStreamId({ streamId, chatId: id });
					logWithTimestamp(`Stream ID created: ${streamId}`);

					return streamId;
				} catch (error) {
					logWithTimestamp("Background database operations failed", error);
					return generateUUID(); // Fallback stream ID
				}
			})();

			// Create a dummy DataStreamWriter implementation for tools
			const toolDataWriter: any = {
				write: () => {},
				writeData: () => {},
				writeMessageAnnotation: () => {},
				writeSource: () => {},
				merge: () => {},
				onError: () => {},
			};

			// Get MCP tool names dynamically (only for assistant models)
			const mcpToolNames = Object.keys(toolSet);

			// Define base tools (no MCP)
			const baseTools = [
				"getWeather",
				"createDocument",
				"updateDocument",
				"requestSuggestions",
				"searchProducts",
			];

			// Determine active tools based on model type
			let activeTools: string[] = [];
			if (selectedChatModel === "chat-model-reasoning") {
				// No tools for reasoning model
				activeTools = [];
			} else if (isAssistantModel(selectedChatModel)) {
				// Assistant models get base tools + MCP tools
				activeTools = [...baseTools, ...mcpToolNames];
			} else {
				// Regular chat-model gets only base tools (no MCP)
				activeTools = baseTools;
			}

			logWithTimestamp(
				`Starting AI response streaming with ${activeTools.length} active tools`
			);

			// Start AI response streaming immediately - don't wait for database operations
			const result = streamText({
				model: provider.languageModel(selectedChatModel),
				system: systemPrompt({
					selectedChatModel,
					requestHints,
					selectedAssistant,
				}),
				messages,
				maxSteps: 5,
				experimental_activeTools: activeTools as any,
				experimental_transform: smoothStream({ chunking: "word" }),
				experimental_generateMessageId: generateUUID,
				tools: {
					getWeather,
					createDocument: createDocument({
						session,
						dataStream: toolDataWriter,
					}),
					updateDocument: updateDocument({
						session,
						dataStream: toolDataWriter,
					}),
					requestSuggestions: requestSuggestions({
						session,
						dataStream: toolDataWriter,
					}),
					searchProducts: searchProducts({
						session,
						dataStream: toolDataWriter,
					}),
					// Only include MCP tools for assistant models
					...(isAssistantModel(selectedChatModel) ? toolSet : {}),
				},
				onFinish: async ({ response }) => {
					logWithTimestamp("AI response finished");
					// Only close MCP client if it was initialized
					if (customClient) {
						try {
							await customClient.close();
							logWithTimestamp("MCP client closed successfully");
						} catch (closeError) {
							logWithTimestamp("Error closing MCP client", closeError);
						}
					}
					if (!session?.user?.id) return;

					const assistantMessages = response.messages.filter(
						(msg) => msg.role === "assistant"
					);
					const assistantId = getTrailingMessageId({
						messages: assistantMessages,
					});

					if (!assistantId) return;

					const [, assistantMessage] = appendResponseMessages({
						messages: [message],
						responseMessages: response.messages,
					});

					// Wait for background operations to complete before saving assistant message
					// Only save for authenticated users
					if (session.user.type !== "guest") {
						logWithTimestamp("Saving assistant message");
						saveOperationsPromise.then(async () => {
							try {
								await saveMessages({
									messages: [
										{
											id: assistantId,
											chatId: id,
											role: assistantMessage.role,
											parts: assistantMessage.parts,
											attachments:
												assistantMessage.experimental_attachments ?? [],
											createdAt: new Date(),
										},
									],
								});
								logWithTimestamp("Assistant message saved successfully");
							} catch (error) {
								logWithTimestamp("Failed to save assistant message", error);
							}
						});
					} else {
						logWithTimestamp("Skipping assistant message save for guest user");
					}
				},
				experimental_telemetry: {
					isEnabled: isProductionEnvironment,
					functionId: "stream-text",
				},
			});

			// Log provider details to help diagnose the issue
			try {
				logWithTimestamp("AI Provider details", {
					type: provider.constructor.name,
					modelName: selectedChatModel,
					modelAvailable: !!provider.languageModel,
				});
			} catch (providerError) {
				logWithTimestamp("Error inspecting provider", providerError);
			}

			// Important: Ensure the stream is consumed even if the client disconnects
			// This is critical for AWS Amplify deployments
			result.consumeStream();

			// Process the stream with error handling
			try {
				logWithTimestamp("Starting to process stream");

				// Check if we have the API key for non-test environments
				if (!process.env.PORTDEX_API_KEY && !isProductionEnvironment) {
					throw new Error("Missing PORTDEX_API_KEY environment variable");
				}

				const reader = result.toDataStream().getReader();

				let chunkCount = 0;
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						logWithTimestamp(
							`Stream processing completed after ${chunkCount} chunks`
						);
						break;
					}

					chunkCount++;
					if (chunkCount === 1) {
						logWithTimestamp("First chunk received", {
							valueLength: value?.length,
						});
					}

					await writer.write(value);
				}
				logWithTimestamp(
					`Request processed in ${Date.now() - startTime}ms with ${chunkCount} chunks`
				);
			} catch (streamError) {
				logWithTimestamp("Stream error", streamError);
				writer.write(
					`data: ${JSON.stringify({
						error: "Stream processing error",
						details:
							streamError instanceof Error
								? streamError.message
								: "Unknown error",
					})}\n\n`
				);
			}
		} catch (err) {
			const error = err as Error;
			logWithTimestamp("Fatal error", error);
			writer.write(
				`data: ${JSON.stringify({
					error: "Internal server error",
					details: error?.message || "Unknown error",
				})}\n\n`
			);
		} finally {
			await writer.close();
			logWithTimestamp(`Request completed in ${Date.now() - startTime}ms`);
		}
	})();

	return response;
}

export async function GET(request: Request) {
	const startTime = Date.now();
	logWithTimestamp("Chat API GET request started");

	const { searchParams } = new URL(request.url);
	const chatId = searchParams.get("chatId");

	if (!chatId) {
		logWithTimestamp("Bad request - missing chatId");
		return new ChatSDKError("bad_request:api").toResponse();
	}

	const session = await getServerSession();

	if (!session?.user) {
		logWithTimestamp("Unauthorized request - no session user");
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	let chat: Chat;

	try {
		logWithTimestamp(`Getting chat by ID: ${chatId}`);
		chat = await getChatById({ id: chatId });
	} catch (error) {
		logWithTimestamp("Failed to get chat", error);
		return new ChatSDKError("not_found:chat").toResponse();
	}

	if (!chat) {
		logWithTimestamp("Chat not found");
		return new ChatSDKError("not_found:chat").toResponse();
	}

	if (chat.visibility === "private" && chat.userId !== session.user.id) {
		logWithTimestamp("Forbidden - chat is private and belongs to another user");
		return new ChatSDKError("forbidden:chat").toResponse();
	}

	logWithTimestamp("Getting stream IDs for chat");
	const streamIds = await getStreamIdsByChatId({ chatId });

	if (!streamIds.length) {
		logWithTimestamp("No streams found for chat");
		return new ChatSDKError("not_found:stream").toResponse();
	}

	const recentStreamId = streamIds.at(-1);

	if (!recentStreamId) {
		logWithTimestamp("No recent stream found");
		return new ChatSDKError("not_found:stream").toResponse();
	}

	// For GET requests, we'll return a simple response since resumable streams are complex
	logWithTimestamp("Getting messages for chat");
	const messages = await getMessagesByChatId({ id: chatId });
	const mostRecentMessage = messages.at(-1);

	if (!mostRecentMessage) {
		logWithTimestamp("No messages found for chat");
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

	if (mostRecentMessage.role !== "assistant") {
		logWithTimestamp("Most recent message is not from assistant");
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

	const resumeRequestedAt = new Date();
	const messageCreatedAt = new Date(mostRecentMessage.createdAt);

	if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
		logWithTimestamp("Message is too old to resume");
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

	logWithTimestamp(`GET request completed in ${Date.now() - startTime}ms`);
	return new Response(
		JSON.stringify({
			messages: [mostRecentMessage],
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}

export async function DELETE(request: Request) {
	const startTime = Date.now();
	logWithTimestamp("Chat API DELETE request started");

	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		logWithTimestamp("Bad request - missing id");
		return new ChatSDKError("bad_request:api").toResponse();
	}

	const session = await getServerSession();

	if (!session?.user) {
		logWithTimestamp("Unauthorized request - no session user");
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	try {
		logWithTimestamp(`Getting chat by ID: ${id}`);
		const chat = await getChatById({ id });

		if (chat.userId !== session.user.id) {
			logWithTimestamp("Forbidden - chat belongs to another user");
			return new ChatSDKError("forbidden:chat").toResponse();
		}

		logWithTimestamp("Deleting chat");
		const deletedChat = await deleteChatById({ id });
		logWithTimestamp(`DELETE request completed in ${Date.now() - startTime}ms`);
		return Response.json(deletedChat, { status: 200 });
	} catch (error) {
		logWithTimestamp("Error deleting chat", error);
		return new ChatSDKError("bad_request:database").toResponse();
	}
}
