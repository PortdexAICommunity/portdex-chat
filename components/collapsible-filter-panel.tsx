'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { ProductFilters } from './product-filters';

interface FilterPanelProps {
  onFiltersChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    minMOQ?: number;
    verifiedSuppliersOnly?: boolean;
    minRating?: number;
  }) => void;
  initialFilters?: {
    minPrice?: number;
    maxPrice?: number;
    minMOQ?: number;
    verifiedSuppliersOnly?: boolean;
    minRating?: number;
  };
  appliedFiltersCount?: number;
}

export function CollapsibleFilterPanel({ 
  onFiltersChange, 
  initialFilters,
  appliedFiltersCount = 0
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-border rounded-lg bg-white dark:bg-neutral-800">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
          {appliedFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {appliedFiltersCount} applied
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={togglePanel}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>

      {/* Panel Content */}
      {isExpanded && (
        <div className="p-4">
          <ProductFilters 
            onFiltersChange={onFiltersChange} 
            initialFilters={initialFilters}
          />
        </div>
      )}
    </div>
  );
}