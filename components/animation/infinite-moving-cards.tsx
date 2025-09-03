'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import type { HomeMarketplaceItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { saveChatModelAsCookie } from '@/app/(chat)/actions';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
  onClick,
}: {
  items: HomeMarketplaceItem[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  onClick?: (item: HomeMarketplaceItem) => void;
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  const handleUseAssistant = (item: HomeMarketplaceItem) => {
    const assistantModelId = `assistant-${item.id}`;
    // Persist assistant selection via server action and then navigate to chat page
    React.startTransition(() => {
      saveChatModelAsCookie(assistantModelId).then(() => {
        // Persist assistant details in localStorage for client use
        localStorage.setItem('selected-assistant', JSON.stringify(item));
        router.push('/');
      });
    });
  };

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards',
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse',
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4 px-4 sm:px-6 lg:px-8',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item, idx) => (
          <Card
            key={idx}
            className="hover:shadow-lg hover:border-purple-400 transition-all duration-200 cursor-pointer h-full max-w-md"
            onClick={() => onClick?.(item)}
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex flex-col gap-3 grow">
                {/* Icon and Title together */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 size-10 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-200 dark:border-blue-700/50">
                      {item.icon || '🔧'}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseAssistant(item);
                      }}
                      type="button"
                      className="relative inline-flex h-8 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex size-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Try Now
                      </span>
                    </button>
                  </div>
                </div>
                {/* Description below */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};
