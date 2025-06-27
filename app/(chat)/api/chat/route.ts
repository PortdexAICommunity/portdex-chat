import { auth, type UserType } from '@/app/(auth)/auth';
import { getDynamicEntitlements } from '@/lib/ai/entitlements';
import { systemPrompt, type RequestHints } from '@/lib/ai/prompts';
import { myProvider, createDynamicProvider } from '@/lib/ai/providers';
import { isAssistantModel, extractAssistantId } from '@/lib/ai/models';
import { createDocument } from '@/lib/ai/tools/create-document';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { searchProducts } from '@/lib/ai/tools/search-products';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { isProductionEnvironment } from '@/lib/constants';
import { homeMarketplaceItems } from '@/lib/constants';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  getStreamIdsByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import type { Chat } from '@/lib/db/schema';
import { ChatSDKError } from '@/lib/errors';
import { generateUUID, getTrailingMessageId } from '@/lib/utils';
import { geolocation } from '@vercel/functions';
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from 'ai';
import { differenceInSeconds } from 'date-fns';
import { generateTitleFromUserMessage } from '../../actions';
import { postRequestBodySchema, type PostRequestBody } from './schema';

// Cloudflare Workers optimizations
export const maxDuration = 60;
export const runtime = 'edge'; // Enable Edge Runtime for better Cloudflare Workers compatibility

// Memory-efficient timeout management for serverless
const WORKER_TIMEOUT_MS = 55000; // 55s - leave buffer before 60s max
const STREAM_CHUNK_TIMEOUT_MS = 30000; // 30s per stream chunk

// Helper function to extract assistant data from model ID
function getAssistantFromModelId(selectedChatModel: string) {
  if (!isAssistantModel(selectedChatModel)) {
    return null;
  }
  
  const assistantId = extractAssistantId(selectedChatModel);
  if (!assistantId) {
    return null;
  }
  
  const assistant = homeMarketplaceItems.find(item => item.id === assistantId);
  
  return assistant || null;
}

// Optimized error writer for edge environments
const writeErrorAndClose = async (writer: WritableStreamDefaultWriter, error: string, details?: string) => {
  try {
    await writer.write(
      `data: ${JSON.stringify({ error, ...(details && { details }) })}\n\n`
    );
  } catch (writeError) {
    console.error('Failed to write error:', writeError);
  } finally {
    try {
      await writer.close();
    } catch (closeError) {
      console.error('Failed to close writer:', closeError);
    }
  }
};

