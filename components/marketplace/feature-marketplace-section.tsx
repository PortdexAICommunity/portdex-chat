'use client';

import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { WorkflowCard } from './workflow-card';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import type { WorkflowType } from '@/lib/types';

// Import llm-apps data
import llmAppsData from '@/lib/llm-apps.json';

type FilterType =
  | 'all'
  | 'Starter AI Agents'
  | 'Advanced AI Agents'
  | 'Game Playing Agents'
  | 'Multi-agent Teams'
  | 'Voice AI Agents'
  | 'MCP AI Agents'
  | 'RAG Tutorials'
  | 'Memory Tutorials'
  | 'Chat Tutorials'
  | 'workflow';

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
}

export function FeaturedMarketplaceSection({
  workflows,
  onItemClick,
  onDownload,
  title = 'Featured Items',
  defaultShowAssistantsAndWorkflows = false,
}: FeaturedItemsProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      const offsetTop = sectionRef.current.offsetTop - 100; // Adjust offset as needed
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // State for managing random items and load more functionality
  const [expandedItems, setExpandedItems] = useState<Record<string, number>>({
    'Starter AI Agents': 6,
    'Advanced AI Agents': 6,
    'Game Playing Agents': 6,
    'Multi-agent Teams': 6,
    'Voice AI Agents': 6,
    'MCP AI Agents': 6,
    'RAG Tutorials': 6,
    'Memory Tutorials': 6,
    'Chat Tutorials': 6,
    workflow: 6,
  });

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

  // Memoized random items for each category
  const randomItems = useMemo(
    () => ({
      'Starter AI Agents': getRandomItems(
        categoryItems['Starter AI Agents'] || [],
        Math.max(expandedItems['Starter AI Agents'], 6),
        'Starter AI Agents',
      ),
      'Advanced AI Agents': getRandomItems(
        categoryItems['Advanced AI Agents'] || [],
        Math.max(expandedItems['Advanced AI Agents'], 6),
        'Advanced AI Agents',
      ),
      'Game Playing Agents': getRandomItems(
        categoryItems['Game Playing Agents'] || [],
        Math.max(expandedItems['Game Playing Agents'], 6),
        'Game Playing Agents',
      ),
      'Multi-agent Teams': getRandomItems(
        categoryItems['Multi-agent Teams'] || [],
        Math.max(expandedItems['Multi-agent Teams'], 6),
        'Multi-agent Teams',
      ),
      'Voice AI Agents': getRandomItems(
        categoryItems['Voice AI Agents'] || [],
        Math.max(expandedItems['Voice AI Agents'], 6),
        'Voice AI Agents',
      ),
      'MCP AI Agents': getRandomItems(
        categoryItems['MCP AI Agents'] || [],
        Math.max(expandedItems['MCP AI Agents'], 6),
        'MCP AI Agents',
      ),
      'RAG Tutorials': getRandomItems(
        categoryItems['RAG Tutorials'] || [],
        Math.max(expandedItems['RAG Tutorials'], 6),
        'RAG Tutorials',
      ),
      'Memory Tutorials': getRandomItems(
        categoryItems['Memory Tutorials'] || [],
        Math.max(expandedItems['Memory Tutorials'], 6),
        'Memory Tutorials',
      ),
      'Chat Tutorials': getRandomItems(
        categoryItems['Chat Tutorials'] || [],
        Math.max(expandedItems['Chat Tutorials'], 6),
        'Chat Tutorials',
      ),
      workflow: getRandomItems(
        workflows,
        Math.max(expandedItems.workflow, 6),
        'workflow',
      ),
    }),
    [categoryItems, workflows, expandedItems],
  );

  // Function to handle load more for a specific type
  const handleLoadMore = (type: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [type]: prev[type] + 15,
    }));
  };

  // Function to handle view more (switch to specific type)
  const handleViewMore = (type: FilterType) => {
    setSelectedFilter(type);
    setExpandedItems((prev) => ({
      ...prev,
      [type]: 6, // Reset to initial count when switching
    }));
    scrollToSection();
  };

  // Count items for each category
  const counts = {
    all: defaultShowAssistantsAndWorkflows
      ? workflows.length +
        Object.values(categoryItems).reduce(
          (acc, items) => acc + items.length,
          0,
        )
      : workflows.length +
        Object.values(categoryItems).reduce(
          (acc, items) => acc + items.length,
          0,
        ),
    'Starter AI Agents': categoryItems['Starter AI Agents']?.length || 0,
    'Advanced AI Agents': categoryItems['Advanced AI Agents']?.length || 0,
    'Game Playing Agents': categoryItems['Game Playing Agents']?.length || 0,
    'Multi-agent Teams': categoryItems['Multi-agent Teams']?.length || 0,
    'Voice AI Agents': categoryItems['Voice AI Agents']?.length || 0,
    'MCP AI Agents': categoryItems['MCP AI Agents']?.length || 0,
    'RAG Tutorials': categoryItems['RAG Tutorials']?.length || 0,
    'Memory Tutorials': categoryItems['Memory Tutorials']?.length || 0,
    'Chat Tutorials': categoryItems['Chat Tutorials']?.length || 0,
    workflow: workflows.length,
  };

  // Filter items based on selected filter
  const getFilteredItems = () => {
    switch (selectedFilter) {
      case 'Starter AI Agents':
        return (categoryItems['Starter AI Agents'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Advanced AI Agents':
        return (categoryItems['Advanced AI Agents'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Game Playing Agents':
        return (categoryItems['Game Playing Agents'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Multi-agent Teams':
        return (categoryItems['Multi-agent Teams'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Voice AI Agents':
        return (categoryItems['Voice AI Agents'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'MCP AI Agents':
        return (categoryItems['MCP AI Agents'] || []).map((item) => ({
          item,
          type: 'mcp-server' as const,
        }));
      case 'RAG Tutorials':
        return (categoryItems['RAG Tutorials'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Memory Tutorials':
        return (categoryItems['Memory Tutorials'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'Chat Tutorials':
        return (categoryItems['Chat Tutorials'] || []).map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'workflow':
        return workflows.map((item) => ({
          item,
          type: 'workflow' as const,
        }));
      default:
        // When "all" is selected, return sections with random items
        if (selectedFilter === 'all') {
          return {
            type: 'all-sections' as const,
            sections: [
              {
                type: 'Starter AI Agents' as const,
                title: 'Starter AI Agents',
                items: randomItems['Starter AI Agents'].slice(
                  0,
                  expandedItems['Starter AI Agents'],
                ),
                total: counts['Starter AI Agents'],
                expanded: expandedItems['Starter AI Agents'],
              },
              {
                type: 'Advanced AI Agents' as const,
                title: 'Advanced AI Agents',
                items: randomItems['Advanced AI Agents'].slice(
                  0,
                  expandedItems['Advanced AI Agents'],
                ),
                total: counts['Advanced AI Agents'],
                expanded: expandedItems['Advanced AI Agents'],
              },
              {
                type: 'Game Playing Agents' as const,
                title: 'Game Playing Agents',
                items: randomItems['Game Playing Agents'].slice(
                  0,
                  expandedItems['Game Playing Agents'],
                ),
                total: counts['Game Playing Agents'],
                expanded: expandedItems['Game Playing Agents'],
              },
              {
                type: 'Multi-agent Teams' as const,
                title: 'Multi-agent Teams',
                items: randomItems['Multi-agent Teams'].slice(
                  0,
                  expandedItems['Multi-agent Teams'],
                ),
                total: counts['Multi-agent Teams'],
                expanded: expandedItems['Multi-agent Teams'],
              },
              {
                type: 'Voice AI Agents' as const,
                title: 'Voice AI Agents',
                items: randomItems['Voice AI Agents'].slice(
                  0,
                  expandedItems['Voice AI Agents'],
                ),
                total: counts['Voice AI Agents'],
                expanded: expandedItems['Voice AI Agents'],
              },
              {
                type: 'MCP AI Agents' as const,
                title: 'MCP AI Agents',
                items: randomItems['MCP AI Agents'].slice(
                  0,
                  expandedItems['MCP AI Agents'],
                ),
                total: counts['MCP AI Agents'],
                expanded: expandedItems['MCP AI Agents'],
              },
              {
                type: 'RAG Tutorials' as const,
                title: 'RAG Tutorials',
                items: randomItems['RAG Tutorials'].slice(
                  0,
                  expandedItems['RAG Tutorials'],
                ),
                total: counts['RAG Tutorials'],
                expanded: expandedItems['RAG Tutorials'],
              },
              {
                type: 'Memory Tutorials' as const,
                title: 'Memory Tutorials',
                items: randomItems['Memory Tutorials'].slice(
                  0,
                  expandedItems['Memory Tutorials'],
                ),
                total: counts['Memory Tutorials'],
                expanded: expandedItems['Memory Tutorials'],
              },
              {
                type: 'Chat Tutorials' as const,
                title: 'Chat Tutorials',
                items: randomItems['Chat Tutorials'].slice(
                  0,
                  expandedItems['Chat Tutorials'],
                ),
                total: counts['Chat Tutorials'],
                expanded: expandedItems['Chat Tutorials'],
              },
              {
                type: 'workflow' as const,
                title: 'Workflows',
                items: randomItems.workflow.slice(0, expandedItems.workflow),
                total: workflows.length,
                expanded: expandedItems.workflow,
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
          ];
        }
        // Otherwise combine all items
        return [
          ...Object.values(categoryItems)
            .flat()
            .map((item) => ({
              item,
              type: 'assistant' as const,
            })),
          ...workflows.map((item) => ({
            item,
            type: 'workflow' as const,
          })),
        ];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div ref={sectionRef} className="w-full">
      <div className="flex gap-6 lg:gap-8">
        {/* Left sidebar with filters */}
        <div className="w-72 shrink-0 space-y-4 lg:space-y-6 sticky top-32 z-40 h-[calc(100vh-9rem)] overflow-y-auto bg-background">
          {/* Filter Categories */}
          <div className="space-y-2 lg:space-y-3 pt-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
              Filter By
            </h3>

            <div className="h-auto max-h-[300px] w-full">
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
                    {counts.all > 1000 ? '1k+' : counts.all}
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
                    {counts.workflow > 500 ? '1k+' : counts.workflow}
                  </Badge>
                </button>

                {/* Starter AI Agents */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Starter AI Agents');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Starter AI Agents'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">S</span>
                    </div>
                    <span className="text-left truncate">
                      Starter AI Agents
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Starter AI Agents'] > 50
                      ? '50+'
                      : counts['Starter AI Agents']}
                  </Badge>
                </button>

                {/* Advanced AI Agents */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Advanced AI Agents');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Advanced AI Agents'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">A</span>
                    </div>
                    <span className="text-left truncate">
                      Advanced AI Agents
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Advanced AI Agents'] > 50
                      ? '50+'
                      : counts['Advanced AI Agents']}
                  </Badge>
                </button>

                {/* Game Playing Agents */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Game Playing Agents');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Game Playing Agents'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">G</span>
                    </div>
                    <span className="text-left truncate">
                      Game Playing Agents
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Game Playing Agents'] > 50
                      ? '50+'
                      : counts['Game Playing Agents']}
                  </Badge>
                </button>

                {/* Multi-agent Teams */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Multi-agent Teams');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Multi-agent Teams'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">
                      Multi-agent Teams
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Multi-agent Teams'] > 50
                      ? '50+'
                      : counts['Multi-agent Teams']}
                  </Badge>
                </button>

                {/* Voice AI Agents */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Voice AI Agents');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Voice AI Agents'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">V</span>
                    </div>
                    <span className="text-left truncate">Voice AI Agents</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Voice AI Agents'] > 50
                      ? '50+'
                      : counts['Voice AI Agents']}
                  </Badge>
                </button>

                {/* MCP AI Agents */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('MCP AI Agents');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'MCP AI Agents'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">MCP AI Agents</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['MCP AI Agents'] > 50
                      ? '50+'
                      : counts['MCP AI Agents']}
                  </Badge>
                </button>

                {/* RAG Tutorials */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('RAG Tutorials');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'RAG Tutorials'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">R</span>
                    </div>
                    <span className="text-left truncate">RAG Tutorials</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['RAG Tutorials'] > 50
                      ? '50+'
                      : counts['RAG Tutorials']}
                  </Badge>
                </button>

                {/* Memory Tutorials */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Memory Tutorials');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Memory Tutorials'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">Memory Tutorials</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Memory Tutorials'] > 50
                      ? '50+'
                      : counts['Memory Tutorials']}
                  </Badge>
                </button>

                {/* Chat Tutorials */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('Chat Tutorials');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'Chat Tutorials'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">C</span>
                    </div>
                    <span className="text-left truncate">Chat Tutorials</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['Chat Tutorials'] > 50
                      ? '50+'
                      : counts['Chat Tutorials']}
                  </Badge>
                </button>
              </div>
            </div>
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
            {/* Handle all-sections view */}
            {selectedFilter === 'all' &&
            typeof filteredItems === 'object' &&
            'sections' in filteredItems ? (
              <div className="space-y-8">
                {filteredItems.sections.map((section, sectionIndex) => (
                  <div key={section.type} className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      <Badge variant="secondary" className="text-sm">
                        {section.items.length} of {section.total}
                      </Badge>
                    </div>

                    {/* Section Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {section.items.map((item, index) => (
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
                          ) : (
                            <Card
                              className="h-full cursor-pointer"
                              onClick={() => onItemClick(item, 'assistant')}
                            >
                              {/* <CardContent className="p-4">
                                <div className="flex items-start gap-3 h-full">
                                  <div className="flex flex-col justify-between gap-2 h-full">
                                    <div className="flex items-start gap-4">
                                      <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50">
                                        🤖
                                      </div>
                                      <div className="flex flex-col justify-start">
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                          {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                          {item.category}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                      {item.description}
                                    </p>
                                    <div className="flex flex-wrap w-full gap-1 mt-2">
                                      {item.tags
                                        ?.slice(0, 3)
                                        .map(
                                          (tag: string, tagIndex: number) => (
                                            <Badge
                                              key={tagIndex}
                                              variant="outline"
                                              className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
                                            >
                                              {tag}
                                            </Badge>
                                          ),
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent> */}
                              <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50 shrink-0">
                                    🤖
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
                      {section.expanded >= 26 ? (
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
                      ) : section.total > section.expanded ? (
                        <button
                          type="button"
                          onClick={() => handleLoadMore(section.type)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          <span>Load More</span>
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
                              d="M19 9l-7 7-7-7"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.isArray(filteredItems) &&
                  filteredItems.map((item, index) => (
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
                      ) : (
                        <Card
                          className="h-full cursor-pointer"
                          onClick={() => onItemClick(item.item, 'assistant')}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-lg shadow-sm border border-blue-200 dark:border-blue-700/50">
                                  🤖
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                  {item.item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                  {item.item.category}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                  {item.item.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.item.tags
                                    ?.slice(0, 3)
                                    .map((tag: string, tagIndex: number) => (
                                      <Badge
                                        key={tagIndex}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
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
