'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: readonly TimelineEntry[];
}

const TimelineItem = React.memo(
  ({ item, index }: { item: TimelineEntry; index: number }) => (
    <div className="flex justify-start pt-10 md:pt-40 md:gap-10 text-white">
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="size-10 absolute left-3 md:left-3 rounded-full bg-lime-500 flex items-center justify-center">
          <div className="size-4 rounded-full bg-neutral-200 border border-neutral-700 p-2" />
        </div>
        <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-primary">
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full text-white">
        <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-primary">
          {item.title}
        </h3>
        {item.content}
      </div>
    </div>
  ),
);

TimelineItem.displayName = 'TimelineItem';

export const Timeline = React.memo(({ data }: TimelineProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  useEffect(() => {
    updateHeight();

    // Add resize listener for responsive updates
    const handleResize = () => {
      requestAnimationFrame(updateHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateHeight]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Memoize timeline items to prevent unnecessary re-renders
  const timelineItems = useMemo(
    () =>
      data.map((item, index) => (
        <TimelineItem
          key={`${item.title}-${index}`}
          item={item}
          index={index}
        />
      )),
    [data],
  );

  // Memoize gradient styles to prevent recalculation
  const gradientStyles = useMemo(
    () => ({
      height: `${height}px`,
    }),
    [height],
  );

  return (
    <div className="w-full font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl text-primary max-w-4xl">
          The Future of AI and Blockchain Integration: A Timeline of Key
          Milestones
        </h2>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {timelineItems}
        <div
          style={gradientStyles}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';
