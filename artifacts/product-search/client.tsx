import { Artifact } from "@/components/create-artifact";
import { DocumentSkeleton } from "@/components/document-skeleton";
import { CopyIcon, FilterIcon, SearchIcon } from "@/components/icons";
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
}

interface ProductSearchMetadata {
	products: Product[];
	query: string;
	totalResults: number;
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
}: {
	product: Product;
	viewMode: ViewMode;
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
							<Badge variant="secondary" className="mt-1 text-xs">
								{product.category}
							</Badge>
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
								onClick={() => handleViewDetails(product)}
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
								<Badge variant="secondary" className="mt-1">
									{product.category}
								</Badge>
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
								onClick={() => handleAddToWishlist(product)}
							>
								<Heart className="size-4 mr-1" />
								Wishlist
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleViewDetails(product)}
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
		const [selectedCategory, setSelectedCategory] = useState<string>("all");

		if (isLoading) {
			return <DocumentSkeleton artifactKind="product-search" />;
		}

		if (!metadata || !metadata.products || metadata.products.length === 0) {
			return (
				<div className="flex items-center justify-center h-96">
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

			// Filter by category
			if (selectedCategory !== "all") {
				filtered = filtered.filter((p) => p.category === selectedCategory);
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
		}, [metadata.products, selectedCategory, sortBy]);

		return (
			<div className="p-6 space-y-6">
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
						<div className="flex flex-wrap items-center gap-4">
							{/* Category Filter */}
							<div className="flex items-center space-x-2">
								<span className="text-sm font-medium">Category:</span>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="px-3 py-1 text-sm border border-border rounded-md bg-background"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category === "all" ? "All Categories" : category}
										</option>
									))}
								</select>
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
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
							: "space-y-4"
					}
				>
					{filteredAndSortedProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							viewMode={viewMode}
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
