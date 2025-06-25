"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { marketplaceItems } from "@/lib/constants";
import type { MarketplaceItem } from "@/lib/types";
import Link from "next/link";
import { Calendar, Download, Sparkles, User } from "lucide-react";

interface MarketplaceItemCardProps {
	item: MarketplaceItem;
	index: number;
	onCardClick: (item: MarketplaceItem) => void;
}

interface MarketplaceItemDialogProps {
	item: MarketplaceItem | null;
	isOpen: boolean;
	onClose: () => void;
}

const MarketplaceItemDialog = ({ item, isOpen, onClose }: MarketplaceItemDialogProps) => {
	if (!item) return null;

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "courses":
				return "📚";
			case "tutors":
				return "👨‍🏫";
			case "resources":
				return "📖";
			case "ai-models":
				return "🤖";
			case "software":
				return "💻";
			case "templates":
				return "🎨";
			default:
				return "📄";
		}
	};

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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800/50 text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader className="pb-6 pr-10">
						<div className="space-y-3">
							<DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
								{item.title} {getCategoryIcon(item.category)}
							</DialogTitle>
							<Badge
								variant="secondary"
								className={`${getCategoryColor(item.category)} w-fit`}
							>
								{item.category.charAt(0).toUpperCase() + item.category.slice(1)}
							</Badge>
						</div>
					</DialogHeader>

					<div className="space-y-6">
						{/* Visual Header */}
						<Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-gray-200 dark:border-gray-800/50">
							<CardContent className="p-6">
								<div className="h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl relative overflow-hidden mb-4 flex items-center justify-center">
									<div className="text-4xl">
										{getCategoryIcon(item.category)}
									</div>
								</div>
								<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
									<div className="flex items-center gap-1">
										<User className="size-4" />
										<span>renhai-lab</span>
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="size-4" />
										<span>2025-06-17</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Description */}
						<div>
							<h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
								<Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
								Description
							</h4>
							<Card className="bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50">
								<CardContent className="p-4">
									<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
										{item.description}
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4">
							<Button
								className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
								onClick={() => {
									console.log(`Using ${item.title}`);
									onClose();
								}}
							>
								<Download className="size-4 mr-2" />
								Use Assistant
							</Button>
							<Button
								variant="outline"
								className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:w-auto"
								onClick={onClose}
							>
								Close
							</Button>
						</div>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};

const MarketplaceItemCard = ({ item, index, onCardClick }: MarketplaceItemCardProps) => {
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

	const handleCardClick = () => {
		onCardClick(item);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="cursor-pointer h-full"
			onClick={handleCardClick}
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
	const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleShowMore = () => {
		const nextCount = showCount + 8;
		setShowCount(Math.min(nextCount, marketplaceItems.length));
	};

	const handleGoToMarketplace = () => {
		router.push("/marketplace");
	};

	const handleCardClick = (item: MarketplaceItem) => {
		setSelectedItem(item);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedItem(null);
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
						<MarketplaceItemCard 
							key={item.id} 
							item={item} 
							index={index} 
							onCardClick={handleCardClick}
						/>
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
					<Link href={"/marketplace"} className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-500 to-purple-800 text-transparent bg-clip-text font-semibold">Take Me to Marketplace</Link>
				</motion.div>
			</div>

			{/* Dialog */}
			<MarketplaceItemDialog
				item={selectedItem}
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
			/>
		</div>
	);
};
