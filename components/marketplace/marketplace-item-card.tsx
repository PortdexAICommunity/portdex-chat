"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DataTypes } from "@/lib/types";

type ItemType = "assistant" | "plugin" | "ai-model" | "software" | "template";

interface MarketplaceItemCardProps {
	item: DataTypes;
	type: ItemType;
	onClick: () => void;
}

// Color schemes for different item types
const getColorScheme = (type: ItemType) => {
	switch (type) {
		case "assistant":
			return {
				badge:
					"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50",
				action: "View →",
				hasGradient: true,
			};
		case "plugin":
			return {
				badge:
					"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50",
				action: "Install →",
				hasGradient: false,
			};
		case "ai-model":
			return {
				badge:
					"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50",
				action: "Use Model →",
				hasGradient: true,
			};
		case "software":
			return {
				badge:
					"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50",
				action: "Download →",
				hasGradient: false,
			};
		case "template":
			return {
				badge:
					"bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50",
				action: "Use Template →",
				hasGradient: true,
			};
		default:
			return {
				badge:
					"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50",
				action: "View →",
				hasGradient: false,
			};
	}
};

export function MarketplaceItemCard({
	item,
	type,
	onClick,
}: MarketplaceItemCardProps) {
	const colorScheme = getColorScheme(type);

	// Plugin-style layout (horizontal with icon on the right)
	if (type === "plugin" || type === "software") {
		return (
			<motion.div
				whileHover={{ y: -2, scale: 1.01 }}
				whileTap={{ scale: 0.98 }}
				className="cursor-pointer h-full"
			>
				<Card
					className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50 flex flex-col group touch-manipulation"
					onClick={onClick}
				>
					<CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6 flex-shrink-0">
						<div className="flex items-start justify-between gap-2 sm:gap-3">
							<div className="flex-1 min-w-0">
								<h3 className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2 leading-tight">
									{item.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
									{item.creator.startsWith("@")
										? item.creator
										: `@${item.creator}`}
								</p>
							</div>
							<div className="size-10 sm:size-11 lg:size-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg lg:text-xl shadow-sm border border-purple-200 dark:border-purple-700/50 shrink-0">
								{item.icon}
							</div>
						</div>
					</CardHeader>

					<CardContent className="pt-0 p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
						<p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed flex-1">
							{item.description}
						</p>

						<div className="flex items-center justify-between gap-2 mt-auto">
							<Badge
								variant="secondary"
								className={`${colorScheme.badge} transition-colors text-xs sm:text-sm px-2 py-1 truncate flex-1 min-w-0 justify-center`}
							>
								{item.category}
							</Badge>

							<motion.div
								className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
								initial={{ opacity: 0.7 }}
								whileHover={{ opacity: 1 }}
							>
								<span className="hidden sm:inline">{colorScheme.action}</span>
								<span className="sm:hidden">→</span>
							</motion.div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	// Assistant-style layout (vertical with gradient banner)
	return (
		<motion.div
			whileHover={{ y: -2, scale: 1.01 }}
			whileTap={{ scale: 0.98 }}
			className="cursor-pointer h-full"
		>
			<Card
				className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50 flex flex-col group touch-manipulation"
				onClick={onClick}
			>
				<CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6 flex-shrink-0">
					{colorScheme.hasGradient && item.gradient ? (
						<div
							className={`h-16 sm:h-18 lg:h-20 w-full bg-gradient-to-r ${item.gradient} rounded-lg mb-2 sm:mb-3 relative overflow-hidden`}
						>
							<div className="absolute inset-0 bg-black/10" />
							<div className="absolute -bottom-1.5 sm:-bottom-2 -right-1.5 sm:-right-2 size-8 sm:size-9 lg:size-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-base sm:text-lg lg:text-xl shadow-lg border-2 border-white dark:border-gray-700/50">
								{item.icon}
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-16 sm:h-18 lg:h-20 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl">
							{item.icon}
						</div>
					)}
				</CardHeader>

				<CardContent className="pt-0 p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
					<h3 className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 line-clamp-1 leading-tight">
						{item.name}
					</h3>

					<div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm">
						<span className="text-gray-600 dark:text-gray-400 font-medium truncate flex-1 min-w-0">
							{item.creator}
						</span>
						{item.date && (
							<span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
								{item.date}
							</span>
						)}
					</div>

					<p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed flex-1">
						{item.description}
					</p>

					<div className="flex items-center justify-between gap-2 mt-auto">
						<Badge
							variant="secondary"
							className={`${colorScheme.badge} transition-colors text-xs sm:text-sm px-2 py-1 truncate flex-1 min-w-0 justify-center`}
						>
							{item.category}
						</Badge>

						<motion.div
							className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
							initial={{ opacity: 0.7 }}
							whileHover={{ opacity: 1 }}
						>
							<span className="hidden sm:inline">{colorScheme.action}</span>
							<span className="sm:hidden">→</span>
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
