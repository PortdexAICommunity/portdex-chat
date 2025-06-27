/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/display-name */
"use client";

import { AIModelCard } from "@/components/marketplace/ai-model-card";
import { AssistantCard } from "@/components/marketplace/assistant-card";
import { DetailDialog } from "@/components/marketplace/detail-dialog";
import { MarketplaceSection } from "@/components/marketplace/marketplace-section";
import { MCPServerCard } from "@/components/marketplace/mcp-server-card";
import { MCPServersSidebar } from "@/components/marketplace/mcp-servers-sidebar";
import { Pagination } from "@/components/marketplace/pagination";
import { PluginCard } from "@/components/marketplace/plugin-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { plugins, siteTemplates, softwareTools } from "@/lib/constants";
import type { DataTypes, MCPDataTypes, MCPServerType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  FileText,
  Home,
  PackageOpen,
  Puzzle,
  Search,
  Server,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

// Infer agent type from API - using DataTypes for consistency

type TabType =
  | "home"
  | "assistants"
  | "plugins"
  | "ai-models"
  | "softwares"
  | "templates"
  | "mcp-servers";

// --- SWR fetcher ---
const fetcher = (url: string) =>
  fetch(url).then((res) => res.json()) as Promise<{ agents: MCPDataTypes[] }>;

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

const MemoizedMCPServerCard = React.memo(
  ({ server, onClick }: { server: any; onClick: () => void }) => (
    <MCPServerCard server={server} onClick={onClick} />
  )
);

MemoizedAssistantCard.displayName = "MemoizedAssistantCard";
MemoizedAIModelCard.displayName = "MemoizedAIModelCard";
MemoizedPluginCard.displayName = "MemoizedPluginCard";
MemoizedMCPServerCard.displayName = "MemoizedMCPServerCard";

// Pagination constants
const ITEMS_PER_PAGE = 24; // Adjust based on your preference
const FEATURED_ITEMS = 8; // For home page
const FEATURED_OTHER_ITEMS = 4;

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedItem, setSelectedItem] = useState<
    DataTypes | MCPDataTypes | MCPServerType | null
  >(null);
  const [dialogType, setDialogType] = useState<
    "assistant" | "plugin" | "mcp-server" | "ai-model"
  >("assistant");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mcpCurrentPage, setMcpCurrentPage] = useState(1);
  const [mcpPageSize, setMcpPageSize] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
    setMcpCurrentPage(1);
  }, [searchTerm, activeTab]);

  // Reset category filter when switching away from MCP servers tab
  useEffect(() => {
    if (activeTab !== "mcp-servers") {
      setSelectedCategory(null);
    }
  }, [activeTab]);

  // Fetch assistants/agents
  const {
    data: aiAgentsData,
    isLoading,
    error,
  } = useSWR<{ agents: DataTypes[] }>("marketplace/api/agents", fetcher);

  // Fetch AI models (including Anthropic)
  const {
    data: aiModelsData,
    isLoading: aiModelsLoading,
    error: aiModelsError,
  } = useSWR<{ models: DataTypes[]; total: number }>(
    `marketplace/api/ai-models${
      searchTerm && activeTab === "ai-models"
        ? `?search=${encodeURIComponent(searchTerm)}`
        : ""
    }`,
    aiModelsFetcher
  );

  // Fetch MCP servers
  const {
    data: mcpData,
    isLoading: mcpIsLoading,
    error: mcpError,
  } = useSWR(
    `marketplace/api/mcp-servers?page=${mcpCurrentPage}&pageSize=${mcpPageSize}${
      selectedCategory
        ? `&category=${encodeURIComponent(selectedCategory)}`
        : ""
    }${
      searchTerm && activeTab === "mcp-servers"
        ? `&search=${encodeURIComponent(searchTerm)}`
        : ""
    }`,
    mcpServersFetcher
  );

  const { data: categoriesData } = useSWR(
    "marketplace/api/mcp-servers/categories",
    (url: string) =>
      fetch(url).then((res) => res.json()) as Promise<{ categories: string[] }>
  );

  const assistants = useMemo(() => aiAgentsData?.agents ?? [], [aiAgentsData]);
  const aiModels = useMemo(() => aiModelsData?.models ?? [], [aiModelsData]);
  const mcpServers = useMemo(() => mcpData?.servers ?? [], [mcpData]);
  const mcpCategories = useMemo(
    () => categoriesData?.categories ?? [],
    [categoriesData]
  );

  const handleItemClick = useCallback(
    (
      item: DataTypes | MCPDataTypes | MCPServerType,
      type:
        | "assistant"
        | "plugin"
        | "ai-model"
        | "software"
        | "template"
        | "mcp-server"
    ) => {
      // Set the selected item and dialog type for modal
      setSelectedItem(item);
      setDialogType(
        type === "assistant"
          ? "assistant"
          : type === "ai-model"
          ? "ai-model"
          : type === "mcp-server"
          ? "mcp-server"
          : "plugin"
      );
      setIsDialogOpen(true);
    },
    []
  );

  const handleViewMore = useCallback((type: "assistants" | "plugins") => {
    setActiveTab(type);
  }, []);

  const handleMcpPageChange = useCallback((page: number) => {
    setMcpCurrentPage(page);
  }, []);

  const handleMcpPageSizeChange = useCallback((pageSize: number) => {
    setMcpPageSize(pageSize);
    setMcpCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setMcpCurrentPage(1); // Reset to first page when changing category
  }, []);

  // Filter items based on search term (memoized)
  const filteredAssistants = useMemo(
    () =>
      assistants.filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assistant.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assistant.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assistant.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [assistants, searchTerm]
  );

  // Paginated assistants for the assistants tab
  const paginatedAssistants = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredAssistants.slice(startIndex, endIndex);
  }, [filteredAssistants, currentPage]);

  // AI Models are now filtered server-side, so we use them directly
  const filteredAIModels = useMemo(() => aiModels, [aiModels]);

  // Paginated AI Models
  const paginatedAIModels = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredAIModels.slice(startIndex, endIndex);
  }, [filteredAIModels, currentPage]);

  // Filter and paginate plugins
  const filteredPlugins = useMemo(
    () =>
      plugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const paginatedPlugins = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredPlugins.slice(startIndex, endIndex);
  }, [filteredPlugins, currentPage]);

  // Filter and paginate software
  const filteredSoftware = useMemo(
    () =>
      softwareTools.filter(
        (software) =>
          software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          software.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          software.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          software.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const paginatedSoftware = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredSoftware.slice(startIndex, endIndex);
  }, [filteredSoftware, currentPage]);

  // Filter and paginate templates
  const filteredTemplates = useMemo(
    () =>
      siteTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          template.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const paginatedTemplates = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredTemplates.slice(startIndex, endIndex);
  }, [filteredTemplates, currentPage]);

  const paginatedMcpServers = useMemo(() => mcpServers, [mcpServers]);

  const hasMoreItems = paginatedAssistants.length < filteredAssistants.length;
  const hasMoreAIModels = paginatedAIModels.length < filteredAIModels.length;
  const hasMorePlugins = paginatedPlugins.length < filteredPlugins.length;
  const hasMoreSoftware = paginatedSoftware.length < filteredSoftware.length;
  const hasMoreTemplates = paginatedTemplates.length < filteredTemplates.length;
  const hasMoreMcpServers = mcpData
    ? mcpCurrentPage * mcpPageSize < mcpData.total
    : false;

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
        : activeTab === "mcp-servers"
        ? hasMoreMcpServers
        : false;

    if (!hasMore) return;

    setIsLoadingMore(true);
    // Simulate loading delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (activeTab === "mcp-servers") {
      setMcpCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage((prev) => prev + 1);
    }

    setIsLoadingMore(false);
  }, [
    isLoadingMore,
    activeTab,
    hasMoreItems,
    hasMoreAIModels,
    hasMorePlugins,
    hasMoreSoftware,
    hasMoreTemplates,
    hasMoreMcpServers,
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

            <div className="flex items-center justify-end space-x-2">
              <Badge variant="secondary" className="text-xs">
                {assistants.length + aiModels.length + mcpServers.length} items
              </Badge>
            </div>
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
              { id: "mcp-servers", label: "MCP Servers", icon: Server },
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
                    : tab.id === "templates"
                    ? "Templates"
                    : "MCP Servers"}
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
            {(isLoading || aiModelsLoading) && (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

                {/* Featured AI Models (including Anthropic) */}
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

                {/* Featured MCP Servers */}
                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Featured MCP Servers
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("mcp-servers")}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 self-start sm:self-auto"
                    >
                      Discover More →
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {mcpServers
                      .slice(0, FEATURED_OTHER_ITEMS)
                      .map((server, index) => (
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
                </section>
              </motion.div>
            )}

            {activeTab === "assistants" && !isLoading && (
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
            )}

            {activeTab === "ai-models" && !aiModelsLoading && (
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
            )}

            {activeTab === "plugins" && !isLoading && (
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
            )}

            {activeTab === "softwares" && !isLoading && (
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
            )}

            {activeTab === "templates" && !isLoading && (
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
            )}

            {activeTab === "mcp-servers" && (
              <motion.div
                key="mcp-servers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      MCP Servers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {mcpData?.total || 0} servers available
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Sidebar */}

                  <div className="hidden lg:block w-64 shrink-0">
                    <MCPServersSidebar
                      categories={mcpCategories}
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      totalServers={mcpData?.total || 0}
                      filteredServers={mcpData?.total || 0}
                    />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-6">
                    {/* Mobile Sidebar */}
                    <div className="lg:hidden">
                      <MCPServersSidebar
                        categories={mcpCategories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        totalServers={mcpData?.total || 0}
                        filteredServers={mcpData?.total || 0}
                      />
                    </div>

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

                        {/* Pagination */}
                        {mcpData && mcpData.total > mcpPageSize && (
                          <div className="mt-8">
                            <Pagination
                              currentPage={mcpCurrentPage}
                              totalPages={Math.ceil(
                                mcpData.total / mcpPageSize
                              )}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Dialog - Updated to handle MCP servers */}
      <DetailDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={selectedItem}
        type={dialogType}
      />
    </div>
  );
}