export async function POST(request: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const response = new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      // Edge-specific headers for better Cloudflare Workers performance
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

  // Cloudflare Workers optimized background processing with timeout management
  (async () => {
    const startTime = Date.now();
    let timeoutHandle: NodeJS.Timeout | null = null;

    // Set up worker timeout protection
    const workerTimeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error('Worker timeout exceeded'));
      }, WORKER_TIMEOUT_MS);
    });

    try {
      // Quick validation upfront - fail fast for serverless
      let requestBody: PostRequestBody;
      try {
        const json = await request.json();
        requestBody = postRequestBodySchema.parse(json);
      } catch (validationError) {
        await writeErrorAndClose(writer, 'Invalid request', validationError instanceof Error ? validationError.message : undefined);
        return;
      }

      const session = await auth();
      if (!session?.user) {
        await writeErrorAndClose(writer, 'Unauthorized');
        return;
      }

      const { id, message, selectedChatModel, selectedVisibilityType } = requestBody;
      const userType: UserType = session.user.type;

      // Get selected assistant (if any) for dynamic entitlements and prompts
      const selectedAssistant = getAssistantFromModelId(selectedChatModel);
      
      // Use dynamic entitlements that include assistant models
      const assistantForEntitlements = selectedAssistant 
        ? { id: selectedAssistant.id, title: selectedAssistant.title } 
        : null;
      const { maxMessagesPerDay, availableChatModelIds } = getDynamicEntitlements(
        userType, 
        assistantForEntitlements
      );

      // Validate that the selected model is available to the user
      if (!availableChatModelIds.includes(selectedChatModel)) {
        await writeErrorAndClose(writer, 'Forbidden: Model not available');
        return;
      }

      // Run critical checks in parallel with timeout protection
      const [messageCount, chat] = await Promise.race([
        Promise.all([
          getMessageCountByUserId({
            id: session.user.id,
            differenceInHours: 24,
          }).catch((error) => {
            console.error('Failed to get message count:', error);
            return 0;
          }),
          getChatById({ id }).catch((error) => {
            console.error('Failed to get chat:', error);
            return null;
          }),
        ]),
        workerTimeoutPromise,
      ]);

      if (messageCount > maxMessagesPerDay) {
        await writeErrorAndClose(writer, 'Rate limit exceeded');
        return;
      }

      if (chat?.userId && chat.userId !== session.user.id) {
        await writeErrorAndClose(writer, 'Forbidden');
        return;
      }

      // Get geolocation hints - edge optimized
      const { longitude, latitude, city, country } = geolocation(request);
      const requestHints: RequestHints = {
        longitude,
        latitude,
        city,
        country,
      };

      // Get previous messages for context with timeout protection
      const previousMessages = await Promise.race([
        getMessagesByChatId({ id }).catch(() => []),
        workerTimeoutPromise,
      ]);
      
      const messages = appendClientMessage({
        // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
        messages: previousMessages,
        message,
      });

      // Create appropriate provider based on whether an assistant is selected
      const provider = selectedAssistant 
        ? createDynamicProvider(assistantForEntitlements)
        : myProvider;

      // Start database operations in background - optimized for edge with better error handling
      const saveOperationsPromise = (async () => {
        try {
          const operationTimeout = setTimeout(() => {
            throw new Error('Database operation timeout');
          }, 10000); // 10s timeout for DB operations

          const result = await (async () => {
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
                  role: 'user',
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
          })();

          clearTimeout(operationTimeout);
          return result;
        } catch (error) {
          console.error('Background database operations failed:', error);
          return generateUUID(); // Fallback stream ID
        }
      })();

      // Create a proper dataStream writer for tools
      let toolDataStream: any = null;
      const toolDataStreamInstance = createDataStream({
        execute: (dataStream) => {
          toolDataStream = dataStream;
        },
      });

      // Start AI response streaming immediately - don't wait for database operations
      const streamPromise = streamText({
        model: provider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel, requestHints, selectedAssistant }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === 'chat-model-reasoning'
            ? []
            : [
                'getWeather',
                'createDocument',
                'updateDocument',
                'requestSuggestions',
                'searchProducts',
              ],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          createDocument: createDocument({ session, dataStream: toolDataStream }),
          updateDocument: updateDocument({ session, dataStream: toolDataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream: toolDataStream,
          }),
          searchProducts: searchProducts({
            session,
            dataStream: toolDataStream,
          }),
        },
        onFinish: async ({ response }) => {
          if (!session?.user?.id) return;

          const assistantMessages = response.messages.filter(
            (msg) => msg.role === 'assistant'
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
                    attachments: assistantMessage.experimental_attachments ?? [],
                    createdAt: new Date(),
                  },
                ],
              });
            } catch (error) {
              console.error('Failed to save assistant message:', error);
            }
          });
        },
        experimental_telemetry: {
          isEnabled: isProductionEnvironment,
          functionId: 'stream-text',
        },
      });

      // Process the stream with timeout protection and memory optimization
      try {
        const result = await Promise.race([streamPromise, workerTimeoutPromise]);
        const reader = result.toDataStream().getReader();
        let lastChunkTime = Date.now();

        while (true) {
          // Timeout protection per chunk
          const chunkPromise = reader.read();
          const chunkTimeout = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Stream chunk timeout'));
            }, STREAM_CHUNK_TIMEOUT_MS);
          });

          const { done, value } = await Promise.race([chunkPromise, chunkTimeout]);
          
          if (done) break;
          
          await writer.write(value);
          lastChunkTime = Date.now();

          // Check if we're approaching worker timeout
          if (Date.now() - startTime > WORKER_TIMEOUT_MS - 5000) {
            console.warn('Approaching worker timeout, ending stream');
            break;
          }
        }
        
        console.log(`Request processed in ${Date.now() - startTime}ms`);
      } catch (streamError) {
        console.error('Stream error:', streamError);
        await writeErrorAndClose(writer, 'Stream processing error', streamError instanceof Error ? streamError.message : undefined);
        return;
      }
    } catch (err) {
      const error = err as Error;
      console.error('Fatal error:', error);
      await writeErrorAndClose(writer, 'Internal server error', error?.message || 'Unknown error');
    } finally {
      // Cleanup for memory optimization
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      try {
        await writer.close();
      } catch (closeError) {
        console.error('Failed to close writer in finally block:', closeError);
      }
    }
  })();

  return response;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  let chat: Chat;

  try {
    chat = await getChatById({ id: chatId });
  } catch {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (!chat) {
    return new ChatSDKError('not_found:chat').toResponse();
  }

  if (chat.visibility === 'private' && chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const streamIds = await getStreamIdsByChatId({ chatId });

  if (!streamIds.length) {
    return new ChatSDKError('not_found:stream').toResponse();
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new ChatSDKError('not_found:stream').toResponse();
  }

  // For GET requests, we'll return a simple response since resumable streams are complex
  const messages = await getMessagesByChatId({ id: chatId });
  const mostRecentMessage = messages.at(-1);

  if (!mostRecentMessage) {
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }

  if (mostRecentMessage.role !== 'assistant') {
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }

  const resumeRequestedAt = new Date();
  const messageCreatedAt = new Date(mostRecentMessage.createdAt);

  if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }

  return new Response(JSON.stringify({ 
    messages: [mostRecentMessage] 
  }), { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}