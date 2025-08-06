/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/display-name */
"use client";

import { AIModelCard } from "@/components/marketplace/ai-model-card";
import { AssistantCard } from "@/components/marketplace/assistant-card";
import { DetailDialog } from "@/components/marketplace/detail-dialog";
import { FeaturedMarketplaceSection } from "@/components/marketplace/feature-marketplace-section";
import { LoginPopup } from "@/components/marketplace/login-popup";
import { MarketplaceFilter } from "@/components/marketplace/marketplace-filter";
import { MarketplaceSection } from "@/components/marketplace/marketplace-section";
import { MCPServerCard } from "@/components/marketplace/mcp-server-card";
import { WorkflowCard } from "@/components/marketplace/workflow-card";

import { Pagination } from "@/components/marketplace/pagination";
import Tags from "@/components/marketplace/tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MarketplaceItemCount } from "@/components/marketplace-item-count";
import { PREDEFINED_ASSISTANT_CATEGORIES } from "@/lib/constant/marketplace-constant";
import { siteTemplates, softwareTools } from "@/lib/constants";
import type {
	DataTypes,
	MCPDataTypes,
	MCPServerType,
	WorkflowType,
} from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
	BitcoinIcon,
	Brain,
	ChartBarIcon,
	FileText,
	Home,
	PackageOpen,
	Search,
	TowerControlIcon,
	Users,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { BlockchainIcon, MCPIcon, N8NIcon } from "@/components/icons";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { FAQSection } from "@/components/faq";

// Configure SWR to reduce API calls
const swrConfig = {
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
	refreshWhenOffline: false,
	refreshWhenHidden: false,
	refreshInterval: 0, // Disable automatic refresh
	dedupingInterval: 300000, // 5 minutes deduping
	focusThrottleInterval: 300000, // 5 minutes focus throttle
};

// Marketplace FAQs
const marketplaceFAQs = [
	{
		question: "What is an AI agent?",
		answer:
			"An AI agent is a LLM-powered intelligence that has access to capabilities/tools and uses them to accomplish specific tasks. Our marketplace offers a variety of AI agents designed for crypto and financial applications that can help automate tasks, provide insights, and enhance your workflow.",
	},
	{
		question: "What is the difference between a plugin and a connector?",
		answer:
			"A plugin is a capability of an AI agent that contains everything needed to execute a specific task or business process. A connector is a reusable component that primarily handles authentication and integration with your business system, allowing AI agents to securely access your data.",
	},
	{
		question: "How do I install an AI Agent?",
		answer:
			"You can install AI Agents directly from our Marketplace to your AI Assistant with just a few clicks. Browse the available agents, select the one you need, and follow the simple installation process. Our system will handle the integration automatically.",
	},
	{
		question:
			"I have an idea for an AI agent, but it's not in the marketplace yet. How can I get it added?",
		answer:
			"You can submit your idea for a new AI agent through our submission process. We recommend sharing your concept with us so we can better understand your requirements and help bring your idea to life. When you're ready, you can submit it for review and potential inclusion in our marketplace.",
	},
	{
		question: "Where do I build AI agents?",
		answer:
			"You can build AI Agents in our Plugin Workspace, which is part of our Agent Studio platform. This provides all the tools and resources you need to create, test, and deploy your own custom AI agents for crypto and financial applications.",
	},
	{
		question: "What are the different types of plugins available?",
		answer:
			"We offer several types of plugins: Built-In capabilities supported out-of-the-box, Idea plugins that are conceptually possible but not yet validated, Validated plugins that have been verified through API research, Guided plugins with step-by-step development documentation, Template pre-built plugins that can be installed in minutes, and Polling Required plugins that connect to event APIs for proactive functionality.",
	},
];

// Infer agent type from API - using DataTypes for consistency

type TabType =
	| "home"
	| "assistants"
	| "ai-models"
	| "softwares"
	| "templates"
	| "mcp-servers"
	| "workflows";

// --- SWR fetcher ---
const fetcher = (url: string) =>
	fetch(url).then((res) => res.json()) as Promise<{
		agents: DataTypes[];
		total?: number;
	}>;

// AI Models fetcher
const aiModelsFetcher = (url: string) =>
	fetch(url).then((res) => res.json()) as Promise<{
		models: DataTypes[];
		total: number;
	}>;

// MCP Servers fetcher
const mcpServersFetcher = (url: string) =>
	fetch(url).then((res) => res.json()) as Promise<{
		servers: Array<{
			name: string;
			url: string;
			description: string;
			category: string;
			official: boolean;
			languages: string[];
			scope: string[];
			operating_systems: string[];
		}>;
		total: number;
		page: number;
		pageSize: number;
	}>;

// Workflows fetcher
const workflowsFetcher = (url: string) =>
	fetch(url).then((res) => res.json()) as Promise<{
		workflows: WorkflowType[];
		total: number;
		page: number;
		pageSize: number;
	}>;

