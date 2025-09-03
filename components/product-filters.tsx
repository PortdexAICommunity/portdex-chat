'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface ProductFiltersProps {
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
}

export function ProductFilters({ onFiltersChange, initialFilters }: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters?.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters?.maxPrice);
  const [minMOQ, setMinMOQ] = useState<number | undefined>(initialFilters?.minMOQ);
  const [verifiedSuppliersOnly, setVerifiedSuppliersOnly] = useState<boolean | undefined>(initialFilters?.verifiedSuppliersOnly);
  const [minRating, setMinRating] = useState<number | undefined>(initialFilters?.minRating);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({
      minPrice: minPrice !== undefined && minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice !== undefined && maxPrice > 0 ? maxPrice : undefined,
      minMOQ: minMOQ !== undefined && minMOQ > 0 ? minMOQ : undefined,
      verifiedSuppliersOnly: verifiedSuppliersOnly,
      minRating: minRating !== undefined && minRating > 0 ? minRating : undefined,
    });
  }, [minPrice, maxPrice, minMOQ, verifiedSuppliersOnly, minRating, onFiltersChange]);

  const handleClearFilters = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinMOQ(undefined);
    setVerifiedSuppliersOnly(undefined);
    setMinRating(undefined);
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-white dark:bg-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Price Range
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="min-price" className="text-xs text-gray-500 mb-1 block">
                Min ($)
              </Label>
              <Input
                id="min-price"
                type="number"
                min="0"
                step="0.01"
                value={minPrice ?? ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs text-gray-500 mb-1 block">
                Max ($)
              </Label>
              <Input
                id="max-price"
                type="number"
                min="0"
                step="0.01"
                value={maxPrice ?? ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Any"
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* MOQ Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Minimum Order Quantity
          </Label>
          <div>
            <Input
              type="number"
              min="1"
              value={minMOQ ?? ''}
              onChange={(e) => setMinMOQ(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="1"
              className="h-9"
            />
          </div>
        </div>

        {/* Supplier Verification Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Supplier Verification
          </Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified-suppliers"
              checked={verifiedSuppliersOnly === true}
              onChange={(e) => setVerifiedSuppliersOnly(e.target.checked ? true : undefined)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="verified-suppliers" className="text-sm text-gray-700 dark:text-gray-300">
              Show only verified suppliers
            </Label>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Minimum Rating
          </Label>
          <div>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={minRating ?? ''}
              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}