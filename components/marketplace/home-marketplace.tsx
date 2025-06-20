"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { marketplaceItems } from "@/lib/constants";
import type { MarketplaceItem } from "@/lib/types";

interface MarketplaceItemCardProps {
	item: MarketplaceItem;
	index: number;
}

const MarketplaceItemCard = ({ item, index }: MarketplaceItemCardProps) => {
	const getCategoryColor = (category: string) => {
		switch (category) {
			case "courses":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case "tutors":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			case "resources":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
			case "ai-models":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
			case "software":
				return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
			case "templates":
				return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="cursor-pointer h-full"
		>
			<Card className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50 flex flex-col group">
				<div className="relative overflow-hidden rounded-t-lg">
					<div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 flex items-center justify-center">
						<div className="text-4xl">
							{item.category === "courses" && "📚"}
							{item.category === "tutors" && "👨‍🏫"}
							{item.category === "resources" && "📖"}
							{item.category === "ai-models" && "🤖"}
							{item.category === "software" && "💻"}
							{item.category === "templates" && "🎨"}
						</div>
					</div>
					<div className="absolute top-3 right-3">
						<Badge className={getCategoryColor(item.category)}>
							{item.category.charAt(0).toUpperCase() + item.category.slice(1)}
						</Badge>
					</div>
				</div>

				<CardContent className="p-4 flex-1 flex flex-col">
					<h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 line-clamp-2 leading-tight">
						{item.title}
					</h3>

					<p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
						{item.description}
					</p>

					<div className="flex items-center justify-between mt-auto">
						<span className="text-gray-400 dark:text-gray-500 text-xs">
							Learn More
						</span>
						<motion.div
							className="text-purple-600 dark:text-purple-400 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity"
							initial={{ opacity: 0.7 }}
							whileHover={{ opacity: 1 }}
						>
							→
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export const HomeMarketplace = () => {
	const router = useRouter();
	const [showCount, setShowCount] = useState(8);

	const handleShowMore = () => {
		const nextCount = showCount + 8;
		setShowCount(Math.min(nextCount, marketplaceItems.length));
	};

	const handleGoToMarketplace = () => {
		router.push("/marketplace");
	};

	const visibleItems = marketplaceItems.slice(0, showCount);
	const hasMoreItems = showCount < marketplaceItems.length;

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="text-center mb-8">
				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
				>
					Explore Our Marketplace
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
				>
					Discover courses, mentors, resources, AI models, software tools, and
					templates to accelerate your tech journey
				</motion.p>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
				<AnimatePresence>
					{visibleItems.map((item, index) => (
						<MarketplaceItemCard key={item.id} item={item} index={index} />
					))}
				</AnimatePresence>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
				{hasMoreItems && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
					>
						<Button
							onClick={handleShowMore}
							variant="outline"
							size="lg"
							className="w-full sm:w-auto min-w-[200px] border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
						>
							Show More ({marketplaceItems.length - showCount} remaining)
						</Button>
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3 }}
				>
					<Button
						onClick={handleGoToMarketplace}
						size="lg"
						className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
					>
						Take Me to Marketplace
					</Button>
				</motion.div>
			</div>
		</div>
	);
};
