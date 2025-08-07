/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/display-name */
'use client';

import { AIModelCard } from '@/components/marketplace/ai-model-card';
import { AssistantCard } from '@/components/marketplace/assistant-card';
import { DetailDialog } from '@/components/marketplace/detail-dialog';
import { FeaturedMarketplaceSection } from '@/components/marketplace/feature-marketplace-section';
import { LoginPopup } from '@/components/marketplace/login-popup';
import { MarketplaceFilter } from '@/components/marketplace/marketplace-filter';
import { MarketplaceSection } from '@/components/marketplace/marketplace-section';
import { MCPServerCard } from '@/components/marketplace/mcp-server-card';
import { WorkflowCard } from '@/components/marketplace/workflow-card';

import { Pagination } from '@/components/marketplace/pagination';
import Tags from '@/components/marketplace/tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { MarketplaceItemCount } from '@/components/marketplace-item-count';
import { PREDEFINED_ASSISTANT_CATEGORIES } from '@/lib/constant/marketplace-constant';
import {
  homeMarketplaceItems,
  siteTemplates,
  softwareTools,
} from '@/lib/constants';
import type {
  DataTypes,
  // HomeMarketplaceItem,
  MCPDataTypes,
  MCPServerType,
  WorkflowType,
} from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  // BitcoinIcon,
  // Brain,
  // ChartBarIcon,
  // FileText,
  // Home,
  // PackageOpen,
  Search,
  // TowerControlIcon,
  // Users,
  User,
  Calendar,
  Sparkles,
  Download,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
  startTransition,
} from 'react';
import useSWR from 'swr';
// import { BlockchainIcon, MCPIcon, N8NIcon } from "@/components/icons";
import { useMarketplaceStore } from '@/store/marketplace-store';
// import { FAQSection } from "@/components/faq";
import { LoaderThree } from '@/components/animation/loader';
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  // CardTitle,
} from '@/components/ui/card';
// import { MarketplaceItemCard } from "@/components/marketplace/marketplace-item-card";
import { useRouter } from 'next/navigation';
import { saveChatModelAsCookie } from '@/app/(chat)/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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

// SWR config for workflows with optimistic caching
const workflowSwrConfig = {
  ...swrConfig,
  // Keep data in cache for longer
  dedupingInterval: 600000, // 10 minutes deduping
  // Revalidate in background without blocking UI
  revalidateOnMount: true,
  // Don't revalidate on focus to prevent unnecessary requests
  revalidateIfStale: false,
};

// Infer agent type from API - using DataTypes for consistency

type TabType =
  | 'home'
  | 'assistants'
  | 'ai-models'
  | 'softwares'
  | 'templates'
  | 'mcp-servers'
  | 'workflows';

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
  ),
);

const MemoizedAIModelCard = React.memo(
  ({ aiModel, onClick }: { aiModel: DataTypes; onClick: () => void }) => (
    <AIModelCard aiModel={aiModel} onClick={onClick} />
  ),
);

const MemoizedMCPServerCard = React.memo(
  ({ server, onClick }: { server: any; onClick: () => void }) => (
    <MCPServerCard server={server} onClick={onClick} />
  ),
);

const MemoizedWorkflowCard = memo(WorkflowCard);
MemoizedAIModelCard.displayName = 'MemoizedAIModelCard';
MemoizedMCPServerCard.displayName = 'MemoizedMCPServerCard';
MemoizedWorkflowCard.displayName = 'MemoizedWorkflowCard';

