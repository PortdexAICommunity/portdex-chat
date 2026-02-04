'use client';

import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { memo } from 'react';
import { PlusIcon, EyeIcon, EyeOffIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { VisibilityType } from './visibility-selector';

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

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  session,
  isGenerativeUIPanelVisible,
  hasGenerativeUIContent,
  onToggleGenerativeUIPanel,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session | null;
  isGenerativeUIPanelVisible?: boolean;
  hasGenerativeUIContent?: boolean;
  onToggleGenerativeUIPanel?: () => void;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 z-10 bg-transsparent py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          session={session}
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {/* Generative UI Panel Toggle */}
      {hasGenerativeUIContent && onToggleGenerativeUIPanel && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isGenerativeUIPanelVisible ? 'default' : 'outline'}
              size="sm"
              className={`order-1 md:order-3 px-2 h-fit ${
                !isGenerativeUIPanelVisible ? 'relative' : ''
              }`}
              onClick={onToggleGenerativeUIPanel}
            >
              {isGenerativeUIPanelVisible ? (
                <EyeOffIcon size={14} />
              ) : (
                <>
                  <EyeIcon size={14} />
                  {/* Notification dot for available content */}
                  <div className="absolute -top-1 -right-1 size-2 bg-blue-500 rounded-full animate-pulse" />
                </>
              )}
              <span className="sr-only">
                {isGenerativeUIPanelVisible ? 'Hide' : 'Show'} Generative UI
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isGenerativeUIPanelVisible
              ? 'Hide Generative UI Panel'
              : 'Show Generative UI Panel (New content available!)'}
          </TooltipContent>
        </Tooltip>
      )}

      {/* {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )} */}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
