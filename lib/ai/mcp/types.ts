export type MCPProductSearchRequest = {
	query: string;
	filters?: {
		category?: string;
		minPrice?: number;
		maxPrice?: number;
		minMOQ?: number;
		verifiedSuppliersOnly?: boolean;
		minRating?: number;
	};
	paging?: {
		limit?: number;
		cursor?: string;
	};
};

export type SupplierTrustMetrics = {
	yearsActive?: number;
	reorderRate?: number; // 0..1
	verifiedBadges?: string[];
};

export type NormalizedProductItem = {
	id: string;
	title: string;
	price: number; // normalized numeric price for UI
	imageUrl?: string;
	description?: string;
	category?: string;
	supplierName?: string;
	supplierUrl?: string;
	rating?: number; // 0..5
	reviews?: number;
	buyerInterest?: number;
	trustMetrics?: SupplierTrustMetrics;
	moq?: number; // Minimum Order Quantity
	sourceUrl?: string; // direct listing URL
	retrievedAt: string; // ISO timestamp
};

export type MCPProductSearchResponse = {
	products: NormalizedProductItem[];
	nextCursor?: string;
	source?: string; // e.g. 'ebay', 'amazon'
};
