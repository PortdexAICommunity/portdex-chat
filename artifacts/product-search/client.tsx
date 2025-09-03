import { Artifact } from "@/components/create-artifact";
import { DocumentSkeleton } from "@/components/document-skeleton";
import { CopyIcon, FilterIcon, SearchIcon } from "@/components/icons";
import { CollapsibleFilterPanel } from "@/components/collapsible-filter-panel";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	ArrowUpDown,
	Grid3X3,
	List,
	Heart,
	ShoppingCart,
	ExternalLink,
} from "lucide-react";

interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	description: string;
	category: string;
	rating: number;
	reviews: number;
	moq?: number;
	verified?: boolean;
}

interface ProductSearchMetadata {
	products: Product[];
	query: string;
	totalResults: number;
	minPrice?: number;
	maxPrice?: number;
	minMOQ?: number;
	verifiedSuppliersOnly?: boolean;
	minRating?: number;
}

type SortOption = "name" | "price-low" | "price-high" | "rating" | "reviews";
type ViewMode = "grid" | "list";

const handleAddToWishlist = (product: Product) => {
	toast.success(`${product.name} added to wishlist!`);
};

const handleAddToCart = (product: Product) => {
	toast.success(`${product.name} added to cart!`);
};

const handleViewDetails = (product: Product) => {
	toast.info(`Viewing details for ${product.name}`);
};