// Memoized Components
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

const MemoizedMCPServerCard = React.memo(
	({ server, onClick }: { server: any; onClick: () => void }) => (
		<MCPServerCard server={server} onClick={onClick} />
	)
);

const MemoizedWorkflowCard = React.memo(
	({
		workflow,
		onClick,
		onDownload,
		onLoginRequired,
	}: {
		workflow: WorkflowType;
		onClick: () => void;
		onDownload: (workflow: WorkflowType) => void;
		onLoginRequired: () => void;
	}) => (
		<WorkflowCard
			workflow={workflow}
			onClick={onClick}
			onDownload={onDownload}
			onLoginRequired={onLoginRequired}
		/>
	)
);

MemoizedAssistantCard.displayName = "MemoizedAssistantCard";
MemoizedAIModelCard.displayName = "MemoizedAIModelCard";
MemoizedMCPServerCard.displayName = "MemoizedMCPServerCard";
MemoizedWorkflowCard.displayName = "MemoizedWorkflowCard";

// Pagination constants
const ITEMS_PER_PAGE = 24;
const FEATURED_ITEMS = 6;

export default function Marketplace() {
	const [activeTab, setActiveTab] = useState<TabType>("home");
	const [selectedItem, setSelectedItem] = useState<
		DataTypes | MCPDataTypes | MCPServerType | WorkflowType | null
	>(null);
	const [dialogType, setDialogType] = useState<
		| "assistant"
		| "mcp-server"
		| "ai-model"
		| "software"
		| "template"
		| "workflow"
	>("assistant");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [mounted, setMounted] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [assistantsPageSize, setAssistantsPageSize] = useState(ITEMS_PER_PAGE);
	const [mcpCurrentPage, setMcpCurrentPage] = useState(1);
	const [mcpPageSize, setMcpPageSize] = useState(20);

	// Page states for other sections
	const [aiModelsCurrentPage, setAiModelsCurrentPage] = useState(1);
	const [aiModelsPageSize, setAiModelsPageSize] = useState(ITEMS_PER_PAGE);
	const [softwareCurrentPage, setSoftwareCurrentPage] = useState(1);
	const [softwarePageSize, setSoftwarePageSize] = useState(ITEMS_PER_PAGE);
	const [templatesCurrentPage, setTemplatesCurrentPage] = useState(1);
	const [templatesPageSize, setTemplatesPageSize] = useState(ITEMS_PER_PAGE);
	const [workflowsCurrentPage, setWorkflowsCurrentPage] = useState(1);
	const [workflowsPageSize, setWorkflowsPageSize] = useState(ITEMS_PER_PAGE);

	// Filter states for each tab
	const [assistantsFilters, setAssistantsFilters] = useState({
		selectedCategory: null as string | null,
		searchTerm: "",
	});
	const [aiModelsFilters, setAiModelsFilters] = useState({
		selectedCreator: null as string | null,
		searchTerm: "",
	});
	const [softwareFilters, setSoftwareFilters] = useState({
		selectedCategory: null as string | null,
		searchTerm: "",
	});
	const [templatesFilters, setTemplatesFilters] = useState({
		selectedCategory: null as string | null,
		searchTerm: "",
	});
	const [mcpFilters, setMcpFilters] = useState({
		selectedCategory: null as string | null,
		searchTerm: "",
	});
	const [workflowsFilters, setWorkflowsFilters] = useState({
		selectedCategory: null as string | null,
		searchTerm: "",
	});

	const { setTotalItems } = useMarketplaceStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Reset pagination when search term, filters, or page size change
	useEffect(() => {
		setCurrentPage(1);
		setMcpCurrentPage(1);
		setAiModelsCurrentPage(1);
		setSoftwareCurrentPage(1);
		setTemplatesCurrentPage(1);
		setWorkflowsCurrentPage(1);
	}, [
		searchTerm,
		activeTab,
		assistantsFilters,
		assistantsPageSize,
		aiModelsFilters,
		softwareFilters,
		templatesFilters,
		workflowsFilters,
	]);

	// Fetch assistants/agents with pagination
	const {
		data: aiAgentsData,
		isLoading,
		error,
	} = useSWR(
		activeTab === "assistants"
			? `marketplace/api/agents?page=${currentPage}&pageSize=${assistantsPageSize}${
					assistantsFilters.selectedCategory
						? `&category=${encodeURIComponent(
								assistantsFilters.selectedCategory
							)}`
						: ""
				}${
					assistantsFilters.searchTerm
						? `&search=${encodeURIComponent(assistantsFilters.searchTerm)}`
						: ""
				}`
			: `marketplace/api/agents?page=1&pageSize=${FEATURED_ITEMS}`, // For home page featured items
		fetcher,
		swrConfig
	);

	// Fetch AI models
	const {
		data: aiModelsData,
		isLoading: aiModelsLoading,
		error: aiModelsError,
	} = useSWR<{ models: DataTypes[]; total: number }>(
		`marketplace/api/ai-models${
			aiModelsFilters.searchTerm && activeTab === "ai-models"
				? `?search=${encodeURIComponent(aiModelsFilters.searchTerm)}`
				: ""
		}`,
		aiModelsFetcher,
		swrConfig
	);

	// Fetch MCP servers
	const {
		data: mcpData,
		isLoading: mcpIsLoading,
		error: mcpError,
	} = useSWR(
		`marketplace/api/mcp-servers?page=${mcpCurrentPage}&pageSize=${mcpPageSize}${
			mcpFilters.selectedCategory
				? `&category=${encodeURIComponent(mcpFilters.selectedCategory)}`
				: ""
		}${
			mcpFilters.searchTerm && activeTab === "mcp-servers"
				? `&search=${encodeURIComponent(mcpFilters.searchTerm)}`
				: ""
		}`,
		mcpServersFetcher,
		swrConfig
	);

	const { data: categoriesData } = useSWR(
		"marketplace/api/mcp-servers/categories",
		(url: string) =>
			fetch(url).then((res) => res.json()) as Promise<{ categories: string[] }>,
		swrConfig
	);

	// Fetch workflows - only when needed
	const {
		data: workflowsData,
		isLoading: workflowsLoading,
		error: workflowsError,
	} = useSWR(
		activeTab === "workflows" || activeTab === "home"
			? `marketplace/api/workflows?page=${workflowsCurrentPage}&pageSize=${workflowsPageSize}${
					workflowsFilters.selectedCategory
						? `&category=${encodeURIComponent(
								workflowsFilters.selectedCategory
							)}`
						: ""
				}${
					workflowsFilters.searchTerm && activeTab === "workflows"
						? `&search=${encodeURIComponent(workflowsFilters.searchTerm)}`
						: ""
				}`
			: null,
		workflowsFetcher,
		swrConfig
	);

	const assistants = useMemo(() => aiAgentsData?.agents ?? [], [aiAgentsData]);
	const assistantsTotal = useMemo(
		() => aiAgentsData?.total ?? 0,
		[aiAgentsData]
	);
	const aiModels = useMemo(() => aiModelsData?.models ?? [], [aiModelsData]);
	const mcpServers = useMemo(() => mcpData?.servers ?? [], [mcpData]);
	const mcpCategories = useMemo(
		() => categoriesData?.categories ?? [],
		[categoriesData]
	);
	const workflows = useMemo(
		() => workflowsData?.workflows ?? [],
		[workflowsData]
	);

	// Update total items count in persistent store
	useEffect(() => {
		const totalCount =
			assistantsTotal + aiModels.length + mcpServers.length + workflows.length;
		setTotalItems(totalCount);
	}, [
		assistantsTotal,
		aiModels.length,
		mcpServers.length,
		workflows.length,
		setTotalItems,
	]);

	// Helper function to get categories with counts
	const getCategoriesWithCounts = useCallback((items: DataTypes[]) => {
		const categoryMap = new Map<string, number>();
		items.forEach((item) => {
			const category = item.category || "General";
			categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
		});
		return Array.from(categoryMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, []);

	// Helper function specifically for assistants with predefined categories
	const getAssistantCategoriesWithCounts = useCallback((items: DataTypes[]) => {
		const categoryMap = new Map<string, number>();

		// Initialize all predefined categories with 0 count
		PREDEFINED_ASSISTANT_CATEGORIES.forEach((category) => {
			categoryMap.set(category, 0);
		});

		// Count actual items
		items.forEach((item) => {
			const category = item.category || "General";
			categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
		});

		return Array.from(categoryMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, []);

	// Helper function to get creators with counts
	const getCreatorsWithCounts = useCallback((items: DataTypes[]) => {
		const creatorMap = new Map<string, number>();
		items.forEach((item) => {
			const creator = item.creator || "Unknown";
			creatorMap.set(creator, (creatorMap.get(creator) || 0) + 1);
		});
		return Array.from(creatorMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, []);

	// Category data for each tab - for assistants, we'll use predefined categories without counts since we use server-side filtering
	const assistantCategories = useMemo(
		() =>
			PREDEFINED_ASSISTANT_CATEGORIES.map((category) => ({
				name: category,
				count: 0,
			})),
		[]
	);
	const aiModelCreators = useMemo(
		() => getCreatorsWithCounts(aiModels),
		[aiModels, getCreatorsWithCounts]
	);
	const softwareCategories = useMemo(
		() => getCategoriesWithCounts(softwareTools),
		[getCategoriesWithCounts]
	);
	const templateCategories = useMemo(
		() => getCategoriesWithCounts(siteTemplates),
		[getCategoriesWithCounts]
	);
	const mcpCategoriesWithCounts = useMemo(() => {
		const categoryMap = new Map<string, number>();
		mcpServers.forEach((server) => {
			const category = server.category || "General";
			categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
		});
		return Array.from(categoryMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [mcpServers]);

	const workflowCategoriesWithCounts = useMemo(() => {
		const categoryMap = new Map<string, number>();
		workflows.forEach((workflow) => {
			const category = workflow.category || "General";
			categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
		});
		return Array.from(categoryMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [workflows]);

	const handleItemClick = useCallback(
		(
			item: DataTypes | MCPDataTypes | MCPServerType | WorkflowType,
			type:
				| "assistant"
				| "ai-model"
				| "software"
				| "template"
				| "mcp-server"
				| "workflow"
		) => {
			setSelectedItem(item);
			setDialogType(
				type === "assistant"
					? "assistant"
					: type === "ai-model"
						? "ai-model"
						: type === "mcp-server"
							? "mcp-server"
							: type === "software"
								? "software"
								: type === "template"
									? "template"
									: type === "workflow"
										? "workflow"
										: "assistant"
			);
			setIsDialogOpen(true);
		},
		[]
	);

	const handleViewMore = useCallback((type: "assistants") => {
		setActiveTab(type);
	}, []);

	const handleMcpPageChange = useCallback((page: number) => {
		setMcpCurrentPage(page);
	}, []);

	const handleMcpPageSizeChange = useCallback((pageSize: number) => {
		setMcpPageSize(pageSize);
		setMcpCurrentPage(1);
	}, []);

	// Filter functions for each tab
	const getFilteredItems = useCallback(
		(
			items: DataTypes[],
			filters: { selectedCategory: string | null; searchTerm: string }
		) => {
			return items.filter((item) => {
				const matchesCategory =
					!filters.selectedCategory ||
					item.category === filters.selectedCategory;
				const matchesSearch =
					!filters.searchTerm ||
					item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
					item.description
						.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					item.creator
						.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					item.category
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase());
				return matchesCategory && matchesSearch;
			});
		},
		[]
	);

	// Filter function specifically for AI models (by creator)
	const getFilteredAIModels = useCallback(
		(
			items: DataTypes[],
			filters: { selectedCreator: string | null; searchTerm: string }
		) => {
			return items.filter((item) => {
				const matchesCreator =
					!filters.selectedCreator || item.creator === filters.selectedCreator;
				const matchesSearch =
					!filters.searchTerm ||
					item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
					item.description
						.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					item.creator
						.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					item.category
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase());
				return matchesCreator && matchesSearch;
			});
		},
		[]
	);

	// For assistants, we use server-side filtering so no client-side filtering needed
	const filteredAssistants = useMemo(() => assistants, [assistants]);
	const filteredAIModels = useMemo(
		() => getFilteredAIModels(aiModels, aiModelsFilters),
		[aiModels, aiModelsFilters, getFilteredAIModels]
	);
	const filteredSoftware = useMemo(
		() => getFilteredItems(softwareTools, softwareFilters),
		[softwareFilters, getFilteredItems]
	);
	const filteredTemplates = useMemo(
		() => getFilteredItems(siteTemplates, templatesFilters),
		[templatesFilters, getFilteredItems]
	);

	// For assistants, server returns paginated results
	const paginatedAssistants = useMemo(() => assistants, [assistants]);

	const paginatedAIModels = useMemo(() => {
		const startIndex = (aiModelsCurrentPage - 1) * aiModelsPageSize;
		const endIndex = startIndex + aiModelsPageSize;
		return filteredAIModels.slice(startIndex, endIndex);
	}, [filteredAIModels, aiModelsCurrentPage, aiModelsPageSize]);

	const paginatedSoftware = useMemo(() => {
		const startIndex = (softwareCurrentPage - 1) * softwarePageSize;
		const endIndex = startIndex + softwarePageSize;
		return filteredSoftware.slice(startIndex, endIndex);
	}, [filteredSoftware, softwareCurrentPage, softwarePageSize]);

	const paginatedTemplates = useMemo(() => {
		const startIndex = (templatesCurrentPage - 1) * templatesPageSize;
		const endIndex = startIndex + templatesPageSize;
		return filteredTemplates.slice(startIndex, endIndex);
	}, [filteredTemplates, templatesCurrentPage, templatesPageSize]);

	const paginatedMcpServers = useMemo(() => mcpServers, [mcpServers]);
	const paginatedWorkflows = useMemo(() => workflows, [workflows]);

	// Page change handlers for each section
	const handleAiModelsPageChange = useCallback((page: number) => {
		setAiModelsCurrentPage(page);
	}, []);

	const handleAiModelsPageSizeChange = useCallback((pageSize: number) => {
		setAiModelsPageSize(pageSize);
		setAiModelsCurrentPage(1);
	}, []);

	const handleSoftwarePageChange = useCallback((page: number) => {
		setSoftwareCurrentPage(page);
	}, []);

	const handleSoftwarePageSizeChange = useCallback((pageSize: number) => {
		setSoftwarePageSize(pageSize);
		setSoftwareCurrentPage(1);
	}, []);

	const handleTemplatesPageChange = useCallback((page: number) => {
		setTemplatesCurrentPage(page);
	}, []);

	const handleTemplatesPageSizeChange = useCallback((pageSize: number) => {
		setTemplatesPageSize(pageSize);
		setTemplatesCurrentPage(1);
	}, []);

	const handleWorkflowsPageChange = useCallback((page: number) => {
		setWorkflowsCurrentPage(page);
	}, []);

	const handleWorkflowsPageSizeChange = useCallback((pageSize: number) => {
		setWorkflowsPageSize(pageSize);
		setWorkflowsCurrentPage(1);
	}, []);

	// Download functionality for workflows
	const handleWorkflowDownload = useCallback(async (workflow: WorkflowType) => {
		try {
			const response = await fetch(
				`/marketplace/api/workflows/download/${workflow.id}`
			);

			if (!response.ok) {
				throw new Error("Download failed");
			}

			const data = await response.json();
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: "application/json",
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${workflow.id}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Download error:", error);
			throw error;
		}
	}, []);

	const handleLoginRequired = useCallback(() => {
		setIsLoginPopupOpen(true);
	}, []);

	// Optimized animation settings based on item count
	const shouldUseStaggeredAnimation = paginatedAssistants.length < 50;

	if (!mounted) return null;

	return (
		<div className="min-h-screen max-w-sm md:max-w-3xl lg:max-w-full w-full transition-colors duration-200">
			{/* Header */}
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className="sticky top-0 z-40 backdrop-blur-md border-b border-border transition-colors duration-200"
			>
				<div className="w-full px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center gap-4 py-4 sm:h-16 sm:py-0">
						<div className="flex items-center gap-4 sm:gap-8">
							<SidebarTrigger />

							<h1 className="text-xl font-semibold text-gray-900 dark:text-white">
								Portdex Marketplace
							</h1>

							{/* Search - Only show for home tab */}
							{activeTab === "home" && (
								<div className="hidden lg:block relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
									<Input
										placeholder="Search marketplace..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 w-64 xl:w-80 bg-white dark:bg-white/10 border-gray-200 dark:border-gray-700"
									/>
								</div>
							)}
						</div>

						<div className="flex items-center justify-end space-x-2">
							<MarketplaceItemCount />
						</div>
					</div>
				</div>
			</motion.header>

			{/* Mobile/Tablet Search - Only for home tab */}
			{activeTab === "home" && (
				<div className="lg:hidden border-b border-border px-4 py-3 transition-colors duration-200">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
						<Input
							placeholder="Search marketplace..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
						/>
					</div>
				</div>
			)}

			{/* Navigation */}
			<motion.nav
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="border-b backdrop-blur-md border-border sticky top-16 sm:top-16 z-30 transition-colors duration-200"
			>
				<div className="w-full xl:max-w-7xl mx-auto px-4 lg:px-0">
					<div className="flex overflow-x-auto scrollbar-hide">
						{[
							{ id: "home", label: "Home", icon: Home },
							{
								id: "workflows",
								label: "Workflows",
								icon: N8NIcon,
							},
							{
								id: "assistants",
								label: "Assistants",
								icon: Users,
							},
							{
								id: "ai-models",
								label: "Models Providers",
								icon: Brain,
							},
							{
								id: "mcp-servers",
								label: "MCP Servers",
								icon: MCPIcon,
							},
							{
								id: "softwares",
								label: "Softwares",
								icon: PackageOpen,
							},
							{
								id: "templates",
								label: "Templates",
								icon: FileText,
							},
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
										: tab.id === "workflows"
											? "Workflows"
											: tab.id === "assistants"
												? "Assistants"
												: tab.id === "ai-models"
													? "AI Models"
													: tab.id === "softwares"
														? "Softwares"
														: tab.id === "templates"
															? "Templates"
															: "MCP Servers"}
								</span>
							</motion.button>
						))}
					</div>
				</div>
			</motion.nav>

			{/* Content */}
			<div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="">
					<AnimatePresence mode="wait">
						{/* Show loading only for core sections, not workflows */}
						{(isLoading || aiModelsLoading) && activeTab === "home" && (
							<div className="py-16 text-center text-gray-500 dark:text-gray-400">
								Loading...
							</div>
						)}
						{(error || aiModelsError) && (
							<div className="py-16 text-center text-red-500">
								Failed to load marketplace data.
							</div>
						)}

						{activeTab === "home" && !isLoading && !aiModelsLoading && (
							<motion.div
								key="home"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-4 sm:space-y-6"
							>
								{/* Hero Banner */}
								<section className="relative overflow-hidden rounded-2xl bg-[url(/marketplace-banner.jpg)] bg-origin-padding bg-cover bg-no-repeat">
									<div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 md:p-8">
										<div className="z-10 max-w-2xl w-full text-left">
											<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 font-serif">
												Add AI Agents to your assistant in minutes
											</h1>
											<p className="text-white/80 text-xs sm:text-sm mb-4">
												Transform your financial landscape with the AI
												Marketplace, the ultimate hub for crypto enthusiasts and
												finance professionals alike, designed to enhance
												productivity, reduce operational hurdles, and propel
												your investments into the fast lane.
											</p>
											<Button
												className="bg-white hover:bg-white/90 text-purple-700 hover:text-purple-800 font-medium px-4 sm:px-6 py-1 sm:py-2 text-sm"
												onClick={() => setActiveTab("assistants")}
											>
												Explore AI agent solutions
											</Button>
										</div>
									</div>
								</section>

								{/* Welcome to Marketplace */}
								<section className="text-center mb-4">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
										Discover, deploy, and manage solutions
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
										The most subscribed products this month
									</p>
								</section>

								{/* Featured Items with Filter */}
								<section>
									<FeaturedMarketplaceSection
										assistants={assistants}
										aiModels={aiModels}
										mcpServers={mcpServers}
										workflows={workflows}
										onItemClick={handleItemClick}
										title="Featured Items"
										defaultShowAssistantsAndWorkflows={true}
									/>
								</section>

								{/* Popular Categories */}
								<section className="pt-6">
									<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
										Popular Categories
									</h2>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
										{[
											{
												name: "Crypto",
												icon: <BitcoinIcon />,
												tab: "assistants",
												gradient:
													"from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700",
											},
											{
												name: "Workflows",
												icon: <N8NIcon size={24} />,
												tab: "workflows",
												gradient:
													"from-blue-400 to-cyan-500 dark:from-blue-600 dark:to-cyan-700",
											},
											{
												name: "Machine Learning",
												icon: <Brain />,
												tab: "assistants",
												gradient:
													"from-green-400 to-emerald-500 dark:from-green-600 dark:to-emerald-700",
											},
											{
												name: "Data Products",
												icon: <ChartBarIcon />,
												tab: "assistants",
												gradient:
													"from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700",
											},
											{
												name: "Blockchain",
												icon: <BlockchainIcon size={24} />,
												tab: "assistants",
												gradient:
													"from-pink-400 to-rose-500 dark:from-pink-600 dark:to-rose-700",
											},
											{
												name: "Dev Tools",
												icon: <TowerControlIcon />,
												tab: "workflows",
												gradient:
													"from-violet-400 to-fuchsia-500 dark:from-violet-600 dark:to-fuchsia-700",
											},
										].map((category, index) => (
											<motion.div
												key={category.name}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.05 }}
												className="cursor-pointer"
												onClick={() => setActiveTab(category.tab as TabType)}
											>
												<div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md group relative overflow-hidden transition-all duration-300">
													{/* Normal state */}
													<div className="text-2xl mb-1 relative z-10 transition-transform group-hover:scale-110 duration-300">
														{category.icon}
													</div>
													<div className="text-xs font-medium text-gray-900 dark:text-white text-center relative z-10 transition-colors group-hover:text-white duration-300">
														{category.name}
													</div>

													{/* Hover gradient overlay */}
													<div className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 -z-0">
														<div
															className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${category.gradient} transition-opacity duration-300`}
														/>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</section>

								{/* FAQ Section */}
								<FAQSection faqs={marketplaceFAQs} />
							</motion.div>
						)}

						{activeTab === "assistants" && !isLoading && (
							<motion.div
								key="assistants"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={assistantCategories}
									selectedCategory={assistantsFilters.selectedCategory}
									searchTerm={assistantsFilters.searchTerm}
									totalItems={assistantsTotal}
									onCategoryChange={(category) =>
										setAssistantsFilters((prev) => ({
											...prev,
											selectedCategory: category,
										}))
									}
									onSearchChange={(search) =>
										setAssistantsFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setAssistantsFilters({
											selectedCategory: null,
											searchTerm: "",
										})
									}
									title="Assistant List"
									placeholder="Search assistants..."
								/>

								{/* Main Content */}
								<div className="flex-1 space-y-6">
									<MarketplaceSection
										title=""
										filteredItems={Array(assistantsTotal).fill(null)} // Pass total count for progress indication
										paginatedItems={paginatedAssistants}
										hasMoreItems={false} // Disable load more since we're using pagination
										onItemClick={handleItemClick}
										onLoadMore={() => {}} // No-op function
										isLoadingMore={false}
										itemType="assistant"
										shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
										hideTitle={true}
									/>

									{/* Pagination Controls */}
									{assistantsTotal > 0 && (
										<Pagination
											currentPage={currentPage}
											totalPages={Math.ceil(
												assistantsTotal / assistantsPageSize
											)}
											pageSize={assistantsPageSize}
											totalItems={assistantsTotal}
											onPageChange={(page) => setCurrentPage(page)}
											onPageSizeChange={(newPageSize) => {
												setAssistantsPageSize(newPageSize);
												setCurrentPage(1); // Reset to first page when changing page size
											}}
											isLoading={isLoading}
										/>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === "ai-models" && !aiModelsLoading && (
							<motion.div
								key="ai-models"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={aiModelCreators}
									selectedCategory={aiModelsFilters.selectedCreator}
									searchTerm={aiModelsFilters.searchTerm}
									totalItems={filteredAIModels.length}
									onCategoryChange={(creator) =>
										setAiModelsFilters((prev) => ({
											...prev,
											selectedCreator: creator,
										}))
									}
									onSearchChange={(search) =>
										setAiModelsFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setAiModelsFilters({
											selectedCreator: null,
											searchTerm: "",
										})
									}
									title="AI Models List"
									placeholder="Search AI models..."
									isCreatorBased={true}
								/>

								{/* Main Content */}
								<div className="flex flex-col gap-4">
									<Tags />
									<div className="flex-1 space-y-6">
										<MarketplaceSection
											title=""
											filteredItems={filteredAIModels}
											paginatedItems={paginatedAIModels}
											hasMoreItems={false}
											onItemClick={handleItemClick}
											onLoadMore={() => {}}
											isLoadingMore={false}
											itemType="ai-model"
											shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
											hideTitle={true}
										/>

										{/* Pagination Controls */}
										{filteredAIModels.length > 0 && (
											<Pagination
												currentPage={aiModelsCurrentPage}
												totalPages={Math.ceil(
													filteredAIModels.length / aiModelsPageSize
												)}
												pageSize={aiModelsPageSize}
												totalItems={filteredAIModels.length}
												onPageChange={handleAiModelsPageChange}
												onPageSizeChange={handleAiModelsPageSizeChange}
												isLoading={aiModelsLoading}
											/>
										)}
									</div>
								</div>
							</motion.div>
						)}

						{activeTab === "softwares" && !isLoading && (
							<motion.div
								key="softwares"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={softwareCategories}
									selectedCategory={softwareFilters.selectedCategory}
									searchTerm={softwareFilters.searchTerm}
									totalItems={filteredSoftware.length}
									onCategoryChange={(category) =>
										setSoftwareFilters((prev) => ({
											...prev,
											selectedCategory: category,
										}))
									}
									onSearchChange={(search) =>
										setSoftwareFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setSoftwareFilters({
											selectedCategory: null,
											searchTerm: "",
										})
									}
									title="Software List"
									placeholder="Search software..."
								/>

								{/* Main Content */}
								<div className="flex-1 space-y-6">
									<MarketplaceSection
										title=""
										filteredItems={filteredSoftware}
										paginatedItems={paginatedSoftware}
										hasMoreItems={false}
										onItemClick={handleItemClick}
										onLoadMore={() => {}}
										isLoadingMore={false}
										itemType="software"
										shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
										hideTitle={true}
									/>

									{/* Pagination Controls */}
									{filteredSoftware.length > 0 && (
										<Pagination
											currentPage={softwareCurrentPage}
											totalPages={Math.ceil(
												filteredSoftware.length / softwarePageSize
											)}
											pageSize={softwarePageSize}
											totalItems={filteredSoftware.length}
											onPageChange={handleSoftwarePageChange}
											onPageSizeChange={handleSoftwarePageSizeChange}
											isLoading={false}
										/>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === "templates" && !isLoading && (
							<motion.div
								key="templates"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={templateCategories}
									selectedCategory={templatesFilters.selectedCategory}
									searchTerm={templatesFilters.searchTerm}
									totalItems={filteredTemplates.length}
									onCategoryChange={(category) =>
										setTemplatesFilters((prev) => ({
											...prev,
											selectedCategory: category,
										}))
									}
									onSearchChange={(search) =>
										setTemplatesFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setTemplatesFilters({
											selectedCategory: null,
											searchTerm: "",
										})
									}
									title="Templates List"
									placeholder="Search templates..."
								/>

								{/* Main Content */}
								<div className="flex-1 space-y-6">
									<MarketplaceSection
										title=""
										filteredItems={filteredTemplates}
										paginatedItems={paginatedTemplates}
										hasMoreItems={false}
										onItemClick={handleItemClick}
										onLoadMore={() => {}}
										isLoadingMore={false}
										itemType="template"
										shouldUseStaggeredAnimation={shouldUseStaggeredAnimation}
										hideTitle={true}
									/>

									{/* Pagination Controls */}
									{filteredTemplates.length > 0 && (
										<Pagination
											currentPage={templatesCurrentPage}
											totalPages={Math.ceil(
												filteredTemplates.length / templatesPageSize
											)}
											pageSize={templatesPageSize}
											totalItems={filteredTemplates.length}
											onPageChange={handleTemplatesPageChange}
											onPageSizeChange={handleTemplatesPageSizeChange}
											isLoading={false}
										/>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === "mcp-servers" && (
							<motion.div
								key="mcp-servers"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={mcpCategoriesWithCounts}
									selectedCategory={mcpFilters.selectedCategory}
									searchTerm={mcpFilters.searchTerm}
									totalItems={mcpData?.total || 0}
									onCategoryChange={(category) =>
										setMcpFilters((prev) => ({
											...prev,
											selectedCategory: category,
										}))
									}
									onSearchChange={(search) =>
										setMcpFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setMcpFilters({
											selectedCategory: null,
											searchTerm: "",
										})
									}
									title="MCP Servers"
									placeholder="Search servers..."
								/>

								{/* Main Content */}
								<div className="flex-1 space-y-6">
									{mcpIsLoading ? (
										<div className="text-center py-16">
											<div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
												Loading MCP servers...
											</div>
										</div>
									) : paginatedMcpServers.length === 0 ? (
										<div className="text-center py-16">
											<div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
												No MCP servers found
											</div>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												Try adjusting your search terms or filters
											</p>
										</div>
									) : (
										<>
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
												{paginatedMcpServers.map((server, index) => (
													<motion.div
														key={`${server.name}-${index}`}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.1 }}
													>
														<MemoizedMCPServerCard
															server={server}
															onClick={() =>
																handleItemClick(server, "mcp-server")
															}
														/>
													</motion.div>
												))}
											</div>

											{mcpData && mcpData.total > mcpPageSize && (
												<div className="mt-8">
													<Pagination
														currentPage={mcpCurrentPage}
														totalPages={Math.ceil(mcpData.total / mcpPageSize)}
														pageSize={mcpPageSize}
														totalItems={mcpData.total}
														onPageChange={handleMcpPageChange}
														onPageSizeChange={handleMcpPageSizeChange}
														isLoading={mcpIsLoading}
													/>
												</div>
											)}
										</>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === "workflows" && (
							<motion.div
								key="workflows"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col lg:flex-row gap-6"
							>
								{/* Sidebar Filter */}
								<MarketplaceFilter
									categories={workflowCategoriesWithCounts}
									selectedCategory={workflowsFilters.selectedCategory}
									searchTerm={workflowsFilters.searchTerm}
									totalItems={workflowsData?.total || 0}
									onCategoryChange={(category) =>
										setWorkflowsFilters((prev) => ({
											...prev,
											selectedCategory: category,
										}))
									}
									onSearchChange={(search) =>
										setWorkflowsFilters((prev) => ({
											...prev,
											searchTerm: search,
										}))
									}
									onClearFilters={() =>
										setWorkflowsFilters({
											selectedCategory: null,
											searchTerm: "",
										})
									}
									title="Workflows"
									placeholder="Search workflows..."
								/>

								{/* Main Content */}
								<div className="flex-1 space-y-6">
									{workflowsLoading ? (
										<div className="text-center py-16">
											<div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
												Loading workflows...
											</div>
										</div>
									) : workflowsError ? (
										<div className="text-center py-16">
											<div className="text-red-400 dark:text-red-500 text-lg mb-2">
												Failed to load workflows
											</div>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												Please try refreshing the page or check your connection
											</p>
										</div>
									) : paginatedWorkflows.length === 0 ? (
										<div className="text-center py-16">
											<div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
												No workflows found
											</div>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												Try adjusting your search terms or filters
											</p>
										</div>
									) : (
										<>
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
												{paginatedWorkflows.map((workflow, index) => (
													<motion.div
														key={workflow.id}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.1 }}
													>
														<MemoizedWorkflowCard
															workflow={workflow}
															onClick={() =>
																handleItemClick(workflow, "workflow")
															}
															onDownload={handleWorkflowDownload}
															onLoginRequired={handleLoginRequired}
														/>
													</motion.div>
												))}
											</div>

											{workflowsData &&
												workflowsData.total > workflowsPageSize && (
													<div className="mt-8">
														<Pagination
															currentPage={workflowsCurrentPage}
															totalPages={Math.ceil(
																workflowsData.total / workflowsPageSize
															)}
															pageSize={workflowsPageSize}
															totalItems={workflowsData.total}
															onPageChange={handleWorkflowsPageChange}
															onPageSizeChange={handleWorkflowsPageSizeChange}
															isLoading={workflowsLoading}
														/>
													</div>
												)}
										</>
									)}
								</div>
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

			{/* Login Popup */}
			<LoginPopup
				isOpen={isLoginPopupOpen}
				onClose={() => setIsLoginPopupOpen(false)}
			/>
		</div>
	);
}
