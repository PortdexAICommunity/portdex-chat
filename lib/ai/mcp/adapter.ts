import { generateUUID } from "@/lib/utils";
import type {
	MCPProductSearchRequest,
	MCPProductSearchResponse,
	NormalizedProductItem,
} from "./types";

type MCPTools = Record<string, any> | undefined | null;

const DEFAULT_TIMEOUT_MS = 15000;

export const fetchLiveProductListings = async (
	req: MCPProductSearchRequest,
	mcpTools: MCPTools,
	options?: { timeoutMs?: number; sourceHint?: string }
): Promise<MCPProductSearchResponse> => {
	const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

	// If no MCP tools are available, return empty set gracefully
	if (!mcpTools || typeof mcpTools !== "object") {
		return { products: [], source: options?.sourceHint };
	}

	// Choose a generic tool name if available; otherwise, return empty
	// Future: branch by sourceHint and map to provider-specific tools
	const possibleTools = [
		"search_products",
		"find_products",
		"product_search",
		"search", // generic
	];

	const toolName = possibleTools.find((n) => n in mcpTools);
	if (!toolName) {
		return { products: [], source: options?.sourceHint };
	}

	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);

		// Call the MCP tool. Signature varies by server; use best-effort args.
		const raw = await mcpTools[toolName]({
			query: req.query,
			filters: req.filters,
			limit: req.paging?.limit ?? 20,
			cursor: req.paging?.cursor,
			signal: controller.signal,
		});

		clearTimeout(timer);

		const mapped: NormalizedProductItem[] = Array.isArray(raw?.products)
			? (raw.products
					.map((p: any): NormalizedProductItem | null => {
						// Defensive parsing with graceful omissions
						const title: string | undefined = p?.title ?? p?.name;
						const priceRaw: unknown = p?.price ?? p?.priceValue ?? p?.priceUSD;

						if (!title || priceRaw == null) return null;

						// Normalize price to number; accept "$123.45", 123, "123"
						const priceNum = Number.parseFloat(
							String(priceRaw).replace(/[^0-9.]/g, "") || "0"
						);
						if (!Number.isFinite(priceNum) || priceNum <= 0) return null;

						const item: NormalizedProductItem = {
							id: p?.id || generateUUID(),
							title,
							price: Number(priceNum.toFixed(2)),
							imageUrl: p?.image ?? p?.imageUrl ?? p?.imageURL,
							description: p?.description ?? p?.subtitle ?? undefined,
							category: p?.category ?? undefined,
							supplierName: p?.seller ?? p?.supplierName ?? undefined,
							supplierUrl: p?.sellerUrl ?? p?.supplierUrl ?? undefined,
							rating:
								typeof p?.rating === "number"
									? Math.max(0, Math.min(5, p.rating))
									: undefined,
							reviews:
								typeof p?.reviews === "number" && p.reviews >= 0
									? p.reviews
									: undefined,
							buyerInterest:
								typeof p?.watchers === "number" && p.watchers >= 0
									? p.watchers
									: undefined,
							moq:
								typeof p?.moq === "number" && p.moq >= 0
									? p.moq
									: undefined,
							trustMetrics: p?.trustMetrics
								? {
										yearsActive: p.trustMetrics.yearsActive,
										reorderRate: p.trustMetrics.reorderRate,
										verifiedBadges: p.trustMetrics.verifiedBadges,
									}
								: undefined,
							sourceUrl: p?.link ?? p?.url ?? undefined,
							retrievedAt: new Date().toISOString(),
						};

						return item;
					})
					.filter(Boolean) as NormalizedProductItem[])
			: [];

		// Apply price range, MOQ, supplier verification, and rating filters
		const filteredProducts = mapped.filter((product) => {
			// Apply price range filters
			if (req.filters?.minPrice !== undefined && product.price < req.filters.minPrice) {
				return false;
			}
			if (req.filters?.maxPrice !== undefined && product.price > req.filters.maxPrice) {
				return false;
			}

			// Apply MOQ filter
			if (req.filters?.minMOQ !== undefined && product.moq !== undefined && product.moq < req.filters.minMOQ) {
				return false;
			}

			// Apply supplier verification filter
			if (req.filters?.verifiedSuppliersOnly === true && 
				(!product.trustMetrics || !product.trustMetrics.verifiedBadges || product.trustMetrics.verifiedBadges.length === 0)) {
				return false;
			}

			// Apply rating filter
			if (req.filters?.minRating !== undefined && product.rating !== undefined && product.rating < req.filters.minRating) {
				return false;
			}

			return true;
		});

		return {
			products: filteredProducts,
			nextCursor: raw?.nextCursor ?? undefined,
			source: raw?.source ?? options?.sourceHint,
		};
	} catch (error: any) {
		const message = error?.name === "AbortError" ? "timeout" : String(error);
		console.error("MCP adapter error:", message);
		return { products: [], source: options?.sourceHint };
	}
};
