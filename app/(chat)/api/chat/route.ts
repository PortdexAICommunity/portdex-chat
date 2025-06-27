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

export const maxDuration = 60;

// Cloudflare Workers timeout utilities
const WORKER_TIMEOUT = 50000; // 50 seconds (10s buffer before maxDuration)
const DB_OPERATION_TIMEOUT = 25000; // 25 seconds for database operations (temporary increase for diagnosis)
const AUTH_TIMEOUT = 8000; // 8 seconds for auth operations

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

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

export async function POST(request: Request) {
  const requestStartTime = Date.now();
  
  // Set up abort controller for request-wide timeout
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, WORKER_TIMEOUT);

  try {
    // Quick validation upfront with timeout
    let requestBody: PostRequestBody;
    try {
      const json = await withTimeout(
        request.json(), 
        2000, 
        'Request JSON parsing'
      );
      requestBody = postRequestBodySchema.parse(json);
    } catch (error) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: (error as Error).message }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Fast auth check with timeout
    let session;
    try {
      session = await withTimeout(auth(), AUTH_TIMEOUT, 'Authentication');
    } catch (error) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Authentication timeout', details: (error as Error).message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!session?.user) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Model not available' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Run critical checks in parallel with timeout
    let messageCount = 0;
    let chat: Chat | null = null;
    
    try {
      [messageCount, chat] = await withTimeout(
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
        DB_OPERATION_TIMEOUT,
        'Database validation checks'
      );
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Database validation timeout details:', {
        error: (error as Error).message,
        userId: session.user.id,
        chatId: id,
        timestamp: new Date().toISOString(),
        timeElapsed: Date.now() - requestStartTime
      });
      return new Response(
        JSON.stringify({ 
          error: 'Database timeout during validation',
          details: 'Database operations took longer than 15 seconds',
          suggestion: 'Check database connection and performance'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (messageCount > maxMessagesPerDay) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (chat?.userId && chat.userId !== session.user.id) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get geolocation hints (fast operation)
    const { longitude, latitude, city, country } = geolocation(request);
    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    // Get previous messages for context with timeout
    let previousMessages: any[] = [];
    try {
      previousMessages = await withTimeout(
        getMessagesByChatId({ id }),
        DB_OPERATION_TIMEOUT,
        'Fetching previous messages'
      );
    } catch (error) {
      console.error('Failed to get previous messages:', error);
      // Continue with empty messages rather than failing
      previousMessages = [];
    }

    const messages = appendClientMessage({
      messages: previousMessages as any, // Convert DBMessage[] to UIMessage[]
      message,
    });

    // Create appropriate provider based on whether an assistant is selected
    const provider = selectedAssistant 
      ? createDynamicProvider(assistantForEntitlements)
      : myProvider;

    // Set up streaming response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    const response = new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });

    // Background operations - use ctx.waitUntil pattern for Cloudflare Workers
    const backgroundOperations = (async () => {
      try {
        // Start database operations in parallel - don't block streaming
        const saveOperationsPromise = (async () => {
          try {
            if (!chat) {
              const title = await withTimeout(
                generateTitleFromUserMessage({ message }),
                5000,
                'Title generation'
              );
              await withTimeout(
                saveChat({
                  id,
                  userId: session.user.id,
                  title,
                  visibility: selectedVisibilityType,
                }),
                DB_OPERATION_TIMEOUT,
                'Save chat'
              );
            }

            // Save user message
            await withTimeout(
              saveMessages({
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
              }),
              DB_OPERATION_TIMEOUT,
              'Save user message'
            );

            // Create stream ID
            const streamId = generateUUID();
            await withTimeout(
              createStreamId({ streamId, chatId: id }),
              DB_OPERATION_TIMEOUT,
              'Create stream ID'
            );

            return streamId;
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
        const result = streamText({
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
                await withTimeout(
                  saveMessages({
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
                  }),
                  DB_OPERATION_TIMEOUT,
                  'Save assistant message'
                );
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

        // Process the stream with error handling and timeout
        try {
          const reader = result.toDataStream().getReader();
          
          // Add timeout for stream processing
          const streamTimeout = setTimeout(() => {
            abortController.abort();
          }, WORKER_TIMEOUT - (Date.now() - requestStartTime));

          while (true) {
            if (abortController.signal.aborted) {
              clearTimeout(streamTimeout);
              throw new Error('Request aborted due to timeout');
            }

            const { done, value } = await reader.read();
            if (done) {
              clearTimeout(streamTimeout);
              break;
            }
            await writer.write(value);
          }
          
          console.log(`Request processed in ${Date.now() - requestStartTime}ms`);
        } catch (streamError) {
          console.error('Stream error:', streamError);
          if (!abortController.signal.aborted) {
            writer.write(
              `data: ${JSON.stringify({ error: 'Stream processing error' })}\n\n`
            );
          }
        }
      } catch (err) {
        const error = err as Error;
        console.error('Fatal error:', error);
        if (!abortController.signal.aborted) {
          writer.write(
            `data: ${JSON.stringify({
              error: 'Internal server error',
              details: error?.message || 'Unknown error',
            })}\n\n`
          );
        }
      } finally {
        clearTimeout(timeoutId);
        try {
          await writer.close();
        } catch (e) {
          console.error('Error closing writer:', e);
        }
      }
    })();

    // For Cloudflare Workers, check if we're in a Workers environment
    // and handle background operations appropriately
    const isCloudflareWorkers = typeof Response !== 'undefined' && 
      typeof globalThis !== 'undefined' && 
      'cf' in (request as any);
    
    if (isCloudflareWorkers) {
      // In Cloudflare Workers, background operations should complete quickly
      // or be handled through other mechanisms (Durable Objects, Queue, etc.)
      backgroundOperations.catch(console.error);
    } else {
      // In other environments, handle normally
      backgroundOperations.catch(console.error);
    }

    return response;

  } catch (error) {
    clearTimeout(timeoutId);
            console.error('Outer error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Request timeout or critical error',
            details: (error as Error).message 
          }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return new ChatSDKError('bad_request:api').toResponse();
    }

    const session = await withTimeout(auth(), AUTH_TIMEOUT, 'GET Authentication');

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    let chat: Chat;

    try {
      chat = await withTimeout(
        getChatById({ id: chatId }), 
        DB_OPERATION_TIMEOUT, 
        'GET getChatById'
      );
    } catch {
      return new ChatSDKError('not_found:chat').toResponse();
    }

    if (!chat) {
      return new ChatSDKError('not_found:chat').toResponse();
    }

    if (chat.visibility === 'private' && chat.userId !== session.user.id) {
      return new ChatSDKError('forbidden:chat').toResponse();
    }

    const streamIds = await withTimeout(
      getStreamIdsByChatId({ chatId }), 
      DB_OPERATION_TIMEOUT, 
      'GET getStreamIdsByChatId'
    );

    if (!streamIds.length) {
      return new ChatSDKError('not_found:stream').toResponse();
    }

    const recentStreamId = streamIds.at(-1);

    if (!recentStreamId) {
      return new ChatSDKError('not_found:stream').toResponse();
    }

    // For GET requests, we'll return a simple response since resumable streams are complex
    const messages = await withTimeout(
      getMessagesByChatId({ id: chatId }), 
      DB_OPERATION_TIMEOUT, 
      'GET getMessagesByChatId'
    );
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
  } catch (error) {
    console.error('GET error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'GET request timeout or error',
        details: (error as Error).message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new ChatSDKError('bad_request:api').toResponse();
    }

    const session = await withTimeout(auth(), AUTH_TIMEOUT, 'DELETE Authentication');

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    const chat = await withTimeout(
      getChatById({ id }), 
      DB_OPERATION_TIMEOUT, 
      'DELETE getChatById'
    );

    if (chat.userId !== session.user.id) {
      return new ChatSDKError('forbidden:chat').toResponse();
    }

    const deletedChat = await withTimeout(
      deleteChatById({ id }), 
      DB_OPERATION_TIMEOUT, 
      'DELETE deleteChatById'
    );

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'DELETE request timeout or error',
        details: (error as Error).message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
