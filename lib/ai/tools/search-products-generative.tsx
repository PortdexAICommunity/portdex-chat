import { generateUUID } from "@/lib/utils";
import { type DataStreamWriter, tool } from "ai";
import { z } from "zod";
import { scrapeEbayProducts } from "@/lib/ebay-scraper";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
	id: string;
	name: string;
	price: number; // normalized numeric for UI
	image: string;
	description: string;
	category: string;
	rating: number;
	reviews: number;
	supplier?: string;
	supplierUrl?: string;
	moq?: number; // Minimum Order Quantity
	features?: string[];
	trustMetrics?: any;
}




// Loading component for product search
const ProductSearchLoading = ({ query }: { query: string }) => (
  <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
    <div className="flex items-center gap-3 mb-4">
      <div className="animate-spin size-5 border-2 border-blue-600 border-t-transparent rounded-full" />
      <div>
        <h3 className="font-semibold text-gray-900">
          Searching for products...
        </h3>
        <p className="text-sm text-gray-600">
          Query: &quot;{query}&quot;
        </p>
      </div>
    </div>
  </div>
);

// Product card component
const ProductCard = ({ product }: { product: any }) => (
  <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-neutral-800">
    {/* Product Header */}
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {product.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
      <Image
        src={product.image || ""}
        alt={product.name}
        width={200}
        height={120}
        className="size-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "";
        }}
      />
    </div>

    {/* Description */}
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
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
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        ({product.rating}/5)
      </span>
    </div>

    {/* Features */}
    {product.features && product.features.length > 0 && (
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-gray-700">
          Key Features:
        </p>
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((feature: string) => (
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
    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
      View Details
    </button>
  </div>
);

// Main product search results component
const ProductSearchResults = ({
  products,
  totalResults,
  searchQuery,
  currentPage,
  pageSize,
  totalPages,
}: {
  products: any[];
  totalResults: number;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}) => (
  <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
    {/* Header */}
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Product Search Results
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found {totalResults} products for &quot;{searchQuery}&quot; (Page {currentPage} of {totalPages})
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {totalResults} results
        </span>
      </div>
    </div>

    {/* Products Grid */}
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto no-scrollbar">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="p-4 border-t border-border">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    )}
  </div>
);

// No results component
const NoResults = ({ searchQuery }: { searchQuery: string }) => (
  <div className="border border-border rounded-2xl p-6">
    <div className="text-center">
      <div className="size-12 text-gray-400 mx-auto mb-3">📦</div>
      <h3 className="font-semibold mb-2 text-gray-900">
        No products found
      </h3>
      <p className="text-sm text-gray-600">
        No products match your search for &quot;{searchQuery}&quot;. Try
        adjusting your search terms.
      </p>
    </div>
  </div>
);

// Generative UI version of searchProducts tool
export const searchProductsGenerative = tool({
  description:
    "Search for products based on user query. Use this when the user is looking for products to buy or wants to see product recommendations. This tool provides rich, interactive product search results with generative UI.",
  parameters: z.object({
    query: z.string().describe("Search query for products"),
    maxResults: z.number().default(60).describe("Maximum results to return"),
    page: z.number().default(1).describe("Page number for pagination"),
    pageSize: z.number().default(12).describe("Number of products per page"),
    category: z.string().optional().describe("Filter products by category"),
    minPrice: z.number().optional().describe("Minimum price filter"),
    maxPrice: z.number().optional().describe("Maximum price filter"),
    minMOQ: z.number().optional().describe("Minimum order quantity filter"),
  }),
  execute: async ({
    query,
    maxResults = 60,
    page = 1,
    pageSize = 12,
    category,
    minPrice,
    maxPrice,
    minMOQ
  }: {
    query: string;
    maxResults?: number;
    page?: number;
    pageSize?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minMOQ?: number;
  }) => {
    // Ensure parameters are valid
    maxResults = Math.max(1, Math.min(maxResults || 60, 100)); // Cap at 100, minimum 1
    page = Math.max(1, page || 1);
    pageSize = Math.max(6, Math.min(pageSize || 12, 24)); // 6-24 products per page
    try {
      console.log("🚀 EXECUTING: Generative searchProducts tool called with:", { query, maxResults, category, minPrice, maxPrice, minMOQ });
      console.log("⏰ Timestamp:", new Date().toISOString());

      const id = generateUUID();

      // Scrape eBay products directly using our server action
      console.log("🔍 Starting eBay scraping...");
      let allProducts: Product[] = await scrapeEbayProducts(query, maxResults);
      console.log("🔍 Scraped products count:", allProducts.length);
      console.log("🔍 Max results:", maxResults);

      // If scraping fails or returns no results, fall back to minimal mock data
      if (allProducts.length === 0) {
        console.log(
          "⚠️  No products found from eBay scraping, using minimal fallback data"
        );
        // Minimal fallback products - clearly marked as demo data
        const fallbackProducts: Product[] = [
          {
            id: "fallback-1",
            name: `${query} - Sample Product (Demo Data)`,
            description:
              "This is demo data shown when real eBay scraping is not available.",
            price: 99.99,
            rating: 4,
            category: "General",
            supplier: "Demo Seller",
            image:
              "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
            reviews: 0,
            moq: 1, // Minimum order quantity for fallback product
            features: ["Demo Product", "Not Real Data"],
          },
        ];

        allProducts = fallbackProducts;
        console.log(
          "📋 Using fallback demo data:",
          allProducts.map((p) => p.name)
        );
      }

      // Start with all products for filtering
      let filteredProducts = [...allProducts];

      // Apply category filter to scraped results if specified
      if (category && filteredProducts.length > 0) {
        console.log("🔍 Applying category filter:", category);
        const beforeCount = filteredProducts.length;
        filteredProducts = filteredProducts.filter((product) =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );
        console.log(`🔍 Category filter: ${beforeCount} -> ${filteredProducts.length} products`);
      }

      // Apply price range filter to scraped results if specified
      if ((minPrice !== undefined || maxPrice !== undefined) && filteredProducts.length > 0) {
        console.log("🔍 Applying price filter:", { minPrice, maxPrice });
        const beforeCount = filteredProducts.length;
        filteredProducts = filteredProducts.filter((product) => {
          if (minPrice !== undefined && product.price < minPrice) {
            return false;
          }
          if (maxPrice !== undefined && product.price > maxPrice) {
            return false;
          }
          return true;
        });
        console.log(`🔍 Price filter: ${beforeCount} -> ${filteredProducts.length} products`);
      }

      // Apply MOQ filter to scraped results if specified
      if (minMOQ !== undefined && filteredProducts.length > 0) {
        console.log("🔍 Applying MOQ filter:", minMOQ);
        const beforeCount = filteredProducts.length;
        // For fallback products, we'll use the mock MOQ value
        filteredProducts = filteredProducts.filter((product) => {
          // For fallback products, we use the mock MOQ value of 1
          // For real products, we use the actual MOQ value
          const productMOQ = product.moq ?? 1;
          return productMOQ >= minMOQ;
        });
        console.log(`🔍 MOQ filter: ${beforeCount} -> ${filteredProducts.length} products`);
      }

      // Return ALL products for client-side pagination
      const totalProducts = filteredProducts.length;

      console.log(`📊 Found ${totalProducts} total matching products for query: "${query}"`);
      console.log(`📄 All products returned for client-side pagination`);

      const result = {
        id,
        title: `Product Search Results: ${query}`,
        kind: "generative-product-search",
        content: `Found ${totalProducts} products matching "${query}". Results displayed with rich interactive UI and pagination.`,
        products: filteredProducts, // Return ALL products for client-side pagination
        isGenerative: true,
        searchQuery: query,
        totalResults: totalProducts,
        currentPage: 1, // Start at page 1
        pageSize: 12, // Default page size for UI
        totalPages: Math.ceil(totalProducts / 12),
      };

      console.log("✅ Generative searchProducts tool completed successfully with", filteredProducts.length, "products shown");
      console.log("📤 Returning result:", {
        id: result.id,
        isGenerative: result.isGenerative,
        totalResults: result.totalResults,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasProducts: result.products && result.products.length > 0
      });

      // Make sure result is serializable
      const serializableResult = {
        ...result,
        products: result.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          rating: product.rating,
          category: product.category,
          supplier: product.supplier,
          image: product.image,
          features: product.features || []
        }))
      };

      console.log("🔄 Final result prepared for streaming");
      return serializableResult;
    } catch (error) {
      console.error("❌ Error in generative searchProducts tool:", error);
      // Return a fallback result in case of error
      return {
        id: generateUUID(),
        title: `Product Search Error`,
        kind: "generative-product-search",
        content: "Sorry, there was an error searching for products. Please try again.",
        products: [],
        isGenerative: true,
        searchQuery: query,
        totalResults: 0,
        error: true,
      };
    }
  },
});
