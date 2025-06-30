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
import type { Session } from 'next-auth';
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

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session;
  autoResume: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [selectedTool, setSelectedTool] = useState<string>('none');
  const selectedToolRef = useRef(selectedTool);
  const { cacheChat, cacheMessage } = useChatCache();

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
    handleSubmit,
    input,
    setInput,
    append,
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
        toast({
          type: 'error',
          description: error.message,
        });
      }
    },
  });

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

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });
  return (
    <>
      <div
        className={cn(
          'flex flex-col bg-background min-h-screen',
          messages.length === 0
            ? '[background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'
            : '',
        )}
      >
        <ChatHeader
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly}
          session={session}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form
          className={cn(
            'flex mx-auto px-4 sm:px-6 bg-transparent pb-4 md:pb-6 gap-2 w-full max-w-none md:max-w-3xl',
            messages.length === 0 ? 'my-[20dvh]' : 'my-0',
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
          <div className="max-w-7xl mx-auto bg-background/50 my-14 rounded-3xl p-10">
            <HomeMarketplace />
          </div>
        )}
        {messages.length === 0 && (
          <div className="max-w-7xl mx-auto bg-background/50 my-14 rounded-3xl p-10">
            <HomeMarketplace />
          </div>
        )}

        {messages.length === 0 && <Footer />}
      </div>

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
