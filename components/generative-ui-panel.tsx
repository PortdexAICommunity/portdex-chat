'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { toast } from 'sonner';

interface GenerativeUIPanelProps {
  isVisible: boolean;
  onClose: () => void;
  content?: React.ReactNode;
  title?: string;
}

export function GenerativeUIPanel({
  isVisible,
  onClose,
  content,
  title = 'Generative UI',
}: GenerativeUIPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[70vw] bg-background border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="size-8 p-0"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {content ? (
          content
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium mb-2">Generative UI Panel</h3>
              <p className="text-sm">
                Rich interactive components will appear here when you use
                generative tools.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface GenerativeUIProduct {
  id?: string;
  name: string;
  supplier: string;
  category: string;
  price: string;
  image?: string;
  description: string;
  rating: number;
  features?: string[];
}

interface ProductGridProps {
  products: GenerativeUIProduct[];
  content?: string;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalResults?: number;
}

export function ProductGrid({ products, content, currentPage, pageSize, totalPages, totalResults }: ProductGridProps) {
  // State for client-side pagination
  const [currentPageState, setCurrentPageState] = React.useState(currentPage || 1);
  const actualPageSize = pageSize || 12;

  // Calculate pagination
  const totalProducts = products.length;
  const actualTotalPages = Math.ceil(totalProducts / actualPageSize);
  const startIndex = (currentPageState - 1) * actualPageSize;
  const endIndex = startIndex + actualPageSize;
  const currentPageProducts = products.slice(startIndex, endIndex);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= actualTotalPages) {
      setCurrentPageState(page);
    }
  };

  return (
    <div className="space-y-6">
      {content && (
        <div className="bg-muted/50 p-4 rounded-xl">
          <p className="text-sm text-muted-foreground">
            {content}
            {totalResults && (
              <span className="block mt-2 text-xs">
                Page {currentPageState} of {actualTotalPages} • {currentPageProducts.length} products shown
              </span>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentPageProducts.map((product, index) => (
          <div
            key={product.id || index}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
          >
            {/* Product Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-foreground line-clamp-2 leading-tight">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {product.supplier}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {product.category}
                </span>
                <div className="text-lg font-bold text-green-600">
                  ${product.price}
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
              <img
                src={product.image || ''}
                alt={product.name}
                className="size-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '';
                }}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((item, i) => (
                  <span
                    key={item}
                    className={`size-3 ${
                      i < product.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating}/5)
              </span>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Key Features:
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.features
                    .slice(0, 3)
                    .map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  {product.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => toast.info("Product View feature coming soon!")}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(actualTotalPages > 1 || totalProducts > actualPageSize) && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              {currentPageState > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={() => handlePageChange(currentPageState - 1)}
                  />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, actualTotalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPageState - 2) + i;
                if (pageNum > actualTotalPages) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum === currentPageState}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {currentPageState < actualTotalPages && (
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={() => handlePageChange(currentPageState + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          🎨 <strong>Generative UI:</strong> These rich product cards were
          generated directly by the AI tool!
        </p>
      </div> */}
    </div>
  );
}
