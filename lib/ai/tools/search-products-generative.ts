import { generateUUID } from "@/lib/utils";
import { tool } from "ai";
import { z } from "zod";
import { scrapeEbayProducts } from "@/lib/ebay-scraper";

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

// Generative UI version of searchProducts tool (data-only, no UI components)
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
		minMOQ,
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
			console.log("🚀 EXECUTING: Generative searchProducts tool called with:", {
				query,
				maxResults,
				category,
				minPrice,
				maxPrice,
				minMOQ,
			});
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
				console.log(
					`🔍 Category filter: ${beforeCount} -> ${filteredProducts.length} products`
				);
			}

			// Apply price range filter to scraped results if specified
			if (
				(minPrice !== undefined || maxPrice !== undefined) &&
				filteredProducts.length > 0
			) {
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
				console.log(
					`🔍 Price filter: ${beforeCount} -> ${filteredProducts.length} products`
				);
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
				console.log(
					`🔍 MOQ filter: ${beforeCount} -> ${filteredProducts.length} products`
				);
			}

			// Return ALL products for client-side pagination
			const totalProducts = filteredProducts.length;

			console.log(
				`📊 Found ${totalProducts} total matching products for query: "${query}"`
			);
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

			console.log(
				"✅ Generative searchProducts tool completed successfully with",
				filteredProducts.length,
				"products shown"
			);
			console.log("📤 Returning result:", {
				id: result.id,
				isGenerative: result.isGenerative,
				totalResults: result.totalResults,
				currentPage: result.currentPage,
				totalPages: result.totalPages,
				hasProducts: result.products && result.products.length > 0,
			});

			// Make sure result is serializable
			const serializableResult = {
				...result,
				products: result.products.map((product) => ({
					id: product.id,
					name: product.name,
					description: product.description,
					price: product.price,
					rating: product.rating,
					category: product.category,
					supplier: product.supplier,
					image: product.image,
					features: product.features || [],
				})),
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
				content:
					"Sorry, there was an error searching for products. Please try again.",
				products: [],
				isGenerative: true,
				searchQuery: query,
				totalResults: 0,
				error: true,
			};
		}
	},
});