// Featured Item Dialog Component
const FeaturedItemDialog = ({
  item,
  isOpen,
  onClose,
}: {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();

  if (!item) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'courses':
        return '📚';
      case 'tutors':
        return '👨‍🏫';
      case 'resources':
        return '📖';
      case 'ai-models':
        return '🤖';
      case 'software':
        return '💻';
      case 'templates':
        return '🎨';
      default:
        return '📄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'courses':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'tutors':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'resources':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ai-models':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'software':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'templates':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleUseAssistant = () => {
    const assistantModelId = `assistant-${item.id}`;
    // Persist assistant selection via server action and then navigate to chat page
    startTransition(() => {
      saveChatModelAsCookie(assistantModelId).then(() => {
        // Persist assistant details in localStorage for client use
        localStorage.setItem('selected-assistant', JSON.stringify(item));
        router.push('/');
      });
    });
    onClose();
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
                    <span>{item.creator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>{item.date}</span>
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
                onClick={handleUseAssistant}
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

// Pagination constants
const ITEMS_PER_PAGE = 24;
const FEATURED_ITEMS = 6;

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedItem, setSelectedItem] = useState<
    DataTypes | MCPDataTypes | MCPServerType | WorkflowType | null
  >(null);
  const [dialogType, setDialogType] = useState<
    | 'assistant'
    | 'mcp-server'
    | 'ai-model'
    | 'software'
    | 'template'
    | 'workflow'
  >('assistant');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [assistantsPageSize, setAssistantsPageSize] = useState(ITEMS_PER_PAGE);
  const [mcpCurrentPage, setMcpCurrentPage] = useState(1);
  const [mcpPageSize, setMcpPageSize] = useState(20);

  const [featuredItem, setFeaturedItem] = useState<any>();

  // Featured item dialog state
  const [selectedFeaturedItem, setSelectedFeaturedItem] = useState<any>(null);
  const [isFeaturedDialogOpen, setIsFeaturedDialogOpen] = useState(false);

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
    searchTerm: '',
  });
  const [aiModelsFilters, setAiModelsFilters] = useState({
    selectedCreator: null as string | null,
    searchTerm: '',
  });
  const [softwareFilters, setSoftwareFilters] = useState({
    selectedCategory: null as string | null,
    searchTerm: '',
  });
  const [templatesFilters, setTemplatesFilters] = useState({
    selectedCategory: null as string | null,
    searchTerm: '',
  });
  const [mcpFilters, setMcpFilters] = useState({
    selectedCategory: null as string | null,
    searchTerm: '',
  });
  const [workflowsFilters, setWorkflowsFilters] = useState({
    selectedCategory: null as string | null,
    searchTerm: '',
  });

  const { setTotalItems } = useMarketplaceStore();

  useEffect(() => {
    setMounted(true);

    const featuredItems = homeMarketplaceItems.slice(0, 6);
    setFeaturedItem(featuredItems);
  }, []);

  console.log('featured', featuredItem);

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
    activeTab === 'assistants'
      ? `marketplace/api/agents?page=${currentPage}&pageSize=${assistantsPageSize}${
          assistantsFilters.selectedCategory
            ? `&category=${encodeURIComponent(
                assistantsFilters.selectedCategory,
              )}`
            : ''
        }${
          assistantsFilters.searchTerm
            ? `&search=${encodeURIComponent(assistantsFilters.searchTerm)}`
            : ''
        }`
      : `marketplace/api/agents?page=1&pageSize=${FEATURED_ITEMS}`, // For home page featured items
    fetcher,
    swrConfig,
  );

  // Fetch AI models
  const {
    data: aiModelsData,
    isLoading: aiModelsLoading,
    error: aiModelsError,
  } = useSWR<{ models: DataTypes[]; total: number }>(
    `marketplace/api/ai-models${
      aiModelsFilters.searchTerm && activeTab === 'ai-models'
        ? `?search=${encodeURIComponent(aiModelsFilters.searchTerm)}`
        : ''
    }`,
    aiModelsFetcher,
    swrConfig,
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
        : ''
    }${
      mcpFilters.searchTerm && activeTab === 'mcp-servers'
        ? `&search=${encodeURIComponent(mcpFilters.searchTerm)}`
        : ''
    }`,
    mcpServersFetcher,
    swrConfig,
  );

  const { data: categoriesData } = useSWR(
    'marketplace/api/mcp-servers/categories',
    (url: string) =>
      fetch(url).then((res) => res.json()) as Promise<{ categories: string[] }>,
    swrConfig,
  );

  // Fetch workflows - only when needed
  const {
    data: workflowsData,
    isLoading: workflowsLoading,
    error: workflowsError,
    isValidating: workflowsValidating,
  } = useSWR(
    activeTab === 'workflows' || activeTab === 'home'
      ? `marketplace/api/workflows?page=${workflowsCurrentPage}&pageSize=${workflowsPageSize}${
          workflowsFilters.selectedCategory
            ? `&category=${encodeURIComponent(
                workflowsFilters.selectedCategory,
              )}`
            : ''
        }${
          workflowsFilters.searchTerm && activeTab === 'workflows'
            ? `&search=${encodeURIComponent(workflowsFilters.searchTerm)}`
            : ''
        }`
      : null,
    workflowsFetcher,
    workflowSwrConfig,
  );

  // Fetch all data without pagination or filtering for FeaturedMarketplaceSection
  const { data: allAssistantsData, isLoading: allAssistantsLoading } = useSWR(
    activeTab === 'home' ? 'marketplace/api/agents?page=1&pageSize=1000' : null,
    fetcher,
    swrConfig,
  );

  const { data: allAiModelsData, isLoading: allAiModelsLoading } = useSWR<{
    models: DataTypes[];
    total: number;
  }>(
    activeTab === 'home' ? 'marketplace/api/ai-models' : null,
    aiModelsFetcher,
    swrConfig,
  );

  const { data: allMcpServersData, isLoading: allMcpServersLoading } = useSWR(
    activeTab === 'home'
      ? 'marketplace/api/mcp-servers?page=1&pageSize=1000'
      : null,
    mcpServersFetcher,
    swrConfig,
  );

  const { data: allWorkflowsData, isLoading: allWorkflowsLoading } = useSWR(
    activeTab === 'home'
      ? 'marketplace/api/workflows?page=1&pageSize=1000'
      : null,
    workflowsFetcher,
    workflowSwrConfig,
  );

  const assistants = useMemo(() => aiAgentsData?.agents ?? [], [aiAgentsData]);
  const assistantsTotal = useMemo(
    () => aiAgentsData?.total ?? 0,
    [aiAgentsData],
  );
  const aiModels = useMemo(() => aiModelsData?.models ?? [], [aiModelsData]);
  const mcpServers = useMemo(() => mcpData?.servers ?? [], [mcpData]);
  const mcpCategories = useMemo(
    () => categoriesData?.categories ?? [],
    [categoriesData],
  );
  const workflows = useMemo(
    () => workflowsData?.workflows ?? [],
    [workflowsData],
  );

  // All unfiltered data for FeaturedMarketplaceSection
  const allAssistants = useMemo(
    () => allAssistantsData?.agents ?? [],
    [allAssistantsData],
  );
  const allAiModels = useMemo(
    () => allAiModelsData?.models ?? [],
    [allAiModelsData],
  );
  const allMcpServers = useMemo(
    () => allMcpServersData?.servers ?? [],
    [allMcpServersData],
  );
  const allWorkflows = useMemo(
    () => allWorkflowsData?.workflows ?? [],
    [allWorkflowsData],
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
      const category = item.category || 'General';
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
      const category = item.category || 'General';
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
      const creator = item.creator || 'Unknown';
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
    [],
  );
  const aiModelCreators = useMemo(
    () => getCreatorsWithCounts(aiModels),
    [aiModels, getCreatorsWithCounts],
  );
  const softwareCategories = useMemo(
    () => getCategoriesWithCounts(softwareTools),
    [getCategoriesWithCounts],
  );
  const templateCategories = useMemo(
    () => getCategoriesWithCounts(siteTemplates),
    [getCategoriesWithCounts],
  );
  const mcpCategoriesWithCounts = useMemo(() => {
    const categoryMap = new Map<string, number>();
    mcpServers.forEach((server) => {
      const category = server.category || 'General';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [mcpServers]);

  const workflowCategoriesWithCounts = useMemo(() => {
    const categoryMap = new Map<string, number>();
    workflows.forEach((workflow) => {
      const category = workflow.category || 'General';
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
        | 'assistant'
        | 'ai-model'
        | 'software'
        | 'template'
        | 'mcp-server'
        | 'workflow',
    ) => {
      setSelectedItem(item);
      setDialogType(
        type === 'assistant'
          ? 'assistant'
          : type === 'ai-model'
            ? 'ai-model'
            : type === 'mcp-server'
              ? 'mcp-server'
              : type === 'software'
                ? 'software'
                : type === 'template'
                  ? 'template'
                  : type === 'workflow'
                    ? 'workflow'
                    : 'assistant',
      );
      setIsDialogOpen(true);
    },
    [],
  );

  const handleFeaturedItemClick = useCallback((item: any) => {
    setSelectedFeaturedItem(item);
    setIsFeaturedDialogOpen(true);
  }, []);

  const handleCloseFeaturedDialog = useCallback(() => {
    setIsFeaturedDialogOpen(false);
    setSelectedFeaturedItem(null);
  }, []);

  const handleViewMore = useCallback((type: 'assistants') => {
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
      filters: { selectedCategory: string | null; searchTerm: string },
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
    [],
  );

  // Filter function specifically for AI models (by creator)
  const getFilteredAIModels = useCallback(
    (
      items: DataTypes[],
      filters: { selectedCreator: string | null; searchTerm: string },
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
    [],
  );

  // For assistants, we use server-side filtering so no client-side filtering needed
  const filteredAssistants = useMemo(() => assistants, [assistants]);
  const filteredAIModels = useMemo(
    () => getFilteredAIModels(aiModels, aiModelsFilters),
    [aiModels, aiModelsFilters, getFilteredAIModels],
  );
  const filteredSoftware = useMemo(
    () => getFilteredItems(softwareTools, softwareFilters),
    [softwareFilters, getFilteredItems],
  );
  const filteredTemplates = useMemo(
    () => getFilteredItems(siteTemplates, templatesFilters),
    [templatesFilters, getFilteredItems],
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
        `/marketplace/api/workflows/download/${workflow.id}`,
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
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
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-border transition-colors duration-200"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 py-4 sm:h-16 sm:py-0">
            <div className="flex items-center gap-4 sm:gap-8">
              <SidebarTrigger />

              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Portdex Marketplace
              </h1>

              {/* Search - Only show for home tab */}
              {/* {activeTab === 'home' && (
                <div className="hidden lg:block relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4" />
                  <Input
                    placeholder="Search marketplace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 xl:w-80 bg-white dark:bg-white/10 border-gray-200 dark:border-gray-700"
                  />
                </div>
              )} */}
            </div>

            <div className="flex items-center justify-end space-x-2">
              {/* <MarketplaceItemCount /> */}
              <Badge variant="secondary" className="text-xs">
                1500+ items
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <section className="relative h-40 overflow-hidden rounded-2xl bg-[url(/marketplace-banner.jpg)] bg-origin-padding bg-cover bg-no-repeat my-5 mx-10">
        <div className="flex flex-col sm:flex-row items-center justify-start py-4 px-8">
          <div className="z-10 max-w-2xl w-full text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 font-serif">
              Add AI Agents to your assistant in minutes
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mb-4">
              Transform your financial landscape with the AI Marketplace, the
              ultimate hub for crypto enthusiasts and finance professionals
              alike, designed to enhance productivity, reduce operational
              hurdles, and propel your investments into the fast lane.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile/Tablet Search - Only for home tab */}
      {activeTab === 'home' && (
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

      {/* Navigation
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
			</motion.nav> */}

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="">
          <AnimatePresence mode="wait">
            {/* Show loading only for core sections, not workflows */}
            {/* {(isLoading || aiModelsLoading) && activeTab === 'home' && (
              <div className="py-16 flex justify-center items-center">
                <LoaderThree />
              </div>
            )} */}
            {/* Show workflow loading indicator only when no cached data */}
            {workflowsLoading && !allWorkflowsData && activeTab === 'home' && (
              <div className="py-16 flex justify-center items-center">
                <LoaderThree />
              </div>
            )}
            {(error || aiModelsError) && (
              <div className="py-16 text-center text-red-500">
                Failed to load marketplace data.
              </div>
            )}

            {activeTab === 'home' && !isLoading && !aiModelsLoading && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                <section className="flex flex-col justify-start items-start gap-5">
                  <h2 className="text-2xl font-bold bg-gradient-to-tr from-purple-300 to-purple-600 bg-clip-text text-transparent">
                    Featured Agents
                  </h2>
                  <Carousel
                    opts={{
                      align: 'start',
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {featuredItem.map((item: any) => (
                        <CarouselItem
                          key={item.id}
                          className="pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                          <Card
                            className="hover:shadow-lg hover:border-purple-400 transition-all duration-200 cursor-pointer h-full"
                            onClick={() => handleFeaturedItemClick(item)}
                          >
                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex flex-col gap-3 grow">
                                {/* Icon and Title together */}
                                <div className="flex items-center gap-3">
                                  <div className="shrink-0 size-10 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-200 dark:border-blue-700/50">
                                    {item.icon || '🔧'}
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                    {item.title}
                                  </h4>
                                </div>
                                {/* Description below */}
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </Carousel>
                </section>

                {/* Featured Items with Filter */}
                <section>
                  <FeaturedMarketplaceSection
                    assistants={allAssistants}
                    aiModels={allAiModels}
                    mcpServers={allMcpServers}
                    workflows={allWorkflows}
                    onItemClick={handleItemClick}
                    onDownload={handleWorkflowDownload}
                    software={softwareTools}
                    templates={siteTemplates}
                    title="Featured Items"
                    defaultShowAssistantsAndWorkflows={true}
                  />
                </section>

                {/* FAQ Section */}
                {/* <FAQSection faqs={marketplaceFAQs} /> */}
              </motion.div>
            )}

            {activeTab === 'assistants' && !isLoading && (
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
                      searchTerm: '',
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
                        assistantsTotal / assistantsPageSize,
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

            {activeTab === 'ai-models' && !aiModelsLoading && (
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
                      searchTerm: '',
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
                          filteredAIModels.length / aiModelsPageSize,
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

            {activeTab === 'softwares' && !isLoading && (
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
                      searchTerm: '',
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
                        filteredSoftware.length / softwarePageSize,
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

            {activeTab === 'templates' && !isLoading && (
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
                      searchTerm: '',
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
                        filteredTemplates.length / templatesPageSize,
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

            {activeTab === 'mcp-servers' && (
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
                      searchTerm: '',
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
                                handleItemClick(server, 'mcp-server')
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

            {activeTab === 'workflows' && (
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
                      searchTerm: '',
                    })
                  }
                  title="Workflows"
                  placeholder="Search workflows..."
                />

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                  {workflowsLoading && !workflowsData ? (
                    <div className="text-center py-16">
                      <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                        Loading workflows...
                      </div>
                    </div>
                  ) : workflowsError && !workflowsData ? (
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
                                handleItemClick(workflow, 'workflow')
                              }
                              onDownload={handleWorkflowDownload}
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
                                workflowsData.total / workflowsPageSize,
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

      {/* Featured Item Dialog */}
      <FeaturedItemDialog
        item={selectedFeaturedItem}
        isOpen={isFeaturedDialogOpen}
        onClose={handleCloseFeaturedDialog}
      />
    </div>
  );
}
