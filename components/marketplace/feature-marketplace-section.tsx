'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { WorkflowCard } from './workflow-card';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import type { WorkflowType, DataTypes } from '@/lib/types';

// Import llm-apps data
import llmAppsData from '@/lib/llm-apps.json';
import { softwareTools, siteTemplates } from '@/lib/constants';
import modelsData from '@/lib/models.json';
import { AIAgentIcon } from '../icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PackageIcon } from 'lucide-react';

type FilterType =
  | 'all'
  | 'General'
  | 'RAG'
  | 'Voice Agent'
  | 'MCP'
  | 'workflow'
  | 'software'
  | 'template'
  | 'models';

interface FeaturedItemsProps {
  workflows: WorkflowType[];
  onItemClick: (
    item: any,
    type:
      | 'assistant'
      | 'ai-model'
      | 'mcp-server'
      | 'workflow'
      | 'software'
      | 'template',
  ) => void;
  onDownload?: (workflow: WorkflowType) => void;
  title?: string;
  defaultShowAssistantsAndWorkflows?: boolean;
  onNavigateToTab?: (tab: string) => void;
  editorsChoiceSoftware?: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    url?: string;
    tags?: string[];
  }>;
  softwareItems?: DataTypes[];
  mcpServers?: Array<{
    name: string;
    url: string;
    description: string;
    category: string;
    official?: boolean;
    languages?: string[];
    scope?: string[];
    operating_systems?: string[];
  }>;
}

