import { auth, type UserType } from "@/app/(auth)/auth";
import { getDynamicEntitlements } from "@/lib/ai/entitlements";
import { extractAssistantId, isAssistantModel } from "@/lib/ai/models";
import { systemPrompt, type RequestHints } from "@/lib/ai/prompts";
import { createDynamicProvider, myProvider } from "@/lib/ai/providers";
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
	smoothStream,
	streamText,
} from "ai";
import { differenceInSeconds } from "date-fns";
import { generateTitleFromUserMessage } from "../../actions";
import { postRequestBodySchema, type PostRequestBody } from "./schema";

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

			const session = await auth();
			if (!session?.user) {
				writer.write(`data: ${JSON.stringify({ error: "Unauthorized" })}\n\n`);
				await writer.close();
				return;
			}

			const { id, message, selectedChatModel, selectedVisibilityType } =
				requestBody;
			const userType: UserType = session.user.type;

			// Get selected assistant (if any) for dynamic entitlements and prompts
			const selectedAssistant = getAssistantFromModelId(selectedChatModel);

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

			// Run critical checks in parallel
			const [messageCount, chat] = await Promise.all([
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

			// Get previous messages for context
			const previousMessages = await getMessagesByChatId({ id }).catch(
				() => []
			);
			const messages = appendClientMessage({
				// @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
				messages: previousMessages,
				message,
			});

			// Create appropriate provider based on whether an assistant is selected
			const provider = selectedAssistant
				? createDynamicProvider(assistantForEntitlements)
				: myProvider;

			// Start database operations in background - don't wait for them
			const saveOperationsPromise = (async () => {
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
				experimental_activeTools:
					selectedChatModel === "chat-model-reasoning"
						? ["searchProducts"]
						: [
								"getWeather",
								"createDocument",
								"updateDocument",
								"requestSuggestions",
								"searchProducts",
						  ],
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
				},
				onFinish: async ({ response }) => {
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

	const session = await auth();

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

	const session = await auth();

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
