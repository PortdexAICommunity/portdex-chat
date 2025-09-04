'use client';

import { ChatHeader } from '@/components/chat-header';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { useChatCache } from '@/hooks/use-chat-cache';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import type { Vote } from '@/lib/db/schema';
import { ChatSDKError } from '@/lib/errors';
import { cn, fetcher, fetchWithErrorHandlers, generateUUID } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import type { Attachment, UIMessage } from 'ai';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import { Artifact } from './artifact';
import { Footer } from './footer';
import { HomeMarketplace } from './marketplace/home-marketplace';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { toast } from './toast';
import type { VisibilityType } from './visibility-selector';
import type { HomeMarketplaceItem } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { RateLimitDialog } from './rate-limit-dialog';
import { useGuestRateLimit } from '@/hooks/use-guest-rate-limit';
import { GenerativeUIPanel, ProductGrid } from './generative-ui-panel';

interface Session {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    type: 'guest' | 'regular';
  };
  expires: string;
}

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  autoResume: boolean;
}) {
  const { user, isGuest, loading } = useAuth();
  const session: Session | null = loading
    ? null
    : isGuest
      ? {
          user: {
            id: 'guest',
            name: 'Guest',
            email: null,
            image: null,
            type: 'guest',
          },
          expires: new Date(Date.now() + 3600 * 1000).toISOString(),
        }
      : user
        ? {
            user: {
              id: user.userId,
              name: user.username,
              email: user.signInDetails?.loginId || null,
              image: null,
              type: 'regular',
            },
            expires: new Date(Date.now() + 3600 * 1000).toISOString(),
          }
        : null;

  const { mutate } = useSWRConfig();
  const [selectedTool, setSelectedTool] = useState<string>('none');
  const selectedToolRef = useRef(selectedTool);
  const { cacheChat, cacheMessage } = useChatCache();

  // Generative UI Panel state
  const [isGenerativeUIPanelVisible, setIsGenerativeUIPanelVisible] =
    useState(false);
  const [generativeUIContent, setGenerativeUIContent] = useState<{
    products?: any[];
    content?: string;
    type?: string;
  } | null>(null);
  const [hasUserManuallyHiddenPanel, setHasUserManuallyHiddenPanel] =
    useState(false);

  // Get selected assistant from localStorage
  const [selectedAssistant, setSelectedAssistant] =
    useState<HomeMarketplaceItem | null>(null);

  useEffect(() => {
    const savedAssistant = localStorage.getItem('selected-assistant');
    if (savedAssistant) {
      try {
        const assistant = JSON.parse(savedAssistant);
        setSelectedAssistant(assistant);
      } catch (error) {
        console.error('Failed to parse saved assistant:', error);
        localStorage.removeItem('selected-assistant');
      }
    }
  }, []);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);
  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  // Cache the chat when component mounts or when messages change
  useEffect(() => {
    if (id && session?.user) {
      // Generate a better default title from first message if available
      let title = `Chat ${id.slice(0, 8)}`;
      if (initialMessages.length > 0) {
        // Use the first user message as title
        const firstUserMessage = initialMessages.find((m) => m.role === 'user');
        if (firstUserMessage?.content) {
          title =
            firstUserMessage.content.slice(0, 50) +
            (firstUserMessage.content.length > 50 ? '...' : '');
        }
      }

      cacheChat({
        id,
        title,
        createdAt: new Date().toISOString(),
        userId: session.user.id,
        visibility: initialVisibilityType,
      });
    }
  }, [id, session?.user, initialVisibilityType, cacheChat, initialMessages]);

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const {
    messages,
    setMessages,
    handleSubmit: originalHandleSubmit,
    input,
    setInput,
    append: originalAppend,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
      selectedVisibilityType: visibilityType,
      selectedTool: selectedToolRef.current,
    }),
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        // Check if this is a rate limit error for guest users
        if (error.message.includes('Rate limit exceeded') && isGuest) {
          setShowRateLimitDialog(true);
        } else {
          toast({
            type: 'error',
            description: error.message,
          });
        }
      }
    },
  });

  // Wrapped handleSubmit to check guest rate limits
  const handleSubmit = (
    event?: { preventDefault?: (() => void) | undefined },
    chatRequestOptions?: any,
  ) => {
    if (isGuest && !canSendMessage()) {
      setShowRateLimitDialog(true);
      return;
    }

    // Increment guest message count before sending
    if (isGuest) {
      const canSend = incrementMessageCount();
      if (!canSend) {
        setShowRateLimitDialog(true);
        return;
      }
    }

    originalHandleSubmit(event, chatRequestOptions);
  };

  // Wrapped append to check guest rate limits
  const append = async (message: any, chatRequestOptions?: any) => {
    if (isGuest && !canSendMessage()) {
      setShowRateLimitDialog(true);
      return;
    }

    // Increment guest message count before sending
    if (isGuest) {
      const canSend = incrementMessageCount();
      if (!canSend) {
        setShowRateLimitDialog(true);
        return;
      }
    }

    return await originalAppend(message, chatRequestOptions);
  };

  // Cache messages as they are added or updated
  useEffect(() => {
    // Cache all current messages when they change
    messages.forEach((message) => {
      if (
        message.content &&
        (message.role === 'user' || message.role === 'assistant')
      ) {
        cacheMessage({
          id: message.id,
          chatId: id,
          role: message.role,
          content: message.content,
          createdAt:
            message.createdAt?.toISOString() || new Date().toISOString(),
        });
      }
    });
  }, [messages, id, cacheMessage]);

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      append({
        role: 'user',
        content: query,
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  }, [query, append, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher as any,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);

  // Guest rate limiting
  const { canSendMessage, incrementMessageCount, isLimitReached } =
    useGuestRateLimit(isGuest);

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="flex h-dvh bg-background">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Ensure session is available before rendering components that depend on it
  if (!session) {
    return (
      <div className="flex h-dvh bg-background">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-lg text-red-500">Authentication Error</div>
          <div className="text-sm text-muted-foreground">
            Unable to initialize session
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'flex bg-background min-h-screen',
          messages.length === 0
            ? '[background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'
            : '',
        )}
      >
        {/* Chat Section - Full width when panel hidden, 30% when panel shown */}
        <div
          className={`flex flex-col min-w-0 ${
            isGenerativeUIPanelVisible
              ? 'w-[30%] border-r border-border'
              : 'flex-1'
          }`}
        >
          <ChatHeader
            chatId={id}
            selectedModelId={initialChatModel}
            selectedVisibilityType={initialVisibilityType}
            isReadonly={isReadonly}
            session={session}
            isGenerativeUIPanelVisible={isGenerativeUIPanelVisible}
            hasGenerativeUIContent={!!generativeUIContent}
            onToggleGenerativeUIPanel={() => {
              const newVisibility = !isGenerativeUIPanelVisible;
              setIsGenerativeUIPanelVisible(newVisibility);
              // Track if user manually hides the panel
              if (!newVisibility) {
                setHasUserManuallyHiddenPanel(true);
              } else {
                setHasUserManuallyHiddenPanel(false);
              }
            }}
          />

          {session && (
            <Messages
              chatId={id}
              status={status}
              votes={votes}
              messages={messages}
              setMessages={setMessages}
              reload={reload}
              isReadonly={isReadonly}
              isArtifactVisible={isArtifactVisible}
              selectedAssistant={selectedAssistant}
              onShowGenerativeUI={(content) => {
                setGenerativeUIContent(content);
                // Auto-show panel for new content unless user has manually hidden it
                if (!hasUserManuallyHiddenPanel) {
                  setIsGenerativeUIPanelVisible(true);
                }
              }}
              isGenerativeUIPanelVisible={isGenerativeUIPanelVisible}
              onToggleGenerativeUIPanel={() => {
                const newVisibility = !isGenerativeUIPanelVisible;
                setIsGenerativeUIPanelVisible(newVisibility);
                // Track if user manually hides the panel
                if (!newVisibility) {
                  setHasUserManuallyHiddenPanel(true);
                } else {
                  setHasUserManuallyHiddenPanel(false);
                }
              }}
            />
          )}

          <form
            className={cn(
              'flex mx-auto px-4 sm:px-6 bg-transparent pb-4 md:pb-6 gap-2 w-full',
              messages.length === 0
                ? 'max-w-4xl mt-4 mb-8'
                : 'max-w-none md:max-w-3xl my-0',
            )}
          >
            {!isReadonly && (
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                status={status}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                setMessages={setMessages}
                append={append}
                selectedVisibilityType={visibilityType}
              />
            )}
          </form>

          {messages.length === 0 && (
            <div className="max-w-7xl mx-auto bg-background/30 mt-6 rounded-3xl p-10">
              <HomeMarketplace />
            </div>
          )}

          {messages.length === 0 && <Footer />}
        </div>

        {/* Generative UI Panel - Only show when visible */}
        {isGenerativeUIPanelVisible && (
          <div className="flex-1 w-[70%]">
            <GenerativeUIPanel
              isVisible={isGenerativeUIPanelVisible}
              onClose={() => setIsGenerativeUIPanelVisible(false)}
              content={
                generativeUIContent ? (
                  generativeUIContent.type === 'products' &&
                  generativeUIContent.products ? (
                    <ProductGrid
                      products={generativeUIContent.products}
                      content={generativeUIContent.content}
                    />
                  ) : (
                    <div className="p-6">
                      <p>
                        {generativeUIContent.content || 'Generative UI content'}
                      </p>
                    </div>
                  )
                ) : null
              }
              title="Generative UI Results"
            />
          </div>
        )}
      </div>

      <RateLimitDialog
        open={showRateLimitDialog}
        onOpenChange={setShowRateLimitDialog}
      />

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      />
    </>
  );
}
