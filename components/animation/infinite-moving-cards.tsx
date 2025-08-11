'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import type { HomeMarketplaceItem } from '@/lib/types';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);
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
        'scroller relative z-20 max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-4',
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
                <div className="flex items-center gap-3">
                  <div className="shrink-0 size-10 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-200 dark:border-blue-700/50">
                    {item.icon || '🔧'}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h4>
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
