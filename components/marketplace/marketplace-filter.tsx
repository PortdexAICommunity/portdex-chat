import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { DataTypes } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useMemo } from "react";

interface MarketplaceFilterProps {
	items: DataTypes[];
	selectedCategories: string[];
	selectedSubcategories: string[];
	selectedUseCases: string[];
	selectedTags: string[];
	searchTerm: string;
	onCategoryChange: (categories: string[]) => void;
	onSubcategoryChange: (subcategories: string[]) => void;
	onUseCaseChange: (useCases: string[]) => void;
	onTagChange: (tags: string[]) => void;
	onSearchChange: (search: string) => void;
	onClearFilters: () => void;
	placeholder?: string;
}

export const MarketplaceFilter = ({
	items,
	selectedCategories,
	selectedSubcategories,
	selectedUseCases,
	selectedTags,
	searchTerm,
	onCategoryChange,
	onSubcategoryChange,
	onUseCaseChange,
	onTagChange,
	onSearchChange,
	onClearFilters,
	placeholder = "Search items...",
}: MarketplaceFilterProps) => {
	// Extract unique values for filters
	const { categories, subcategories, useCases, tags } = useMemo(() => {
		const categoriesSet = new Set<string>();
		const subcategoriesSet = new Set<string>();
		const useCasesSet = new Set<string>();
		const tagsSet = new Set<string>();

		items.forEach((item) => {
			if (item.category) categoriesSet.add(item.category);
			if (item.subcategory) subcategoriesSet.add(item.subcategory);
			if (item.useCase) useCasesSet.add(item.useCase);
			if (item.tags) item.tags.forEach((tag) => tagsSet.add(tag));
		});

		return {
			categories: Array.from(categoriesSet).sort(),
			subcategories: Array.from(subcategoriesSet).sort(),
			useCases: Array.from(useCasesSet).sort(),
			tags: Array.from(tagsSet).sort(),
		};
	}, [items]);

	const handleCategoryToggle = (category: string) => {
		const updated = selectedCategories.includes(category)
			? selectedCategories.filter((c) => c !== category)
			: [...selectedCategories, category];
		onCategoryChange(updated);
	};

	const handleSubcategoryToggle = (subcategory: string) => {
		const updated = selectedSubcategories.includes(subcategory)
			? selectedSubcategories.filter((s) => s !== subcategory)
			: [...selectedSubcategories, subcategory];
		onSubcategoryChange(updated);
	};

	const handleUseCaseToggle = (useCase: string) => {
		const updated = selectedUseCases.includes(useCase)
			? selectedUseCases.filter((u) => u !== useCase)
			: [...selectedUseCases, useCase];
		onUseCaseChange(updated);
	};

	const handleTagToggle = (tag: string) => {
		const updated = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
		onTagChange(updated);
	};

	const activeFiltersCount =
		selectedCategories.length +
		selectedSubcategories.length +
		selectedUseCases.length +
		selectedTags.length;
	const hasActiveFilters = activeFiltersCount > 0 || searchTerm.length > 0;

	return (
		<div className="space-y-4">
			{/* Search and Filter Controls */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				{/* Search */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted size-4" />
					<Input
						placeholder={placeholder}
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 bg-white dark:bg-sidebar border-gray-200 dark:border-gray-700"
					/>
				</div>

				{/* Filter Dropdowns */}
				<div className="flex flex-wrap gap-2">
					{/* Categories Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-9 border-dashed">
								<Filter className="mr-2 size-4" />
								Categories
								{selectedCategories.length > 0 && (
									<Badge className="ml-2 size-5 p-0 flex items-center justify-center">
										{selectedCategories.length}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-64 max-h-80 overflow-y-auto"
						>
							<DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="max-h-64 overflow-y-auto">
								{categories.map((category) => (
									<DropdownMenuCheckboxItem
										key={category}
										checked={selectedCategories.includes(category)}
										onCheckedChange={() => handleCategoryToggle(category)}
									>
										{category}
									</DropdownMenuCheckboxItem>
								))}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Subcategories Filter */}
					{subcategories.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 border-dashed"
								>
									<Filter className="mr-2 size-4" />
									Types
									{selectedSubcategories.length > 0 && (
										<Badge className="ml-2 size-5 p-0 flex items-center justify-center">
											{selectedSubcategories.length}
										</Badge>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56 max-h-80 overflow-y-auto"
							>
								<DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="max-h-64 overflow-y-auto">
									{subcategories.map((subcategory) => (
										<DropdownMenuCheckboxItem
											key={subcategory}
											checked={selectedSubcategories.includes(subcategory)}
											onCheckedChange={() =>
												handleSubcategoryToggle(subcategory)
											}
										>
											{subcategory}
										</DropdownMenuCheckboxItem>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Use Cases Filter */}
					{useCases.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 border-dashed"
								>
									<Filter className="mr-2 size-4" />
									Use Cases
									{selectedUseCases.length > 0 && (
										<Badge className="ml-2 size-5 p-0 flex items-center justify-center">
											{selectedUseCases.length}
										</Badge>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56 max-h-80 overflow-y-auto"
							>
								<DropdownMenuLabel>Filter by Use Case</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="max-h-64 overflow-y-auto">
									{useCases.map((useCase) => (
										<DropdownMenuCheckboxItem
											key={useCase}
											checked={selectedUseCases.includes(useCase)}
											onCheckedChange={() => handleUseCaseToggle(useCase)}
										>
											{useCase}
										</DropdownMenuCheckboxItem>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Tags Filter */}
					{tags.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 border-dashed"
								>
									<Filter className="mr-2 size-4" />
									Tags
									{selectedTags.length > 0 && (
										<Badge className="ml-2 size-5 p-0 flex items-center justify-center">
											{selectedTags.length}
										</Badge>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-52 max-h-80 overflow-y-auto"
							>
								<DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="max-h-64 overflow-y-auto">
									{tags.map((tag) => (
										<DropdownMenuCheckboxItem
											key={tag}
											checked={selectedTags.includes(tag)}
											onCheckedChange={() => handleTagToggle(tag)}
										>
											{tag}
										</DropdownMenuCheckboxItem>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Clear Filters */}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilters}
							className="h-9 px-2 lg:px-3"
						>
							Clear
							<X className="ml-2 size-4" />
						</Button>
					)}
				</div>
			</div>

			{/* Active Filters Display */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="flex flex-wrap gap-2"
					>
						{searchTerm && (
							<Badge variant="secondary" className="gap-1">
								Search: {searchTerm}
								<X
									className="size-3 cursor-pointer"
									onClick={() => onSearchChange("")}
								/>
							</Badge>
						)}
						{selectedCategories.map((category) => (
							<Badge key={category} variant="secondary" className="gap-1">
								Category: {category}
								<X
									className="size-3 cursor-pointer"
									onClick={() => handleCategoryToggle(category)}
								/>
							</Badge>
						))}
						{selectedSubcategories.map((subcategory) => (
							<Badge key={subcategory} variant="secondary" className="gap-1">
								Type: {subcategory}
								<X
									className="size-3 cursor-pointer"
									onClick={() => handleSubcategoryToggle(subcategory)}
								/>
							</Badge>
						))}
						{selectedUseCases.map((useCase) => (
							<Badge key={useCase} variant="secondary" className="gap-1">
								Use Case: {useCase}
								<X
									className="size-3 cursor-pointer"
									onClick={() => handleUseCaseToggle(useCase)}
								/>
							</Badge>
						))}
						{selectedTags.map((tag) => (
							<Badge key={tag} variant="secondary" className="gap-1">
								#{tag}
								<X
									className="size-3 cursor-pointer"
									onClick={() => handleTagToggle(tag)}
								/>
							</Badge>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
