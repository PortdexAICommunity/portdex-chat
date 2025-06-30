/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/display-name */
"use client";

import { AIModelCard } from "@/components/marketplace/ai-model-card";
import { AssistantCard } from "@/components/marketplace/assistant-card";
import { DetailDialog } from "@/components/marketplace/detail-dialog";
import { MarketplaceFilter } from "@/components/marketplace/marketplace-filter";
import { MarketplaceSection } from "@/components/marketplace/marketplace-section";
import { PluginCard } from "@/components/marketplace/plugin-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	aiModels,
	plugins,
	siteTemplates,
	softwareTools,
} from "@/lib/constants";
import type { DataTypes } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
	Brain,
	FileText,
	Home,
	PackageOpen,
	Puzzle,
	Search,
	Users,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

// Infer agent type from API - using DataTypes for consistency
type Agent = DataTypes & {
	url?: string;
	author?: string;
	tags?: string[];
};

type TabType =
	| "home"
	| "assistants"
	| "plugins"
	| "ai-models"
	| "softwares"
	| "templates";

// --- SWR fetcher ---
const fetcher = (url: string) =>
	fetch(url).then((res) => res.json()) as Promise<{ agents: DataTypes[] }>;

// Memoized Assistant Card Component for featured section
// eslint-disable-next-line import/no-named-as-default-member
const MemoizedAssistantCard = React.memo(
	({ assistant, onClick }: { assistant: DataTypes; onClick: () => void }) => (
		<AssistantCard assistant={assistant} onClick={onClick} />
	)
);

const MemoizedAIModelCard = React.memo(
	({ aiModel, onClick }: { aiModel: DataTypes; onClick: () => void }) => (
		<AIModelCard aiModel={aiModel} onClick={onClick} />
	)
);

const MemoizedPluginCard = React.memo(
	({ plugin, onClick }: { plugin: DataTypes; onClick: () => void }) => (
		<PluginCard plugin={plugin} onClick={onClick} />
	)
);

MemoizedAssistantCard.displayName = "MemoizedAssistantCard";
MemoizedAIModelCard.displayName = "MemoizedAIModelCard";
MemoizedPluginCard.displayName = "MemoizedPluginCard";

// Pagination constants
const ITEMS_PER_PAGE = 24; // Adjust based on your preference
const FEATURED_ITEMS = 6; // For home page
const FEATURED_OTHER_ITEMS = 4;

