'use client';

import type { Vote } from '@/lib/db/schema';
import { cn, sanitizeText } from '@/lib/utils';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import cx from 'classnames';
import equal from 'fast-deep-equal';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { DocumentToolCall, DocumentToolResult } from './document';
import { DocumentPreview } from './document-preview';
import { PencilEditIcon, SparklesIcon, EyeIcon, EyeOffIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { MessageEditor } from './message-editor';
import { MessageReasoning } from './message-reasoning';
import { PreviewAttachment } from './preview-attachment';
import { ProductSearchResults } from './product-search-results';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Weather } from './weather';
import { MCPToolResult } from './mcp-tool-result';

export const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
  onShowGenerativeUI,
  isGenerativeUIPanelVisible,
  onToggleGenerativeUIPanel,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  onShowGenerativeUI?: (content: {
    products?: any[];
    content?: string;
    type?: string;
  }) => void;
  isGenerativeUIPanelVisible?: boolean;
  onToggleGenerativeUIPanel?: () => void;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn('flex flex-col gap-4 w-full', {
              'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            })}
          >
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                            message.role === 'user',
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                // Debug: Log tool state changes
                if (toolName === 'searchProducts') {
                  console.log(`🔧 searchProducts: ${state}`, {
                    hasResult: !!(toolInvocation as any).result,
                    resultType: (toolInvocation as any).result?.isGenerative
                      ? 'generative'
                      : 'regular',
                  });
                }

                if (state === 'call') {
                  const { args } = toolInvocation;
                  console.log(`📞 Tool call: ${toolName}`, { state, args });

                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['getWeather'].includes(toolName),
                      })}
                    >
                      {toolName === 'getWeather' ? (
                        <Weather />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'searchProducts' ? (
                        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="animate-spin size-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Searching for products...
                              </h3>
                              <p className="text-sm text-gray-600">
                                Query: &quot;{args.query}&quot;
                                {args.category &&
                                  ` • Category: ${args.category}`}
                                {args.maxPrice &&
                                  ` • Max Price: $${args.maxPrice}`}
                                {args.minRating &&
                                  ` • Min Rating: ${args.minRating}★`}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                  Processing...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                }

                if (state === 'result') {
                  const { result } = toolInvocation as any;
                  console.log(`📋 Tool result: ${toolName}`, {
                    state,
                    result: result?.isGenerative
                      ? 'generative result'
                      : 'regular result',
                  });

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview
                          isReadonly={isReadonly}
                          result={result}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'searchProducts' ? (
                        // Handle generative UI results for searchProducts - trigger side panel
                        result?.isGenerative ? (
                          (() => {
                            // Trigger the generative UI panel
                            if (onShowGenerativeUI) {
                              onShowGenerativeUI({
                                products: result.products,
                                content:
                                  result.content ||
                                  'Here are the products I found for you:',
                                type: 'products',
                                ...(result as any),
                              } as any);
                            }
                            return (
                              <div className="max-w-4xl w-full">
                                <div className="bg-muted/50 p-4 rounded-xl">
                                  <div className="flex items-center justify-between mb-4">
                                    <p>
                                      {result.content ||
                                        'Here are the products I found for you:'}
                                    </p>
                                    {onToggleGenerativeUIPanel && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onToggleGenerativeUIPanel}
                                        className="ml-4"
                                      >
                                        {isGenerativeUIPanelVisible ? (
                                          <>
                                            <EyeOffIcon
                                              size={14}
                                            />
                                            <span className="ml-2">Hide Generative UI</span>
                                          </>
                                        ) : (
                                          <>
                                            <EyeIcon
                                              size={14}
                                            />
                                            <span className="ml-2">Show Generative UI</span>
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                  <div className="text-center text-muted-foreground py-8">
                                    🎨
                                    <p className="mt-2">
                                      Generative UI displayed in side panel
                                    </p>
                                    <p className="text-sm">
                                      Check the right panel for rich product
                                      cards!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <ProductSearchResults
                            result={result}
                            isLoading={isLoading}
                          />
                        )
                      ) : (
                        <MCPToolResult toolName={toolName} result={result} />
                      )}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border animate-spin">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
