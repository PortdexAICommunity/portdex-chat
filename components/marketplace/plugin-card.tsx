"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DataTypes } from "@/lib/types";

interface PluginCardProps {
	plugin: DataTypes;
	onClick: () => void;
}

export function PluginCard({ plugin, onClick }: PluginCardProps) {
	return (
		<motion.div
			whileHover={{ y: -5, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="cursor-pointer h-full"
		>
			<Card
				className="h-full bg-white dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600/50 flex flex-col"
				onClick={onClick}
			>
				<CardHeader className="pb-3 flex-shrink-0">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-h-[4rem]">
							<h3 className="text-gray-900 dark:text-white font-semibold text-base mb-2 line-clamp-2 pr-3 leading-tight">
								{plugin.name}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
								@{plugin.creator}
							</p>
						</div>
						<div className="size-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl flex items-center justify-center text-xl shadow-sm border border-purple-200 dark:border-purple-700/50 shrink-0">
							{plugin.icon}
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0 flex-1 flex flex-col justify-between">
					<p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
						{plugin.description}
					</p>

					<div className="flex items-center justify-between mt-auto">
						<Badge
							variant="secondary"
							className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
						>
							{plugin.category}
						</Badge>

						<motion.div
							className="text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
						>
							Install →
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