export function FeaturedMarketplaceSection({
  workflows,
  onItemClick,
  onDownload,
  title = 'Featured Items',
  defaultShowAssistantsAndWorkflows = false,
  onNavigateToTab,
  editorsChoiceSoftware = [],
  softwareItems = [],
  mcpServers = [],
}: FeaturedItemsProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({
    General: [],
    RAG: [],
    'Voice Agent': [],
    MCP: [],
    workflow: [],
    software: [],
    template: [],
    models: [],
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      const offsetTop = sectionRef.current.offsetTop - 100; // Adjust offset as needed
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // State for managing random items and load more functionality
  const [expandedItems, setExpandedItems] = useState<Record<string, number>>({
    General: 8,
    RAG: 4,
    'Voice Agent': 4,
    MCP: 4,
    workflow: 8,
    software: 20,
    template: 4,
    models: 8,
  });

  // Editor's Pick expand/collapse state (only for the Editor's Pick row)
  const [editorsExpanded, setEditorsExpanded] = useState(false);

  // Fixed tags for the Agents (General) section
  const fixedAgentTags = useMemo(
    () => ['finance', 'investment', 'analysis', 'content creation', 'coaching'],
    [],
  );

  // Function to get random items from an array (consistent based on array length)
  const getRandomItems = (items: any[], count: number, seed?: string) => {
    if (items.length === 0) return [];
    if (items.length <= count) return items;

    // Use a simple hash for consistent randomness
    const hash = seed || items.length.toString();
    const shuffled = [...items].sort((a, b) => {
      const aHash = hash + a.title + a.description;
      const bHash = hash + b.title + b.description;
      return aHash.localeCompare(bHash);
    });
    return shuffled.slice(0, count);
  };

  // Get categories and items from llm-apps.json
  const categories = llmAppsData.metadata.categories;
  const categoryItems = llmAppsData.categories;
  // Prefer dynamic software from props if provided
  const softwareSource =
    softwareItems && softwareItems.length > 0 ? softwareItems : softwareTools;

  // Function to get the primary type from an item (prefer the first type if multiple)
  const getPrimaryType = (item: any): string => {
    if (!item.type || !Array.isArray(item.type) || item.type.length === 0) {
      return 'General';
    }
    const type = item.type[0];
    // Combine Single Agent and Multi-agent into General
    if (type === 'Single Agent' || type === 'Multi-agent') {
      return 'General';
    }
    return type;
  };

  // Organize items by type
  const itemsByType = useMemo(() => {
    const organized: Record<string, any[]> = {
      General: [],
      RAG: [],
      'Voice Agent': [],
      MCP: [],
    };

    // Process all items from categories
    Object.values(categoryItems)
      .flat()
      .forEach((item) => {
        const primaryType = getPrimaryType(item);
        if (organized[primaryType]) {
          organized[primaryType].push(item);
        } else {
          organized.General.push(item);
        }
      });

    // If MCP servers are provided from API, prefer those over static data
    if (mcpServers && mcpServers.length > 0) {
      organized.MCP = mcpServers.map((server) => ({
        title: server.name,
        description: server.description,
        category: server.category || 'MCP',
        tags: Array.from(
          new Set([
            ...(server.languages || []),
            ...(server.scope || []),
            ...(server.operating_systems || []),
          ]),
        ),
        url: server.url,
        __source: 'api-mcp',
      }));
    }

    return organized;
  }, [categoryItems, mcpServers]);

  // Get all unique tags from items
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(categoryItems)
      .flat()
      .forEach((item) => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag: string) => tags.add(tag));
        }
      });
    return Array.from(tags).sort();
  }, [categoryItems]);

  // Get Editor's Choice items - one from each type (prefer software editor picks if provided)
  const editorsChoiceItems = useMemo(() => {
    if (editorsChoiceSoftware.length > 0) {
      return editorsChoiceSoftware.map((s) => ({ item: s, type: 'software' }));
    }
    // fallback to previous behavior if none provided
    const choiceItems: Array<{ item: any; type: string }> = [];
    const types = ['General', 'RAG', 'Voice Agent', 'MCP'];
    types.forEach((type) => {
      const items = itemsByType[type] || [];
      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        choiceItems.push({
          item: items[randomIndex],
          type: type === 'MCP' ? 'mcp-server' : 'assistant',
        });
      }
    });
    return choiceItems;
  }, [editorsChoiceSoftware, itemsByType]);

  // Filter items by selected tags for a specific section
  const filterItemsByTags = useCallback(
    (items: any[], sectionType: string) => {
      const sectionTags = selectedTags[sectionType] || [];
      if (sectionTags.length === 0) return items;
      return items.filter((item) => {
        if (!item.tags || !Array.isArray(item.tags)) return false;
        return sectionTags.some((tag) => item.tags.includes(tag));
      });
    },
    [selectedTags],
  );

  // Count items for each type
  const counts = {
    all: defaultShowAssistantsAndWorkflows
      ? workflows.length +
        Object.values(itemsByType).reduce(
          (acc, items) => acc + items.length,
          0,
        ) +
        softwareSource.length +
        siteTemplates.length +
        modelsData.length
      : workflows.length +
        Object.values(itemsByType).reduce(
          (acc, items) => acc + items.length,
          0,
        ) +
        softwareSource.length +
        siteTemplates.length +
        modelsData.length,
    General: filterItemsByTags(itemsByType.General || [], 'General').length,
    RAG: filterItemsByTags(itemsByType.RAG || [], 'RAG').length,
    'Voice Agent': filterItemsByTags(
      itemsByType['Voice Agent'] || [],
      'Voice Agent',
    ).length,
    MCP: filterItemsByTags(itemsByType.MCP || [], 'MCP').length,
    workflow: workflows.length,
    software: softwareSource.length,
    template: siteTemplates.length,
    models: modelsData.length,
  };

  // Memoized random items for each type
  const randomItems = useMemo(
    () => ({
      General: getRandomItems(
        filterItemsByTags(itemsByType.General || [], 'General'),
        Math.max(expandedItems.General, 6),
        'General',
      ),
      RAG: getRandomItems(
        filterItemsByTags(itemsByType.RAG || [], 'RAG'),
        Math.max(expandedItems.RAG, 6),
        'RAG',
      ),
      'Voice Agent': getRandomItems(
        filterItemsByTags(itemsByType['Voice Agent'] || [], 'Voice Agent'),
        Math.max(expandedItems['Voice Agent'], 6),
        'Voice Agent',
      ),
      MCP: getRandomItems(
        filterItemsByTags(itemsByType.MCP || [], 'MCP'),
        Math.max(expandedItems.MCP, 6),
        'MCP',
      ),
      workflow: getRandomItems(
        workflows,
        Math.max(expandedItems.workflow, 6),
        'workflow',
      ),
      software: getRandomItems(
        softwareSource,
        Math.max(expandedItems.software, 6),
        'software',
      ),
      template: getRandomItems(
        siteTemplates,
        Math.max(expandedItems.template, 6),
        'template',
      ),
      models: getRandomItems(
        modelsData,
        Math.max(expandedItems.models, 6),
        'models',
      ),
    }),
    [itemsByType, workflows, expandedItems, softwareSource, filterItemsByTags],
  );

  // Function to handle load more for a specific type
  const handleLoadMore = (type: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [type]: prev[type] + 15,
    }));
  };

  // Function to handle view more (switch to specific type or navigate to assistants tab)
  const handleViewMore = (type: FilterType) => {
    if (type === 'General' && onNavigateToTab) {
      // Navigate to assistants tab for General items
      onNavigateToTab('assistants');
    } else if (type === 'RAG' && onNavigateToTab) {
      // Navigate to assistants tab for RAG items (they are assistants)
      onNavigateToTab('assistants');
    } else if (type === 'Voice Agent' && onNavigateToTab) {
      // Navigate to assistants tab for Voice Agent items (they are assistants)
      onNavigateToTab('assistants');
    } else if (type === 'MCP' && onNavigateToTab) {
      // Navigate to mcp-servers tab for MCP items
      onNavigateToTab('mcp-servers');
    } else if (type === 'workflow' && onNavigateToTab) {
      // Navigate to workflows tab for workflow items
      onNavigateToTab('workflows');
    } else if (type === 'software' && onNavigateToTab) {
      // Navigate to softwares tab for software items
      onNavigateToTab('softwares');
    } else if (type === 'template' && onNavigateToTab) {
      // Navigate to templates tab for template items
      onNavigateToTab('templates');
    } else if (type === 'models' && onNavigateToTab) {
      // Navigate to ai-models tab for models
      onNavigateToTab('ai-models');
    } else {
      setSelectedFilter(type);
      setExpandedItems((prev) => ({
        ...prev,
        [type]: 6, // Reset to initial count when switching
      }));
      scrollToSection();
    }
  };

  // Function to handle tag selection for a specific section
  const handleTagClick = (tag: string, sectionType: string) => {
    setSelectedTags((prev) => {
      const currentSectionTags = prev[sectionType] || [];
      const newSectionTags = currentSectionTags.includes(tag)
        ? currentSectionTags.filter((t) => t !== tag)
        : [...currentSectionTags, tag];

      return {
        ...prev,
        [sectionType]: newSectionTags,
      };
    });
  };

  // Filter items based on selected filter
  const getFilteredItems = () => {
    switch (selectedFilter) {
      case 'General':
        return filterItemsByTags(itemsByType.General || [], 'General').map(
          (item) => ({
            item,
            type: 'assistant' as const,
          }),
        );
      case 'RAG':
        return filterItemsByTags(itemsByType.RAG || [], 'RAG').map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Voice Agent':
        return filterItemsByTags(
          itemsByType['Voice Agent'] || [],
          'Voice Agent',
        ).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'MCP':
        return filterItemsByTags(itemsByType.MCP || [], 'MCP').map((item) => ({
          item,
          type: 'mcp-server' as const,
        }));
      case 'workflow':
        return workflows.map((item) => ({
          item,
          type: 'workflow' as const,
        }));
      case 'software':
        return softwareSource.map((item) => ({
          item,
          type: 'software' as const,
        }));
      case 'template':
        return siteTemplates.map((item) => ({
          item,
          type: 'template' as const,
        }));
      case 'models':
        return modelsData.map((item) => ({
          item,
          type: 'ai-model' as const,
        }));
      default:
        // When "all" is selected, return sections with random items
        if (selectedFilter === 'all') {
          return {
            type: 'all-sections' as const,
            sections: [
              {
                type: 'workflow' as const,
                title: 'Workflows',
                items: randomItems.workflow.slice(0, expandedItems.workflow),
                total: workflows.length,
                expanded: expandedItems.workflow,
              },
              {
                type: 'models' as const,
                title: 'Models',
                items: randomItems.models.slice(0, 8),
                total: modelsData.length,
                expanded: 8,
              },
              {
                type: 'General' as const,
                title: 'Agents',
                items: randomItems.General.slice(0, expandedItems.General),
                total: counts.General,
                expanded: expandedItems.General,
              },
              {
                type: 'RAG' as const,
                title: 'RAG',
                items: randomItems.RAG.slice(0, expandedItems.RAG),
                total: counts.RAG,
                expanded: expandedItems.RAG,
              },
              {
                type: 'Voice Agent' as const,
                title: 'Voice Agent',
                items: randomItems['Voice Agent'].slice(
                  0,
                  expandedItems['Voice Agent'],
                ),
                total: counts['Voice Agent'],
                expanded: expandedItems['Voice Agent'],
              },
              {
                type: 'MCP' as const,
                title: 'MCP',
                items: randomItems.MCP.slice(0, expandedItems.MCP),
                total: counts.MCP,
                expanded: expandedItems.MCP,
              },
              {
                type: 'software' as const,
                title: 'Software',
                items: randomItems.software.slice(0, expandedItems.software),
                total: counts.software,
                expanded: expandedItems.software,
              },
              {
                type: 'template' as const,
                title: 'Templates',
                items: randomItems.template.slice(0, expandedItems.template),
                total: siteTemplates.length,
                expanded: expandedItems.template,
              },
            ],
          };
        }

        // When defaultShowAssistantsAndWorkflows is true, only show workflows in the "all" view
        if (defaultShowAssistantsAndWorkflows) {
          return [
            ...workflows.map((item) => ({
              item,
              type: 'workflow' as const,
            })),
            ...softwareSource.map((item) => ({
              item,
              type: 'software' as const,
            })),
            ...siteTemplates.map((item) => ({
              item,
              type: 'template' as const,
            })),
            ...modelsData.map((item) => ({
              item,
              type: 'ai-model' as const,
            })),
          ];
        }
        // Otherwise combine all items
        return [
          ...Object.values(itemsByType)
            .flat()
            .map((item) => ({
              item,
              type: 'assistant' as const,
            })),
          ...workflows.map((item) => ({
            item,
            type: 'workflow' as const,
          })),
          ...softwareSource.map((item) => ({
            item,
            type: 'software' as const,
          })),
          ...siteTemplates.map((item) => ({
            item,
            type: 'template' as const,
          })),
          ...modelsData.map((item) => ({
            item,
            type: 'ai-model' as const,
          })),
        ];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div ref={sectionRef} className="w-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 xl:max-w-7xl mx-auto">
        {/* Left sidebar with filters */}
        <div className="w-full lg:w-72 lg:shrink-0 space-y-4 lg:space-y-6 lg:sticky lg:top-32 z-40 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto bg-background border-b lg:border-b-0 border-gray-200 dark:border-gray-700 pb-4 lg:pb-0">
          {/* Filter Categories */}
          <div className="space-y-2 lg:space-y-3 pt-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
              Categories
            </h3>

            <div className="h-auto max-h-[300px] w-full overflow-y-auto lg:overflow-y-visible">
              <div className="space-y-1 pr-3 lg:pr-6 w-full">
                {/* All Items */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('all');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                      <div className="size-1.5 lg:size-2 bg-white rounded-full" />
                    </div>
                    <span className="font-medium truncate">All</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.all > 1000 ? '2500+' : counts.all}
                  </Badge>
                </button>

                {/* Workflows */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('workflow');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'workflow'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">W</span>
                    </div>
                    <span className="text-left truncate">Workflows</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.workflow > 500 ? '1000+' : counts.workflow}
                  </Badge>
                </button>

                {/* General */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('General');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'General'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">A</span>
                    </div>
                    <span className="text-left truncate">Agents</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {/* {counts.General > 1000 ? '1500+' : counts.General} */}
                    1500+
                  </Badge>
                </button>

                {/* Models */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('models');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'models'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">Models</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.models > 50 ? '50+' : counts.models}
                  </Badge>
                </button>

                {/* MCP */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('MCP');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'MCP'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">MCP</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {/* {counts.MCP > 50 ? '50+' : counts.MCP} */}
                    20+
                  </Badge>
                </button>

                {/* RAG */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('RAG');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'RAG'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">R</span>
                    </div>
                    <span className="text-left truncate">RAG</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.RAG > 50 ? '50+' : counts.RAG}
                  </Badge>
                </button>

                {/* Voice Agent */}
                {/* <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Voice Agent');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Voice Agent'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">V</span>
                    </div>
                    <span className="text-left truncate">Voice Agent</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Voice Agent'] > 50 ? '50+' : counts['Voice Agent']}
                  </Badge>
                </button> */}

                {/* Software */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('software');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'software'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">S</span>
                    </div>
                    <span className="text-left truncate">Software</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.software > 50 ? '200+' : counts.software}
                  </Badge>
                </button>

                {/* Templates */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('template');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'template'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">T</span>
                    </div>
                    <span className="text-left truncate">Templates</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.template > 50 ? '50+' : counts.template}
                  </Badge>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right content grid */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={selectedFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {/* Handle all-sections view */}
            {selectedFilter === 'all' &&
            typeof filteredItems === 'object' &&
            'sections' in filteredItems ? (
              <div className="space-y-8">
                {/* Editor's Choice Section */}
                {editorsChoiceItems.length > 0 && (
                  <div className="space-y-4">
                    {/* Editor's Choice Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col items-start gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          Editor&apos;s Pick
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Handpicked items from each category
                        </p>
                      </div>
                    </div>

                    {/* Editor's Choice Items Grid (show 4 by default) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {(editorsExpanded
                        ? editorsChoiceItems
                        : editorsChoiceItems.slice(0, 4)
                      ).map((choiceItem, index) => (
                        <motion.div
                          key={`editors-choice-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {choiceItem.type === 'workflow' ? (
                            <WorkflowCard
                              workflow={choiceItem.item as WorkflowType}
                              onClick={() =>
                                onItemClick(choiceItem.item, 'workflow')
                              }
                              onDownload={onDownload}
                            />
                          ) : choiceItem.type === 'software' ? (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 relative overflow-hidden"
                              onClick={() =>
                                onItemClick(choiceItem.item, 'software')
                              }
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center text-lg shadow-sm border border-green-200 dark:border-green-700/50 shrink-0">
                                    {typeof choiceItem.item.icon === 'string' &&
                                    choiceItem.item.icon.startsWith('http') ? (
                                      <Avatar>
                                        <AvatarImage
                                          src={choiceItem.item.icon}
                                          alt={choiceItem.item.name}
                                        />
                                        <AvatarFallback>EP</AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <span className="text-lg">🛠️</span>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {choiceItem.item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      {choiceItem.item.category}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {choiceItem.item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {choiceItem.item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 relative overflow-hidden"
                              onClick={() =>
                                onItemClick(
                                  choiceItem.item,
                                  choiceItem.type as 'assistant' | 'mcp-server',
                                )
                              }
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50 shrink-0">
                                    <AIAgentIcon size={20} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {choiceItem.item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      {choiceItem.item.category}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {choiceItem.item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {choiceItem.item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Editor's Pick controls */}
                    {editorsChoiceItems.length > 4 && (
                      <div className="flex items-center justify-center pt-2 gap-3">
                        {!editorsExpanded ? (
                          <button
                            type="button"
                            onClick={() => setEditorsExpanded(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                          >
                            <span>View More</span>
                            <svg
                              className="size-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setEditorsExpanded(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                            >
                              <span>View Less</span>
                              <svg
                                className="size-4 rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {filteredItems.sections.map((section, sectionIndex) => (
                  <div key={section.type} className="space-y-4">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col items-start gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {section.title === 'General'
                            ? 'Assistants'
                            : section.title === 'software'
                              ? 'Softwares'
                              : section.title === 'template'
                                ? 'Templates'
                                : section.title === 'models'
                                  ? 'Models'
                                  : section.title}
                        </h3>
                        {/* Tags for this section */}
                        {section.items.length > 0 &&
                          section.type !== 'workflow' && (
                            <div className="flex flex-wrap gap-1">
                              {(section.type === 'General'
                                ? fixedAgentTags
                                : Array.from(
                                    new Set(
                                      section.items
                                        .flatMap((item) => item.tags || [])
                                        .slice(0, 3),
                                    ),
                                  )
                              ).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant={
                                    selectedTags[section.type]?.includes(tag)
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className={`text-sm cursor-pointer transition-colors ${
                                    selectedTags[section.type]?.includes(tag)
                                      ? 'bg-purple-300 text-purple-700 capitalize'
                                      : 'bg-background hover:text-purple-700  hover:bg-purple-300 capitalize'
                                  }`}
                                  onClick={() =>
                                    handleTagClick(tag, section.type)
                                  }
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Badge variant="secondary" className="text-sm">
                          {section.title === 'General'
                            ? `8 of 1000+`
                            : `${section.items.length} of ${section.total}`}
                        </Badge>
                      </div>
                    </div>

                    {/* Section Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {(section.type === 'software'
                        ? section.items.slice(0, 20)
                        : section.items
                      ).map((item, index) => (
                        <motion.div
                          key={`${section.type}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          {section.type === 'workflow' ? (
                            <WorkflowCard
                              workflow={item as WorkflowType}
                              onClick={() => onItemClick(item, section.type)}
                              onDownload={onDownload}
                            />
                          ) : section.type === 'software' ? (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                              onClick={() => onItemClick(item, 'software')}
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50 shrink-0">
                                    {/* <span className="text-lg">
                                      {item.icon || '🛠️'}
                                    </span> */}
                                    <Avatar>
                                      <Avatar>
                                        <AvatarImage
                                          src={item.icon}
                                          alt={item.name}
                                        />
                                        <AvatarFallback>SW</AvatarFallback>
                                      </Avatar>
                                    </Avatar>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          ) : section.type === 'template' ? (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                              onClick={() => onItemClick(item, 'template')}
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50 shrink-0">
                                    <span className="text-lg">
                                      {item.icon || '🧩'}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          ) : section.type === 'models' ? (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                              onClick={() => onItemClick(item, 'ai-model')}
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="shrink-0">
                                    {item.icon?.startsWith('http') ? (
                                      <div className="size-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <Avatar>
                                          <AvatarImage
                                            src={item.icon}
                                            alt={item.name}
                                          />
                                          <AvatarFallback>EP</AvatarFallback>
                                        </Avatar>
                                      </div>
                                    ) : (
                                      <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50">
                                        <span className="text-lg">🧠</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      AI Model
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card
                              className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                              onClick={() =>
                                onItemClick(
                                  item,
                                  section.type === 'MCP'
                                    ? 'mcp-server'
                                    : 'assistant',
                                )
                              }
                            >
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50 shrink-0">
                                    <AIAgentIcon size={20} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                  {item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Section Footer */}
                    <div className="flex items-center justify-center pt-4">
                      {section.type === 'software' ? (
                        <button
                          type="button"
                          onClick={() => handleViewMore('software')}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          <span>View More Software</span>
                          <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : section.total > section.expanded ? (
                        <button
                          type="button"
                          onClick={() => handleViewMore(section.type)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          <span>View More {section.title}</span>
                          <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Handle regular filtered items view */
              <div className="space-y-6">
                {/* Section Header with Tags for individual sections */}
                {selectedFilter !== 'all' &&
                  selectedFilter !== 'workflow' &&
                  selectedFilter !== 'software' &&
                  selectedFilter !== 'template' &&
                  selectedFilter !== 'models' && (
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedFilter === 'General'
                            ? 'Agents'
                            : selectedFilter}
                        </h2>
                        <Badge
                          variant="secondary"
                          className="text-sm self-start sm:self-auto"
                        >
                          {Array.isArray(filteredItems)
                            ? filteredItems.length
                            : 0}{' '}
                          of {counts[selectedFilter]}
                        </Badge>
                      </div>

                      {/* Tags for this section */}
                      {Array.isArray(filteredItems) &&
                        filteredItems.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {(selectedFilter === 'General'
                              ? fixedAgentTags
                              : Array.from(
                                  new Set(
                                    filteredItems
                                      .flatMap((item) => item.item.tags || [])
                                      .slice(0, 6),
                                  ),
                                )
                            ).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant={
                                  selectedTags[selectedFilter]?.includes(tag)
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className={`text-sm cursor-pointer transition-colors ${
                                  selectedTags[selectedFilter]?.includes(tag)
                                    ? 'bg-purple-300 text-purple-700 capitalize'
                                    : 'bg-background hover:text-purple-700 hover:bg-purple-300 capitalize'
                                }`}
                                onClick={() =>
                                  handleTagClick(tag, selectedFilter)
                                }
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                {/* Section Header for Software and Templates */}
                {(selectedFilter === 'software' ||
                  selectedFilter === 'template') && (
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedFilter === 'software'
                          ? 'Software'
                          : 'Templates'}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="text-sm self-start sm:self-auto"
                      >
                        {Array.isArray(filteredItems)
                          ? filteredItems.length
                          : 0}{' '}
                        of {counts[selectedFilter]}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Section Header for Models */}
                {selectedFilter === 'models' && (
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Models
                      </h2>
                      <Badge
                        variant="secondary"
                        className="text-sm self-start sm:self-auto"
                      >
                        {Array.isArray(filteredItems)
                          ? filteredItems.length
                          : 0}{' '}
                        of {counts.models}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.isArray(filteredItems) &&
                    (selectedFilter === 'software'
                      ? filteredItems.slice(0, 20)
                      : filteredItems
                    ).map((item, index) => (
                      <motion.div
                        key={`${item.type}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        {item.type === 'workflow' ? (
                          <WorkflowCard
                            workflow={item.item as WorkflowType}
                            onClick={() => onItemClick(item.item, item.type)}
                            onDownload={onDownload}
                          />
                        ) : item.type === 'software' ? (
                          <Card
                            className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                            onClick={() => onItemClick(item.item, 'software')}
                          >
                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center text-lg shadow-sm border border-green-200 dark:border-green-700/50 shrink-0">
                                  <span className="text-lg">
                                    <Avatar>
                                      <AvatarImage
                                        src={item.item.icon}
                                        alt={item.item.name}
                                      />
                                      <AvatarFallback>
                                        <PackageIcon />
                                      </AvatarFallback>
                                    </Avatar>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                    {item.item.name}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                    {item.item.category}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                {item.item.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-auto">
                                {item.item.tags
                                  ?.slice(0, 3)
                                  .map((tag: string, tagIndex: number) => (
                                    <Badge
                                      key={tagIndex}
                                      className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        ) : item.type === 'template' ? (
                          <Card
                            className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                            onClick={() => onItemClick(item.item, 'template')}
                          >
                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50 shrink-0">
                                  <span className="text-lg">
                                    {item.item.icon || '🧩'}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                    {item.item.name}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                    {item.item.category}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                {item.item.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-auto">
                                {item.item.tags
                                  ?.slice(0, 3)
                                  .map((tag: string, tagIndex: number) => (
                                    <Badge
                                      key={tagIndex}
                                      className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        ) : item.type === 'ai-model' ? (
                          <Card
                            className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                            onClick={() => onItemClick(item.item, 'ai-model')}
                          >
                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="shrink-0">
                                  {item.item.icon?.startsWith('http') ? (
                                    <div className="size-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                      <Avatar>
                                        <AvatarImage
                                          src={item.item.icon}
                                          alt={item.item.name}
                                        />
                                        <AvatarFallback>MD</AvatarFallback>
                                      </Avatar>
                                    </div>
                                  ) : (
                                    <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50">
                                      <span className="text-lg">🧠</span>
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                    {item.item.name}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                    AI Model
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                {item.item.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-auto">
                                {item.item.tags
                                  ?.slice(0, 3)
                                  .map((tag: string, tagIndex: number) => (
                                    <Badge
                                      key={tagIndex}
                                      className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card
                            className="h-full cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
                            onClick={() =>
                              onItemClick(
                                item.item,
                                item.type === 'mcp-server'
                                  ? 'mcp-server'
                                  : 'assistant',
                              )
                            }
                          >
                            <CardContent className="p-4 flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50 shrink-0">
                                  <AIAgentIcon size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                    {item.item.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                    {item.item.category}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3 grow">
                                {item.item.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-auto">
                                {item.item.tags
                                  ?.slice(0, 3)
                                  .map((tag: string, tagIndex: number) => (
                                    <Badge
                                      key={tagIndex}
                                      className="text-xs bg-purple-300 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    ))}
                </div>

                {/* View more for Software filter */}
                {selectedFilter === 'software' &&
                  Array.isArray(filteredItems) &&
                  filteredItems.length > 20 && (
                    <div className="flex items-center justify-center pt-4">
                      <button
                        type="button"
                        onClick={() => handleViewMore('software')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        <span>View More Software</span>
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* Empty state */}
            {Array.isArray(filteredItems) && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No {selectedFilter !== 'all' ? `${selectedFilter}s` : 'items'}{' '}
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