export default function Marketplace() {
	const [activeTab, setActiveTab] = useState<TabType>("home");
	const [selectedItem, setSelectedItem] = useState<DataTypes | null>(null);
	const [dialogType, setDialogType] = useState<"assistant" | "plugin">(
		"assistant"
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [mounted, setMounted] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Filtering state for assistants, software and templates
	const [assistantFilters, setAssistantFilters] = useState({
		categories: [] as string[],
		subcategories: [] as string[],
		useCases: [] as string[],
		tags: [] as string[],
		searchTerm: "",
	});

	const [softwareFilters, setSoftwareFilters] = useState({
		categories: [] as string[],
		subcategories: [] as string[],
		useCases: [] as string[],
		tags: [] as string[],
		searchTerm: "",
	});

	const [templateFilters, setTemplateFilters] = useState({
		categories: [] as string[],
		subcategories: [] as string[],
		useCases: [] as string[],
		tags: [] as string[],
		searchTerm: "",
	});

	const [aiModelFilters, setAiModelFilters] = useState({
		categories: [] as string[],
		subcategories: [] as string[],
		useCases: [] as string[],
		tags: [] as string[],
		searchTerm: "",
	});

	const [pluginFilters, setPluginFilters] = useState({
		categories: [] as string[],
		subcategories: [] as string[],
		useCases: [] as string[],
		tags: [] as string[],
		searchTerm: "",
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	// Reset pagination when search term changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, activeTab]);

	const { data, isLoading, error } = useSWR<{ agents: DataTypes[] }>(
		"marketplace/api/agents",
		fetcher
	);

	const assistants = useMemo(() => data?.agents ?? [], [data]);

	const handleItemClick = useCallback(
		(
			item: DataTypes,
			type: "assistant" | "plugin" | "ai-model" | "software" | "template"
		) => {
			setSelectedItem(item);
			setDialogType(
				type === "assistant" || type === "ai-model" ? "assistant" : "plugin"
			);
			setIsDialogOpen(true);
		},
		[]
	);

	const handleViewMore = useCallback((type: "assistants" | "plugins") => {
		setActiveTab(type);
	}, []);

	// Assistant filter handlers
	const handleAssistantFilterChange = useCallback(
		(key: keyof typeof assistantFilters, value: string[] | string) => {
			setAssistantFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleAssistantClearFilters = useCallback(() => {
		setAssistantFilters({
			categories: [],
			subcategories: [],
			useCases: [],
			tags: [],
			searchTerm: "",
		});
	}, []);

	// Software filter handlers
	const handleSoftwareFilterChange = useCallback(
		(key: keyof typeof softwareFilters, value: string[] | string) => {
			setSoftwareFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleSoftwareClearFilters = useCallback(() => {
		setSoftwareFilters({
			categories: [],
			subcategories: [],
			useCases: [],
			tags: [],
			searchTerm: "",
		});
	}, []);

	// Template filter handlers
	const handleTemplateFilterChange = useCallback(
		(key: keyof typeof templateFilters, value: string[] | string) => {
			setTemplateFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleTemplateClearFilters = useCallback(() => {
		setTemplateFilters({
			categories: [],
			subcategories: [],
			useCases: [],
			tags: [],
			searchTerm: "",
		});
	}, []);

	// AI Model filter handlers
	const handleAiModelFilterChange = useCallback(
		(key: keyof typeof aiModelFilters, value: string[] | string) => {
			setAiModelFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleAiModelClearFilters = useCallback(() => {
		setAiModelFilters({
			categories: [],
			subcategories: [],
			useCases: [],
			tags: [],
			searchTerm: "",
		});
	}, []);

	// Plugin filter handlers
	const handlePluginFilterChange = useCallback(
		(key: keyof typeof pluginFilters, value: string[] | string) => {
			setPluginFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handlePluginClearFilters = useCallback(() => {
		setPluginFilters({
			categories: [],
			subcategories: [],
			useCases: [],
			tags: [],
			searchTerm: "",
		});
	}, []);

	// Filter assistants based on filter criteria (memoized)
	const filteredAssistants = useMemo(
		() =>
			assistants.filter((assistant) => {
				// Search term filter
				const matchesSearch =
					!assistantFilters.searchTerm ||
					assistant.name
						.toLowerCase()
						.includes(assistantFilters.searchTerm.toLowerCase()) ||
					assistant.description
						.toLowerCase()
						.includes(assistantFilters.searchTerm.toLowerCase()) ||
					assistant.creator
						.toLowerCase()
						.includes(assistantFilters.searchTerm.toLowerCase()) ||
					assistant.category
						.toLowerCase()
						.includes(assistantFilters.searchTerm.toLowerCase()) ||
					(assistant.subcategory &&
						assistant.subcategory
							.toLowerCase()
							.includes(assistantFilters.searchTerm.toLowerCase())) ||
					(assistant.useCase &&
						assistant.useCase
							.toLowerCase()
							.includes(assistantFilters.searchTerm.toLowerCase())) ||
					(assistant.tags &&
						assistant.tags.some((tag) =>
							tag
								.toLowerCase()
								.includes(assistantFilters.searchTerm.toLowerCase())
						));

				// Category filter
				const matchesCategory =
					assistantFilters.categories.length === 0 ||
					assistantFilters.categories.includes(assistant.category);

				// Subcategory filter
				const matchesSubcategory =
					assistantFilters.subcategories.length === 0 ||
					(assistant.subcategory &&
						assistantFilters.subcategories.includes(assistant.subcategory));

				// Use case filter
				const matchesUseCase =
					assistantFilters.useCases.length === 0 ||
					(assistant.useCase &&
						assistantFilters.useCases.includes(assistant.useCase));

				// Tags filter
				const matchesTags =
					assistantFilters.tags.length === 0 ||
					(assistant.tags &&
						assistant.tags.some((tag) => assistantFilters.tags.includes(tag)));

				return (
					matchesSearch &&
					matchesCategory &&
					matchesSubcategory &&
					matchesUseCase &&
					matchesTags
				);
			}),
		[assistants, assistantFilters]
	);

	// Paginated assistants for the assistants tab
	const paginatedAssistants = useMemo(() => {
		const startIndex = 0;
		const endIndex = currentPage * ITEMS_PER_PAGE;
		return filteredAssistants.slice(startIndex, endIndex);
	}, [filteredAssistants, currentPage]);

	const filteredAIModels = useMemo(
		() =>
			aiModels.filter((aiModel) => {
				// Search term filter
				const matchesSearch =
					!aiModelFilters.searchTerm ||
					aiModel.name
						.toLowerCase()
						.includes(aiModelFilters.searchTerm.toLowerCase()) ||
					aiModel.description
						.toLowerCase()
						.includes(aiModelFilters.searchTerm.toLowerCase()) ||
					aiModel.creator
						.toLowerCase()
						.includes(aiModelFilters.searchTerm.toLowerCase()) ||
					aiModel.category
						.toLowerCase()
						.includes(aiModelFilters.searchTerm.toLowerCase()) ||
					(aiModel.subcategory &&
						aiModel.subcategory
							.toLowerCase()
							.includes(aiModelFilters.searchTerm.toLowerCase())) ||
					(aiModel.useCase &&
						aiModel.useCase
							.toLowerCase()
							.includes(aiModelFilters.searchTerm.toLowerCase())) ||
					(aiModel.tags &&
						aiModel.tags.some((tag) =>
							tag
								.toLowerCase()
								.includes(aiModelFilters.searchTerm.toLowerCase())
						));

				// Category filter
				const matchesCategory =
					aiModelFilters.categories.length === 0 ||
					aiModelFilters.categories.includes(aiModel.category);

				// Subcategory filter
				const matchesSubcategory =
					aiModelFilters.subcategories.length === 0 ||
					(aiModel.subcategory &&
						aiModelFilters.subcategories.includes(aiModel.subcategory));

				// Use case filter
				const matchesUseCase =
					aiModelFilters.useCases.length === 0 ||
					(aiModel.useCase &&
						aiModelFilters.useCases.includes(aiModel.useCase));

				// Tags filter
				const matchesTags =
					aiModelFilters.tags.length === 0 ||
					(aiModel.tags &&
						aiModel.tags.some((tag) => aiModelFilters.tags.includes(tag)));

				return (
					matchesSearch &&
					matchesCategory &&
					matchesSubcategory &&
					matchesUseCase &&
					matchesTags
				);
			}),
		[aiModelFilters]
	);

	// Paginated AI Models
	const paginatedAIModels = useMemo(() => {
		const startIndex = 0;
		const endIndex = currentPage * ITEMS_PER_PAGE;
		return filteredAIModels.slice(startIndex, endIndex);
	}, [filteredAIModels, currentPage]);

	// Filter and paginate plugins
	const filteredPlugins = useMemo(
		() =>
			plugins.filter((plugin) => {
				// Search term filter
				const matchesSearch =
					!pluginFilters.searchTerm ||
					plugin.name
						.toLowerCase()
						.includes(pluginFilters.searchTerm.toLowerCase()) ||
					plugin.description
						.toLowerCase()
						.includes(pluginFilters.searchTerm.toLowerCase()) ||
					plugin.creator
						.toLowerCase()
						.includes(pluginFilters.searchTerm.toLowerCase()) ||
					plugin.category
						.toLowerCase()
						.includes(pluginFilters.searchTerm.toLowerCase()) ||
					(plugin.subcategory &&
						plugin.subcategory
							.toLowerCase()
							.includes(pluginFilters.searchTerm.toLowerCase())) ||
					(plugin.useCase &&
						plugin.useCase
							.toLowerCase()
							.includes(pluginFilters.searchTerm.toLowerCase())) ||
					(plugin.tags &&
						plugin.tags.some((tag) =>
							tag.toLowerCase().includes(pluginFilters.searchTerm.toLowerCase())
						));

				// Category filter
				const matchesCategory =
					pluginFilters.categories.length === 0 ||
					pluginFilters.categories.includes(plugin.category);

				// Subcategory filter
				const matchesSubcategory =
					pluginFilters.subcategories.length === 0 ||
					(plugin.subcategory &&
						pluginFilters.subcategories.includes(plugin.subcategory));

				// Use case filter
				const matchesUseCase =
					pluginFilters.useCases.length === 0 ||
					(plugin.useCase && pluginFilters.useCases.includes(plugin.useCase));

				// Tags filter
				const matchesTags =
					pluginFilters.tags.length === 0 ||
					(plugin.tags &&
						plugin.tags.some((tag) => pluginFilters.tags.includes(tag)));

				return (
					matchesSearch &&
					matchesCategory &&
					matchesSubcategory &&
					matchesUseCase &&
					matchesTags
				);
			}),
		[pluginFilters]
	);

	const paginatedPlugins = useMemo(() => {
		const startIndex = 0;
		const endIndex = currentPage * ITEMS_PER_PAGE;
		return filteredPlugins.slice(startIndex, endIndex);
	}, [filteredPlugins, currentPage]);

	// Filter and paginate software
	const filteredSoftware = useMemo(
		() =>
			softwareTools.filter((software) => {
				// Search term filter
				const matchesSearch =
					!softwareFilters.searchTerm ||
					software.name
						.toLowerCase()
						.includes(softwareFilters.searchTerm.toLowerCase()) ||
					software.description
						.toLowerCase()
						.includes(softwareFilters.searchTerm.toLowerCase()) ||
					software.creator
						.toLowerCase()
						.includes(softwareFilters.searchTerm.toLowerCase()) ||
					software.category
						.toLowerCase()
						.includes(softwareFilters.searchTerm.toLowerCase()) ||
					(software.subcategory &&
						software.subcategory
							.toLowerCase()
							.includes(softwareFilters.searchTerm.toLowerCase())) ||
					(software.useCase &&
						software.useCase
							.toLowerCase()
							.includes(softwareFilters.searchTerm.toLowerCase())) ||
					(software.tags &&
						software.tags.some((tag) =>
							tag
								.toLowerCase()
								.includes(softwareFilters.searchTerm.toLowerCase())
						));

				// Category filter
				const matchesCategory =
					softwareFilters.categories.length === 0 ||
					softwareFilters.categories.includes(software.category);

				// Subcategory filter
				const matchesSubcategory =
					softwareFilters.subcategories.length === 0 ||
					(software.subcategory &&
						softwareFilters.subcategories.includes(software.subcategory));

				// Use case filter
				const matchesUseCase =
					softwareFilters.useCases.length === 0 ||
					(software.useCase &&
						softwareFilters.useCases.includes(software.useCase));

				// Tags filter
				const matchesTags =
					softwareFilters.tags.length === 0 ||
					(software.tags &&
						software.tags.some((tag) => softwareFilters.tags.includes(tag)));

				return (
					matchesSearch &&
					matchesCategory &&
					matchesSubcategory &&
					matchesUseCase &&
					matchesTags
				);
			}),
		[softwareFilters]
	);

	const paginatedSoftware = useMemo(() => {
		const startIndex = 0;
		const endIndex = currentPage * ITEMS_PER_PAGE;
		return filteredSoftware.slice(startIndex, endIndex);
	}, [filteredSoftware, currentPage]);

	// Filter and paginate templates
	const filteredTemplates = useMemo(
		() =>
			siteTemplates.filter((template) => {
				// Search term filter
				const matchesSearch =
					!templateFilters.searchTerm ||
					template.name
						.toLowerCase()
						.includes(templateFilters.searchTerm.toLowerCase()) ||
					template.description
						.toLowerCase()
						.includes(templateFilters.searchTerm.toLowerCase()) ||
					template.creator
						.toLowerCase()
						.includes(templateFilters.searchTerm.toLowerCase()) ||
					template.category
						.toLowerCase()
						.includes(templateFilters.searchTerm.toLowerCase()) ||
					(template.subcategory &&
						template.subcategory
							.toLowerCase()
							.includes(templateFilters.searchTerm.toLowerCase())) ||
					(template.useCase &&
						template.useCase
							.toLowerCase()
							.includes(templateFilters.searchTerm.toLowerCase())) ||
					(template.tags &&
						template.tags.some((tag) =>
							tag
								.toLowerCase()
								.includes(templateFilters.searchTerm.toLowerCase())
						));

				// Category filter
				const matchesCategory =
					templateFilters.categories.length === 0 ||
					templateFilters.categories.includes(template.category);

				// Subcategory filter
				const matchesSubcategory =
					templateFilters.subcategories.length === 0 ||
					(template.subcategory &&
						templateFilters.subcategories.includes(template.subcategory));

				// Use case filter
				const matchesUseCase =
					templateFilters.useCases.length === 0 ||
					(template.useCase &&
						templateFilters.useCases.includes(template.useCase));

				// Tags filter
				const matchesTags =
					templateFilters.tags.length === 0 ||
					(template.tags &&
						template.tags.some((tag) => templateFilters.tags.includes(tag)));

				return (
					matchesSearch &&
					matchesCategory &&
					matchesSubcategory &&
					matchesUseCase &&
					matchesTags
				);
			}),
		[templateFilters]
	);

	const paginatedTemplates = useMemo(() => {
		const startIndex = 0;
		const endIndex = currentPage * ITEMS_PER_PAGE;
		return filteredTemplates.slice(startIndex, endIndex);
	}, [filteredTemplates, currentPage]);

	const hasMoreItems = paginatedAssistants.length < filteredAssistants.length;
	const hasMoreAIModels = paginatedAIModels.length < filteredAIModels.length;
	const hasMorePlugins = paginatedPlugins.length < filteredPlugins.length;
	const hasMoreSoftware = paginatedSoftware.length < filteredSoftware.length;
	const hasMoreTemplates = paginatedTemplates.length < filteredTemplates.length;

	const loadMore = useCallback(async () => {
		if (isLoadingMore) return;

		const hasMore =
			activeTab === "assistants"
				? hasMoreItems
				: activeTab === "ai-models"
				? hasMoreAIModels
				: activeTab === "plugins"
				? hasMorePlugins
				: activeTab === "softwares"
				? hasMoreSoftware
				: activeTab === "templates"
				? hasMoreTemplates
				: false;

		if (!hasMore) return;

		setIsLoadingMore(true);
		// Simulate loading delay (remove in production)
		await new Promise((resolve) => setTimeout(resolve, 300));
		setCurrentPage((prev) => prev + 1);
		setIsLoadingMore(false);
	}, [
		isLoadingMore,
		activeTab,
		hasMoreItems,
		hasMoreAIModels,
		hasMorePlugins,
		hasMoreSoftware,
		hasMoreTemplates,
	]);

	// Optimized animation settings based on item count
	const shouldUseStaggeredAnimation = paginatedAssistants.length < 50;

	if (!mounted) return null;

	return (
		<div className="min-h-screen max-w-sm md:max-w-3xl lg:max-w-full w-full bg-background transition-colors duration-200">
			{/* Header */}
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="sticky top-0 z-40 bg-white/80 dark:bg-black backdrop-blur-md border-b border-border transition-colors duration-200"
			>
				<div className="w-full px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center gap-4 py-4 sm:h-16 sm:py-0">
						<div className="flex items-center gap-4 sm:gap-8">
							<SidebarTrigger />

							<h1 className="text-xl font-semibold text-gray-900 dark:text-white">
								Portdex Marketplace
							</h1>

							{/* Search */}
							<div className="hidden lg:block relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
								<Input
									placeholder="Search assistants..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-64 xl:w-80 bg-white dark:bg-white/10 border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>

						{/* <div className="flex items-center justify-end space-x-2">
							<Badge variant="secondary" className="text-xs">
								{assistants.length} items
							</Badge>
						</div> */}
					</div>
				</div>
			</motion.header>

			{/* Mobile/Tablet Search */}
			<div className="lg:hidden bg-white dark:bg-black border-b border-border px-4 py-3 transition-colors duration-200">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
					<Input
						placeholder="Search assistants..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
					/>
				</div>
			</div>

			{/* Navigation */}
			<motion.nav
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="bg-white dark:bg-black border-b border-border sticky top-16 sm:top-16 z-30 transition-colors duration-200"
			>
				<div className="w-full xl:max-w-7xl mx-auto px-4 lg:px-0">
					<div className="flex overflow-x-auto scrollbar-hide">
						{[
							{ id: "home", label: "Home", icon: Home },
							{ id: "assistants", label: "AI Agents", icon: Users },
							{ id: "ai-models", label: "AI Models", icon: Brain },
							{ id: "plugins", label: "Plugins", icon: Puzzle },
							{ id: "softwares", label: "Softwares", icon: PackageOpen },
							{ id: "templates", label: "Templates", icon: FileText },
						].map((tab) => (
							<motion.button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as TabType)}
								className={`flex items-center gap-2 p-4 sm:px-6 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
									activeTab === tab.id
										? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
										: "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
								}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<tab.icon className="size-4" />
								<span className="hidden sm:inline">{tab.label}</span>
								<span className="sm:hidden">
									{tab.id === "home"
										? "Home"
										: tab.id === "assistants"
										? "Assistants"
										: tab.id === "ai-models"
										? "AI Models"
										: tab.id === "plugins"
										? "Plugins"
										: tab.id === "softwares"
										? "Softwares"
										: "Templates"}
								</span>
								{/* {tab.id === 'assistants' && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {assistants.length}
                  </Badge>
                )} */}
							</motion.button>
						))}
					</div>
				</div>
			</motion.nav>

			{/* Content */}
			<div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="max-w-7xl mx-auto">
					<AnimatePresence mode="wait">
						{isLoading && (
							<div className="py-16 text-center text-gray-500 dark:text-gray-400">
								Loading assistants...
							</div>
						)}
						{error && (
							<div className="py-16 text-center text-red-500">
								Failed to load assistants.
							</div>
						)}

						{activeTab === "home" && !isLoading && (
							<motion.div
								key="home"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-8 sm:space-y-12"
							>
								{/* Featured Assistants */}
								<section>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
										<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
											Featured Assistants
										</h2>
										<Button
											variant="ghost"
											onClick={() => handleViewMore("assistants")}
											className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 self-start sm:self-auto"
										>
											Discover More →
										</Button>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
										{assistants
											.slice(0, FEATURED_ITEMS)
											.map((assistant, index) => (
												<motion.div
													key={assistant.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
												>
													<MemoizedAssistantCard
														assistant={assistant}
														onClick={() =>
															handleItemClick(assistant, "assistant")
														}
													/>
												</motion.div>
											))}
									</div>
								</section>

								{/* Featured AI Models */}
								<section>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
										<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
											Featured AI Models
										</h2>
										<Button
											variant="ghost"
											onClick={() => setActiveTab("ai-models")}
											className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 self-start sm:self-auto"
										>
											Discover More →
										</Button>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
										{aiModels
											.slice(0, FEATURED_OTHER_ITEMS)
											.map((aiModel, index) => (
												<motion.div
													key={aiModel.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
												>
													<MemoizedAIModelCard
														aiModel={aiModel}
														onClick={() => handleItemClick(aiModel, "ai-model")}
													/>
												</motion.div>
											))}
									</div>
								</section>

								{/* Featured Plugins */}
								<section>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
										<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
											Featured Plugins
										</h2>
										<Button
											variant="ghost"
											onClick={() => setActiveTab("plugins")}
											className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 self-start sm:self-auto"
										>
											Discover More →
										</Button>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
										{plugins
											.slice(0, FEATURED_OTHER_ITEMS)
											.map((plugin, index) => (
												<motion.div
													key={plugin.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
												>
													<MemoizedPluginCard
														plugin={plugin}
														onClick={() => handleItemClick(plugin, "plugin")}
													/>
												</motion.div>
											))}
									</div>
								</section>
							</motion.div>
						)}

						{activeTab === "assistants" && !isLoading && (
							<motion.div
								key="assistants"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								<MarketplaceFilter
									items={assistants}
									selectedCategories={assistantFilters.categories}
									selectedSubcategories={assistantFilters.subcategories}
									selectedUseCases={assistantFilters.useCases}
									selectedTags={assistantFilters.tags}
									searchTerm={assistantFilters.searchTerm}
									onCategoryChange={(categories) =>
										handleAssistantFilterChange("categories", categories)
									}
									onSubcategoryChange={(subcategories) =>
										handleAssistantFilterChange("subcategories", subcategories)
									}
									onUseCaseChange={(useCases) =>
										handleAssistantFilterChange("useCases", useCases)
									}
									onTagChange={(tags) =>
										handleAssistantFilterChange("tags", tags)
									}
									onSearchChange={(searchTerm) =>
										handleAssistantFilterChange("searchTerm", searchTerm)
									}
									onClearFilters={handleAssistantClearFilters}
									placeholder="Search AI assistants..."
								/>
								<MarketplaceSection
									title="All Assistants"
									filteredItems={filteredAssistants}
									paginatedItems={paginatedAssistants}
									hasMoreItems={hasMoreItems}
									onItemClick={handleItemClick}
									onLoadMore={loadMore}
									isLoadingMore={isLoadingMore}
									itemType="assistant"
									shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
								/>
							</motion.div>
						)}

						{activeTab === "ai-models" && !isLoading && (
							<motion.div
								key="ai-models"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								<MarketplaceFilter
									items={aiModels}
									selectedCategories={aiModelFilters.categories}
									selectedSubcategories={aiModelFilters.subcategories}
									selectedUseCases={aiModelFilters.useCases}
									selectedTags={aiModelFilters.tags}
									searchTerm={aiModelFilters.searchTerm}
									onCategoryChange={(categories) =>
										handleAiModelFilterChange("categories", categories)
									}
									onSubcategoryChange={(subcategories) =>
										handleAiModelFilterChange("subcategories", subcategories)
									}
									onUseCaseChange={(useCases) =>
										handleAiModelFilterChange("useCases", useCases)
									}
									onTagChange={(tags) =>
										handleAiModelFilterChange("tags", tags)
									}
									onSearchChange={(searchTerm) =>
										handleAiModelFilterChange("searchTerm", searchTerm)
									}
									onClearFilters={handleAiModelClearFilters}
									placeholder="Search AI models..."
								/>
								<MarketplaceSection
									title="All AI Models"
									filteredItems={filteredAIModels}
									paginatedItems={paginatedAIModels}
									hasMoreItems={hasMoreAIModels}
									onItemClick={handleItemClick}
									onLoadMore={loadMore}
									isLoadingMore={isLoadingMore}
									itemType="ai-model"
									shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
								/>
							</motion.div>
						)}

						{activeTab === "plugins" && !isLoading && (
							<motion.div
								key="plugins"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								<MarketplaceFilter
									items={plugins}
									selectedCategories={pluginFilters.categories}
									selectedSubcategories={pluginFilters.subcategories}
									selectedUseCases={pluginFilters.useCases}
									selectedTags={pluginFilters.tags}
									searchTerm={pluginFilters.searchTerm}
									onCategoryChange={(categories) =>
										handlePluginFilterChange("categories", categories)
									}
									onSubcategoryChange={(subcategories) =>
										handlePluginFilterChange("subcategories", subcategories)
									}
									onUseCaseChange={(useCases) =>
										handlePluginFilterChange("useCases", useCases)
									}
									onTagChange={(tags) => handlePluginFilterChange("tags", tags)}
									onSearchChange={(searchTerm) =>
										handlePluginFilterChange("searchTerm", searchTerm)
									}
									onClearFilters={handlePluginClearFilters}
									placeholder="Search plugins..."
								/>
								<MarketplaceSection
									title="All Plugins"
									filteredItems={filteredPlugins}
									paginatedItems={paginatedPlugins}
									hasMoreItems={hasMorePlugins}
									onItemClick={handleItemClick}
									onLoadMore={loadMore}
									isLoadingMore={isLoadingMore}
									itemType="plugin"
									shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
								/>
							</motion.div>
						)}

						{activeTab === "softwares" && !isLoading && (
							<motion.div
								key="softwares"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								<MarketplaceFilter
									items={softwareTools}
									selectedCategories={softwareFilters.categories}
									selectedSubcategories={softwareFilters.subcategories}
									selectedUseCases={softwareFilters.useCases}
									selectedTags={softwareFilters.tags}
									searchTerm={softwareFilters.searchTerm}
									onCategoryChange={(categories) =>
										handleSoftwareFilterChange("categories", categories)
									}
									onSubcategoryChange={(subcategories) =>
										handleSoftwareFilterChange("subcategories", subcategories)
									}
									onUseCaseChange={(useCases) =>
										handleSoftwareFilterChange("useCases", useCases)
									}
									onTagChange={(tags) =>
										handleSoftwareFilterChange("tags", tags)
									}
									onSearchChange={(searchTerm) =>
										handleSoftwareFilterChange("searchTerm", searchTerm)
									}
									onClearFilters={handleSoftwareClearFilters}
									placeholder="Search software tools..."
								/>
								<MarketplaceSection
									title="All Software"
									filteredItems={filteredSoftware}
									paginatedItems={paginatedSoftware}
									hasMoreItems={hasMoreSoftware}
									onItemClick={handleItemClick}
									onLoadMore={loadMore}
									isLoadingMore={isLoadingMore}
									itemType="software"
									shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
								/>
							</motion.div>
						)}

						{activeTab === "templates" && !isLoading && (
							<motion.div
								key="templates"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								<MarketplaceFilter
									items={siteTemplates}
									selectedCategories={templateFilters.categories}
									selectedSubcategories={templateFilters.subcategories}
									selectedUseCases={templateFilters.useCases}
									selectedTags={templateFilters.tags}
									searchTerm={templateFilters.searchTerm}
									onCategoryChange={(categories) =>
										handleTemplateFilterChange("categories", categories)
									}
									onSubcategoryChange={(subcategories) =>
										handleTemplateFilterChange("subcategories", subcategories)
									}
									onUseCaseChange={(useCases) =>
										handleTemplateFilterChange("useCases", useCases)
									}
									onTagChange={(tags) =>
										handleTemplateFilterChange("tags", tags)
									}
									onSearchChange={(searchTerm) =>
										handleTemplateFilterChange("searchTerm", searchTerm)
									}
									onClearFilters={handleTemplateClearFilters}
									placeholder="Search templates..."
								/>
								<MarketplaceSection
									title="All Templates"
									filteredItems={filteredTemplates}
									paginatedItems={paginatedTemplates}
									hasMoreItems={hasMoreTemplates}
									onItemClick={handleItemClick}
									onLoadMore={loadMore}
									isLoadingMore={isLoadingMore}
									itemType="template"
									shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Detail Dialog */}
			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedItem}
				type={dialogType}
			/>
		</div>
	);
}
