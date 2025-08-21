import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/marketplace/pagination';
import type { DataTypes } from '@/lib/types';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AIModelCard } from './ai-model-card';
import { AssistantCard } from './assistant-card';

// Memoized Assistant Card Component
import { memo } from 'react';
import { cn } from '@/lib/utils';
const MemoizedAssistantCard = memo(
  ({ assistant, onClick }: { assistant: DataTypes; onClick: () => void }) => (
    <AssistantCard assistant={assistant} onClick={onClick} />
  ),
);

const MemoizedAIModelCard = memo(
  ({ aiModel, onClick }: { aiModel: DataTypes; onClick: () => void }) => (
    <AIModelCard aiModel={aiModel} onClick={onClick} />
  ),
);

MemoizedAssistantCard.displayName = 'MemoizedAssistantCard';
MemoizedAIModelCard.displayName = 'MemoizedAIModelCard';

interface MarketplaceSectionProps {
  title: string;
  filteredItems: DataTypes[];
  paginatedItems: DataTypes[];
  hasMoreItems: boolean;
  onItemClick: (
    item: DataTypes,
    type: 'assistant' | 'ai-model' | 'software' | 'template',
  ) => void;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  itemType: 'assistant' | 'ai-model' | 'software' | 'template';
  shouldUseStaggeredAnimation: boolean;
  hideTitle?: boolean;
  // Pagination props (optional). If provided, the section will render Pagination.
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoadingPage?: boolean;
}

export function MarketplaceSection({
  title,
  filteredItems,
  paginatedItems,
  hasMoreItems,
  onItemClick,
  onLoadMore,
  isLoadingMore,
  itemType,
  shouldUseStaggeredAnimation,
  hideTitle = false,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoadingPage,
}: MarketplaceSectionProps) {
  return (
    <motion.section
      key={itemType}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {!hideTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="self-start sm:self-auto">
              Showing {paginatedItems.length} of {filteredItems.length}
            </Badge>
          </div>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
        )}
      >
        {paginatedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={
              shouldUseStaggeredAnimation ? { opacity: 0, y: 20 } : false
            }
            animate={
              shouldUseStaggeredAnimation
                ? { opacity: 1, y: 0 }
                : { opacity: 1 }
            }
            transition={
              shouldUseStaggeredAnimation ? { delay: index * 0.02 } : undefined
            }
          >
            {itemType === 'ai-model' ? (
              <MemoizedAIModelCard
                aiModel={item}
                onClick={() => onItemClick(item, itemType)}
              />
            ) : (
              <MemoizedAssistantCard
                assistant={item}
                onClick={() => onItemClick(item, itemType)}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreItems && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="px-8 py-2"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full size-4 border-b-2 border-purple-600 mr-2" />
                Loading...
              </>
            ) : (
              <>
                Load More <ChevronDown className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Built-in Pagination (only when props provided) */}
      {typeof currentPage === 'number' && typeof pageSize === 'number' && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              (filteredItems?.length ?? 0) / (pageSize || 1),
            )}
            pageSize={pageSize}
            totalItems={filteredItems?.length ?? 0}
            onPageChange={onPageChange || (() => {})}
            onPageSizeChange={onPageSizeChange || (() => {})}
            isLoading={!!isLoadingPage}
          />
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No {itemType} found matching your search.
          </p>
        </div>
      )}
    </motion.section>
  );
}
