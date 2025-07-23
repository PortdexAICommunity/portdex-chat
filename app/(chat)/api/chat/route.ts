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

export async function POST(request: Request) {
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
		const startTime = Date.now();

		try {
			// Quick validation upfront
			let requestBody: PostRequestBody;
			try {
				const json = await request.json();
				requestBody = postRequestBodySchema.parse(json);
			} catch (_) {
				writer.write(
					`data: ${JSON.stringify({ error: "Invalid request" })}\n\n`
				);
				await writer.close();
				return;
			}

			const session = await getServerSession();
			if (!session?.user) {
				writer.write(`data: ${JSON.stringify({ error: "Unauthorized" })}\n\n`);
				await writer.close();
				return;
			}

			const { id, message, selectedChatModel, selectedVisibilityType } =
				requestBody;
			const userType: "guest" | "regular" = session.user.type;

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
						const transport = new StreamableHTTPClientTransport(
							new URL(mcpUrl)
						);
						customClient = await experimental_createMCPClient({ transport });
						toolSet = await customClient.tools();
					}
				} catch (mcpError) {
					console.error("MCP initialization failed:", mcpError);
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
				const [messageCountResult, chatResult] = await Promise.all([
					getMessageCountByUserId({
						id: session.user.id,
						differenceInHours: 24,
					}).catch((error) => {
						console.error("Failed to get message count:", error);
						return 0;
					}),
					getChatById({ id }).catch((error) => {
						console.error("Failed to get chat:", error);
						return null;
					}),
				]);
				messageCount = messageCountResult;
				chat = chatResult;
			} else {
				console.log("Skipping database checks for guest user");
			}

			if (messageCount > maxMessagesPerDay) {
				writer.write(
					`data: ${JSON.stringify({ error: "Rate limit exceeded" })}\n\n`
				);
				await writer.close();
				return;
			}

			if (chat?.userId && chat.userId !== session.user.id) {
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

			// Get previous messages for context - skip for guest users
			let previousMessages: any[] = [];
			if (session.user.type !== "guest") {
				previousMessages = await getMessagesByChatId({ id }).catch(() => []);
			} else {
				console.log("Skipping previous messages retrieval for guest user");
			}

			const messages = appendClientMessage({
				messages: previousMessages,
				message,
			});

			// Create appropriate provider based on whether an assistant is selected
			const provider = createDynamicProvider(selectedAssistant);

			// Start database operations in background - only for authenticated users
			const saveOperationsPromise = (async () => {
				// Skip database operations for guest users
				if (session.user.type === "guest") {
					console.log("Skipping database operations for guest user");
					return generateUUID(); // Return a fallback stream ID
				}

				try {
					if (!chat) {
						const title = await generateTitleFromUserMessage({ message });
						await saveChat({
							id,
							userId: session.user.id,
							title,
							visibility: selectedVisibilityType,
						});
					}

					// Save user message
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

					// Create stream ID
					const streamId = generateUUID();
					await createStreamId({ streamId, chatId: id });

					return streamId;
				} catch (error) {
					console.error("Background database operations failed:", error);
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
					// Only close MCP client if it was initialized
					if (customClient) {
						try {
							await customClient.close();
						} catch (closeError) {
							console.error("Error closing MCP client:", closeError);
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
							} catch (error) {
								console.error("Failed to save assistant message:", error);
							}
						});
					} else {
						console.log("Skipping assistant message save for guest user");
					}
				},
				experimental_telemetry: {
					isEnabled: isProductionEnvironment,
					functionId: "stream-text",
				},
			});

			// Process the stream with error handling
			try {
				const reader = result.toDataStream().getReader();

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					await writer.write(value);
				}
				console.log(`Request processed in ${Date.now() - startTime}ms`);
			} catch (streamError) {
				console.error("Stream error:", streamError);
				writer.write(
					`data: ${JSON.stringify({ error: "Stream processing error" })}\n\n`
				);
			}
		} catch (err) {
			const error = err as Error;
			console.error("Fatal error:", error);
			writer.write(
				`data: ${JSON.stringify({
					error: "Internal server error",
					details: error?.message || "Unknown error",
				})}\n\n`
			);
		} finally {
			await writer.close();
		}
	})();

	return response;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const chatId = searchParams.get("chatId");

	if (!chatId) {
		return new ChatSDKError("bad_request:api").toResponse();
	}

	const session = await getServerSession();

	if (!session?.user) {
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	let chat: Chat;

	try {
		chat = await getChatById({ id: chatId });
	} catch {
		return new ChatSDKError("not_found:chat").toResponse();
	}

	if (!chat) {
		return new ChatSDKError("not_found:chat").toResponse();
	}

	if (chat.visibility === "private" && chat.userId !== session.user.id) {
		return new ChatSDKError("forbidden:chat").toResponse();
	}

	const streamIds = await getStreamIdsByChatId({ chatId });

	if (!streamIds.length) {
		return new ChatSDKError("not_found:stream").toResponse();
	}

	const recentStreamId = streamIds.at(-1);

	if (!recentStreamId) {
		return new ChatSDKError("not_found:stream").toResponse();
	}

	// For GET requests, we'll return a simple response since resumable streams are complex
	const messages = await getMessagesByChatId({ id: chatId });
	const mostRecentMessage = messages.at(-1);

	if (!mostRecentMessage) {
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

	if (mostRecentMessage.role !== "assistant") {
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

	const resumeRequestedAt = new Date();
	const messageCreatedAt = new Date(mostRecentMessage.createdAt);

	if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
		return new Response(JSON.stringify({ messages: [] }), { status: 200 });
	}

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
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return new ChatSDKError("bad_request:api").toResponse();
	}

	const session = await getServerSession();

	if (!session?.user) {
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	const chat = await getChatById({ id });

	if (chat.userId !== session.user.id) {
		return new ChatSDKError("forbidden:chat").toResponse();
	}

	const deletedChat = await deleteChatById({ id });

	return Response.json(deletedChat, { status: 200 });
}
