'use client';

import { ExternalLink, Package, Star } from 'lucide-react';
import { memo } from 'react';
import { Button } from './ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  category: string;
  supplier: string;
  image?: string;
  features: string[];
}

interface ProductSearchResultsProps {
  result?: {
    products: Product[];
    totalResults: number;
    searchQuery: string;
    appliedFilters?: {
      category?: string;
      maxPrice?: number;
      minRating?: number;
    };
  };
  args?: {
    query: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
  };
  isLoading?: boolean;
}

const PureProductSearchResults = ({
  result,
  args,
  isLoading = false,
}: ProductSearchResultsProps) => {
  // Show loading state when tool is called but no results yet
  if (args && !result) {
    return (
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin size-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Searching for products...
            </h3>
            <p className="text-sm text-gray-600">
              Query: "{args.query}"
              {args.category && ` • Category: ${args.category}`}
              {args.maxPrice && ` • Max Price: $${args.maxPrice}`}
              {args.minRating && ` • Min Rating: ${args.minRating}★`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (result?.products) {
    const { products, totalResults, searchQuery } = result;

    if (products.length === 0) {
      return (
        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
          <div className="text-center">
            <Package className="size-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-gray-900">
              No products found
            </h3>
            <p className="text-sm text-gray-600">
              No products match your search for "{searchQuery}". Try adjusting
              your search terms.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Product Search Results
              </h3>
              <p className="text-sm text-gray-600">
                Found {totalResults} products for "{searchQuery}"
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {totalResults} results
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
              >
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.supplier}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {product.category}
                    </span>
                    <div className="text-lg font-bold text-green-600">
                      {product.price}
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={
                      product.image || '/placeholder.svg?height=120&width=200'
                    }
                    alt={product.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg?height=120&width=200';
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((item, i) => (
                      <Star
                        key={item}
                        className={`size-3 ${
                          i < product.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.rating}/5)
                  </span>
                </div>

                {/* Features */}
                {product.features.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-gray-700">
                      Key Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          +{product.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <ExternalLink className="size-3" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const ProductSearchResults = memo(PureProductSearchResults);