function ProductCard({
	product,
	viewMode,
	onViewDetails,
}: {
	product: Product;
	viewMode: ViewMode;
	onViewDetails: (product: Product) => void;
}) {
	const isGridView = viewMode === "grid";

	if (isGridView) {
		return (
			<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
				<div className="relative">
					<img
						src={product.image}
						alt={product.name}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80`;
						}}
					/>
					<Button
						size="sm"
						variant="secondary"
						className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
						onClick={() => handleAddToWishlist(product)}
						aria-label={`Add ${product.name} to wishlist`}
					>
						<Heart className="size-4" />
					</Button>
				</div>
				<CardContent className="p-4">
					<div className="space-y-3">
						<div>
							<h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
								{product.name}
							</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge variant="secondary" className="text-xs">
									{product.category}
								</Badge>
								{product.verified && (
									<Badge variant="default" className="text-xs">
										Verified
									</Badge>
								)}
							</div>
						</div>

						<p className="text-muted-foreground text-sm line-clamp-2">
							{product.description}
						</p>

						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="text-2xl font-bold text-green-600">
									${product.price.toFixed(2)}
								</div>
								<div className="flex items-center space-x-1">
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<span
												key={`grid-star-${i}`}
												className={`text-sm ${
													i < product.rating
														? "text-yellow-500"
														: "text-gray-300"
												}`}
											>
												★
											</span>
										))}
									</div>
									<span className="text-sm text-muted-foreground">
										({product.reviews})
									</span>
								</div>
							</div>
						</div>

						<div className="flex space-x-2">
							<Button
								size="sm"
								className="flex-1"
								onClick={() => handleAddToCart(product)}
							>
								<ShoppingCart className="size-4 mr-1" />
								Add to Cart
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => onViewDetails(product)}
								aria-label={`View details for ${product.name}`}
							>
								<ExternalLink className="size-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// List view
	return (
		<Card className="group hover:shadow-md transition-all duration-200">
			<CardContent className="p-4">
				<div className="flex space-x-4">
					<img
						src={product.image}
						alt={product.name}
						className="size-24 object-cover rounded-lg shrink-0"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&q=80`;
						}}
					/>
					<div className="flex-1 space-y-2">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
									{product.name}
								</h3>
								<div className="flex items-center gap-2 mt-1">
									<Badge variant="secondary">
										{product.category}
									</Badge>
									{product.verified && (
										<Badge variant="default">
											Verified
										</Badge>
									)}
								</div>
							</div>
							<div className="text-right">
								<div className="text-xl font-bold text-green-600">
									${product.price.toFixed(2)}
								</div>
								<div className="flex items-center space-x-1">
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<span
												key={`list-star-${i}`}
												className={`text-sm ${
													i < product.rating
														? "text-yellow-500"
														: "text-gray-300"
												}`}
											>
												★
											</span>
										))}
									</div>
									<span className="text-sm text-muted-foreground">
										({product.reviews})
									</span>
								</div>
							</div>
						</div>

						<p className="text-muted-foreground text-sm line-clamp-2">
							{product.description}
						</p>

						<div className="flex space-x-2">
							<Button size="sm" onClick={() => handleAddToCart(product)}>
								<ShoppingCart className="size-4 mr-1" />
								Add to Cart
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => onViewDetails(product)}
							>
								<ExternalLink className="size-4 mr-1" />
								Details
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function ProductDetailView({ product, onBack }: { product: Product; onBack: () => void }) {
	return (
		<div className="p-6">
			<Button variant="ghost" onClick={onBack} className="mb-4">
				&larr; Back to results
			</Button>
			<div className="space-y-4">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-64 object-cover rounded-lg"
				/>
				<div>
					<h2 className="text-2xl font-bold">{product.name}</h2>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="secondary">{product.category}</Badge>
						{product.verified && <Badge variant="default">Verified</Badge>}
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="text-3xl font-bold text-green-600">
						${product.price.toFixed(2)}
					</div>
					<div className="flex items-center space-x-1">
						<div className="flex">
							{[...Array(5)].map((_, i) => (
								<span key={`detail-star-${i}`} className={`text-lg ${i < product.rating ? "text-yellow-500" : "text-gray-300"}`}>★</span>
							))}
						</div>
						<span className="text-muted-foreground">({product.reviews} reviews)</span>
					</div>
				</div>
				<p className="text-muted-foreground">{product.description}</p>
				<div className="flex space-x-2 pt-4">
					<Button size="lg" className="flex-1" onClick={() => handleAddToCart(product)}>
						<ShoppingCart className="size-5 mr-2" />
						Add to Cart
					</Button>
					<Button size="lg" variant="outline" onClick={() => handleAddToWishlist(product)}>
						<Heart className="size-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export const productSearchArtifact = new Artifact<
	"product-search",
	ProductSearchMetadata
>({
	kind: "product-search",
	description:
		"Advanced product search results display with filtering and sorting",
	initialize: async ({ setMetadata }) => {
		setMetadata({
			products: [],
			query: "",
			totalResults: 0,
		});
	},
	onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
		if (streamPart.type === "product-results") {
			const data = JSON.parse(streamPart.content as string);
			setMetadata({
				products: data.products,
				query: data.query,
				totalResults: data.totalResults,
				minPrice: data.minPrice,
				maxPrice: data.maxPrice,
				minMOQ: data.minMOQ,
				verifiedSuppliersOnly: data.verifiedSuppliersOnly,
				minRating: data.minRating,
			});

			setArtifact((draftArtifact) => {
				return {
					...draftArtifact,
					content: `Found ${data.totalResults} products matching "${data.query}"`,
					isVisible: true,
					status: "streaming",
				};
			});
		}
	},
	content: ({
		mode,
		status,
		content,
		isCurrentVersion,
		currentVersionIndex,
		onSaveContent,
		getDocumentContentById,
		isLoading,
		metadata,
	}) => {
		const [sortBy, setSortBy] = useState<SortOption>("name");
		const [viewMode, setViewMode] = useState<ViewMode>("grid");
		const [minPrice, setMinPrice] = useState<number | undefined>(metadata?.minPrice);
		const [maxPrice, setMaxPrice] = useState<number | undefined>(metadata?.maxPrice);
		const [minMOQ, setMinMOQ] = useState<number | undefined>(metadata?.minMOQ);
		const [verifiedSuppliersOnly, setVerifiedSuppliersOnly] = useState<boolean | undefined>(metadata?.verifiedSuppliersOnly);
		const [minRating, setMinRating] = useState<number | undefined>(metadata?.minRating);
		const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

		if (isLoading) {
			return <DocumentSkeleton artifactKind="product-search" />;
		}

		if (!metadata || !metadata.products || metadata.products.length === 0) {
			return (
				<div className="fixed top-0 right-0 h-full w-[30%] bg-background border-l z-50 overflow-y-auto shadow-2xl">
					<div className="p-6 space-y-6">
						<div className="text-center space-y-4">
							<div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center">
								<SearchIcon size={32} />
							</div>
							<div>
								<h3 className="text-lg font-medium text-foreground mb-2">
									No products found
								</h3>
								<p className="text-muted-foreground">
									Try adjusting your search terms or filters.
								</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		const categories = useMemo(() => {
			const uniqueCategories = [
				...new Set(metadata.products.map((p) => p.category)),
			];
			return ["all", ...uniqueCategories];
		}, [metadata.products]);

		const filteredAndSortedProducts = useMemo(() => {
			let filtered = metadata.products;

			// Filter by price range
			if (minPrice !== undefined) {
				filtered = filtered.filter((p) => p.price >= minPrice);
			}
			if (maxPrice !== undefined) {
				filtered = filtered.filter((p) => p.price <= maxPrice);
			}

			// Filter by MOQ
			if (minMOQ !== undefined) {
				filtered = filtered.filter((p) => (p.moq ?? 1) >= minMOQ);
			}

			// Filter by supplier verification
			if (verifiedSuppliersOnly === true) {
				filtered = filtered.filter((p) => p.verified === true);
			}

			// Filter by rating
			if (minRating !== undefined) {
				filtered = filtered.filter((p) => p.rating >= minRating);
			}

			// Sort products
			const sorted = [...filtered].sort((a, b) => {
				switch (sortBy) {
					case "name":
						return a.name.localeCompare(b.name);
					case "price-low":
						return a.price - b.price;
					case "price-high":
						return b.price - a.price;
					case "rating":
						return b.rating - a.rating;
					case "reviews":
						return b.reviews - a.reviews;
					default:
						return 0;
				}
			});

			return sorted;
		}, [metadata.products, sortBy, minPrice, maxPrice, minMOQ, verifiedSuppliersOnly, minRating]);

		const handleClearFilters = () => {
			setMinPrice(undefined);
			setMaxPrice(undefined);
			setMinMOQ(undefined);
			setVerifiedSuppliersOnly(undefined);
			setMinRating(undefined);
		};

		const handleViewDetails = (product: Product) => {
			setSelectedProduct(product);
		};

		const handleBack = () => {
			setSelectedProduct(null);
		};

		return (
			<div className="fixed top-0 right-0 h-full w-[30%] bg-background border-l z-50 overflow-y-auto shadow-2xl">
				<div className="p-6 space-y-6">
					{selectedProduct ? (
						<ProductDetailView product={selectedProduct} onBack={handleBack} />
					) : (
						<>
							{/* Header */}
							<div className="space-y-4">
								<div>
									<h1 className="text-3xl font-bold tracking-tight">
										Search Results
									</h1>
									<p className="text-muted-foreground">
										Found {filteredAndSortedProducts.length} of{" "}
										{metadata.totalResults} products for "{metadata.query}"
									</p>
								</div>

								{/* Controls */}
								<div className="flex flex-wrap items-center justify-between gap-4">
									<div className="w-full">
										<CollapsibleFilterPanel
											onFiltersChange={(filters) => {
												setMinPrice(filters.minPrice);
												setMaxPrice(filters.maxPrice);
												setMinMOQ(filters.minMOQ);
												setVerifiedSuppliersOnly(filters.verifiedSuppliersOnly);
												setMinRating(filters.minRating);
											}}
											initialFilters={{
												minPrice: metadata?.minPrice,
												maxPrice: metadata?.maxPrice,
												minMOQ: metadata?.minMOQ,
												verifiedSuppliersOnly: metadata?.verifiedSuppliersOnly,
												minRating: metadata?.minRating,
											}}
											appliedFiltersCount={
												(metadata?.minPrice ? 1 : 0) +
												(metadata?.maxPrice ? 1 : 0) +
												(metadata?.minMOQ ? 1 : 0) +
												(metadata?.verifiedSuppliersOnly ? 1 : 0) +
												(metadata?.minRating ? 1 : 0)
											}
										/>
									</div>

									{/* Sort Options */}
									<div className="flex items-center space-x-2">
										<span className="text-sm font-medium">Sort by:</span>
										<select
											value={sortBy}
											onChange={(e) => setSortBy(e.target.value as SortOption)}
											className="px-3 py-1 text-sm border border-border rounded-md bg-background"
										>
											<option value="name">Name</option>
											<option value="price-low">Price: Low to High</option>
											<option value="price-high">Price: High to Low</option>
											<option value="rating">Rating</option>
											<option value="reviews">Most Reviews</option>
										</select>
									</div>

									{/* View Mode Toggle */}
									<div className="flex items-center space-x-1 border border-border rounded-md p-1">
										<Button
											size="sm"
											variant={viewMode === "grid" ? "default" : "ghost"}
											onClick={() => setViewMode("grid")}
											className="px-3"
										>
											<Grid3X3 className="size-4" />
										</Button>
										<Button
											size="sm"
											variant={viewMode === "list" ? "default" : "ghost"}
											onClick={() => setViewMode("list")}
											className="px-3"
										>
											<List className="size-4" />
										</Button>
									</div>
								</div>
							</div>

							{/* Products Display */}
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 md:grid-cols-2 gap-6"
										: "space-y-4"
								}
							>
								{filteredAndSortedProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										viewMode={viewMode}
										onViewDetails={handleViewDetails}
									/>
								))}
							</div>

							{/* Results Summary */}
							<div className="text-center pt-6 border-t border-border">
								<p className="text-sm text-muted-foreground">
									Showing {filteredAndSortedProducts.length} of{" "}
									{metadata.totalResults} products
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		);
	},
	actions: [
		{
			icon: <CopyIcon size={18} />,
			description: "Copy product list",
			onClick: ({ metadata }) => {
				if (metadata?.products) {
					const productList = metadata.products
						.map(
							(p) =>
								`${p.name} - $${p.price.toFixed(2)} (${p.category}) - Rating: ${
									p.rating
								}/5`
						)
						.join("\n");
					navigator.clipboard.writeText(productList);
					toast.success("Product list copied to clipboard!");
				}
			},
		},
		{
			icon: <ShoppingCart className="size-4" />,
			description: "Add all to cart",
			onClick: ({ metadata }) => {
				if (metadata?.products && metadata.products.length > 0) {
					toast.success(`Added ${metadata.products.length} products to cart!`);
				}
			},
		},
	],
	toolbar: [
		{
			icon: <SearchIcon size={16} />,
			description: "Refine search",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Please help me refine this product search with more specific criteria or keywords.",
				});
			},
		},
		{
			icon: <FilterIcon size={16} />,
			description: "Advanced filters",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Show me products with specific filters like price range, brand, or features.",
				});
			},
		},
		{
			icon: <ArrowUpDown className="size-4" />,
			description: "Sort options",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Please sort these products by different criteria like popularity, newest, or customer ratings.",
				});
			},
		},
	],
});
