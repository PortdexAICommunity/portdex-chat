"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React from "react";

interface MarketplaceFilterProps {
	categories: Array<{ name: string; count: number }>;
	selectedCategory: string | null;
	searchTerm: string;
	totalItems: number;
	onCategoryChange: (category: string | null) => void;
	onSearchChange: (search: string) => void;
	onClearFilters: () => void;
	title: string;
	placeholder?: string;
}

export const MarketplaceFilter = ({
	categories,
	selectedCategory,
	searchTerm,
	totalItems,
	onCategoryChange,
	onSearchChange,
	onClearFilters,
	title,
	placeholder = "Search...",
}: MarketplaceFilterProps) => {
	const hasActiveFilters = selectedCategory !== null || searchTerm.length > 0;

	return (
		<div className="w-full lg:w-72 shrink-0 space-y-4 lg:space-y-6">
			{/* Header */}
			<div className="space-y-3 lg:space-y-4">
				<div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between gap-2">
					<h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
						{title}
					</h2>
					<Badge variant="secondary" className="text-xs">
						{totalItems} items
					</Badge>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
					<Input
						placeholder={placeholder}
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
					/>
				</div>

				{/* Clear Filters */}
				<AnimatePresence>
					{hasActiveFilters && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
						>
							<Button
								variant="ghost"
								size="sm"
								onClick={onClearFilters}
								className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							>
								<X className="mr-2 size-4" />
								Clear all filters
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Categories */}
			<div className="space-y-2 lg:space-y-3">
				<h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
					Categories
				</h3>

				<ScrollArea className="h-[300px] lg:h-[400px] xl:h-[500px] w-full">
					<div className="space-y-1 pr-3 lg:pr-6 w-full">
						{/* All Categories */}
						<button
							type="button"
							onClick={() => onCategoryChange(null)}
							className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
								selectedCategory === null
									? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
							}`}
						>
							<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
								<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
									<div className="size-1.5 lg:size-2 bg-white rounded-full" />
								</div>
								<span className="font-medium truncate">All</span>
							</div>
							<Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
								{categories.reduce((sum, cat) => sum + cat.count, 0)}
							</Badge>
						</button>

						{/* Individual Categories */}
						{categories.map((category) => (
							<button
								key={category.name}
								type="button"
								onClick={() => onCategoryChange(category.name)}
								className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
									selectedCategory === category.name
										? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
							>
								<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
									<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
										<span className="text-xs text-white font-medium">
											{category.name.charAt(0).toUpperCase()}
										</span>
									</div>
									<span className="text-left truncate">{category.name}</span>
								</div>
								<Badge
									variant="secondary"
									className="text-xs flex-shrink-0 ml-2"
								>
									{category.count}
								</Badge>
							</button>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Active Filters Display */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="space-y-2"
					>
						<h3 className="text-sm font-medium text-gray-900 dark:text-white">
							Active Filters
						</h3>
						<div className="space-y-2">
							{searchTerm && (
								<div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<span className="text-sm text-blue-900 dark:text-blue-100">
										Search: &ldquo;{searchTerm}&rdquo;
									</span>
									<button
										type="button"
										onClick={() => onSearchChange("")}
										className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
									>
										<X className="size-4" />
									</button>
								</div>
							)}
							{selectedCategory && (
								<div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
									<span className="text-sm text-purple-900 dark:text-purple-100">
										Category: {selectedCategory}
									</span>
									<button
										type="button"
										onClick={() => onCategoryChange(null)}
										className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
									>
										<X className="size-4" />
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
