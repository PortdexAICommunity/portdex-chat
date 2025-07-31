"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AIModelCard } from "./ai-model-card";
import { AssistantCard } from "./assistant-card";
import { MCPServerCard } from "./mcp-server-card";
import { WorkflowCard } from "./workflow-card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type { DataTypes, MCPServerType, WorkflowType } from "@/lib/types";

type FilterType = "all" | "assistant" | "ai-model" | "mcp-server" | "workflow";

interface FeaturedItemsProps {
	assistants: DataTypes[];
	aiModels: DataTypes[];
	mcpServers: MCPServerType[];
	workflows: WorkflowType[];
	onItemClick: (
		item: any,
		type: "assistant" | "ai-model" | "mcp-server" | "workflow"
	) => void;
	title?: string;
	defaultShowAssistantsAndWorkflows?: boolean;
}

export function FeaturedMarketplaceSection({
	assistants,
	aiModels,
	mcpServers,
	workflows,
	onItemClick,
	title = "Featured Items",
	defaultShowAssistantsAndWorkflows = false,
}: FeaturedItemsProps) {
	const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

	// Count items for each category
	const counts = {
		all: defaultShowAssistantsAndWorkflows
			? assistants.length + workflows.length
			: assistants.length +
				aiModels.length +
				mcpServers.length +
				workflows.length,
		assistant: assistants.length,
		"ai-model": aiModels.length,
		"mcp-server": mcpServers.length,
		workflow: workflows.length,
	};

	// Filter items based on selected filter
	const getFilteredItems = () => {
		switch (selectedFilter) {
			case "assistant":
				return assistants.map((item) => ({
					item,
					type: "assistant" as const,
				}));
			case "ai-model":
				return aiModels.map((item) => ({
					item,
					type: "ai-model" as const,
				}));
			case "mcp-server":
				return mcpServers.map((item) => ({
					item,
					type: "mcp-server" as const,
				}));
			case "workflow":
				return workflows.map((item) => ({
					item,
					type: "workflow" as const,
				}));
			default:
				// When defaultShowAssistantsAndWorkflows is true, only show assistants and workflows in the "all" view
				if (defaultShowAssistantsAndWorkflows) {
					return [
						...assistants.map((item) => ({
							item,
							type: "assistant" as const,
						})),
						...workflows.map((item) => ({
							item,
							type: "workflow" as const,
						})),
					];
				}
				// Otherwise combine all items
				return [
					...assistants.map((item) => ({
						item,
						type: "assistant" as const,
					})),
					...aiModels.map((item) => ({
						item,
						type: "ai-model" as const,
					})),
					...mcpServers.map((item) => ({
						item,
						type: "mcp-server" as const,
					})),
					...workflows.map((item) => ({
						item,
						type: "workflow" as const,
					})),
				];
		}
	};

	const filteredItems = getFilteredItems();

	return (
		<div className="w-full">
			<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
				{/* Left sidebar with filters */}
				<div className="w-full lg:w-72 shrink-0 space-y-4 lg:space-y-6">
					<div className="space-y-3 lg:space-y-4">
						<div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between gap-2">
							<h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
								{title}
							</h2>
							<Badge variant="secondary" className="text-xs">
								{counts[selectedFilter]} items
							</Badge>
						</div>
					</div>

					{/* Filter Categories */}
					<div className="space-y-2 lg:space-y-3">
						<h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
							Filter By
						</h3>

						<ScrollArea className="h-auto max-h-[300px] w-full">
							<div className="space-y-1 pr-3 lg:pr-6 w-full">
								{/* All Items */}
								<button
									type="button"
									onClick={() => setSelectedFilter("all")}
									className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
										selectedFilter === "all"
											? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
										<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
											<div className="size-1.5 lg:size-2 bg-white rounded-full" />
										</div>
										<span className="font-medium truncate">All</span>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0 ml-2">
										{counts.all}
									</Badge>
								</button>

								{/* Assistants */}
								<button
									type="button"
									onClick={() => setSelectedFilter("assistant")}
									className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
										selectedFilter === "assistant"
											? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
										<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
											<span className="text-xs text-white font-medium">A</span>
										</div>
										<span className="text-left truncate">Assistants</span>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0 ml-2">
										{counts.assistant}
									</Badge>
								</button>

								{/* AI Models */}
								<button
									type="button"
									onClick={() => setSelectedFilter("ai-model")}
									className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
										selectedFilter === "ai-model"
											? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
										<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
											<span className="text-xs text-white font-medium">M</span>
										</div>
										<span className="text-left truncate">AI Models</span>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0 ml-2">
										{counts["ai-model"]}
									</Badge>
								</button>

								{/* MCP Servers */}
								<button
									type="button"
									onClick={() => setSelectedFilter("mcp-server")}
									className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
										selectedFilter === "mcp-server"
											? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
										<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
											<span className="text-xs text-white font-medium">S</span>
										</div>
										<span className="text-left truncate">MCP Servers</span>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0 ml-2">
										{counts["mcp-server"]}
									</Badge>
								</button>

								{/* Workflows */}
								<button
									type="button"
									onClick={() => setSelectedFilter("workflow")}
									className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
										selectedFilter === "workflow"
											? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
										<div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shrink-0">
											<span className="text-xs text-white font-medium">W</span>
										</div>
										<span className="text-left truncate">Workflows</span>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0 ml-2">
										{counts.workflow}
									</Badge>
								</button>
							</div>
						</ScrollArea>
					</div>
				</div>

				{/* Right content grid */}
				<div className="flex-1">
					<motion.div
						key={selectedFilter}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="w-full"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{filteredItems.map((item, index) => (
								<motion.div
									key={`${item.type}-${index}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.02 }}
								>
									{item.type === "assistant" ? (
										<AssistantCard
											assistant={item.item}
											onClick={() => onItemClick(item.item, item.type)}
										/>
									) : item.type === "ai-model" ? (
										<AIModelCard
											aiModel={item.item}
											onClick={() => onItemClick(item.item, item.type)}
										/>
									) : item.type === "mcp-server" ? (
										<MCPServerCard
											server={{
												id: item.item.name || String(index),
												name: item.item.name,
												creator: "Admin",
												description: item.item.description,
												category: item.item.category,
												icon: "",
												url: item.item.url,
												official: item.item.official,
												languages: item.item.languages,
												scope: item.item.scope,
												operating_systems: item.item.operating_systems,
											}}
											onClick={() => onItemClick(item.item, item.type)}
										/>
									) : (
										<WorkflowCard
											workflow={item.item}
											onClick={() => onItemClick(item.item, item.type)}
										/>
									)}
								</motion.div>
							))}
						</div>

						{filteredItems.length === 0 && (
							<div className="text-center py-12">
								<p className="text-gray-500 dark:text-gray-400">
									No {selectedFilter !== "all" ? `${selectedFilter}s` : "items"}{" "}
									found.
								</p>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
}
