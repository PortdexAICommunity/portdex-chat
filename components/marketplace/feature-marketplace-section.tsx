'use client';

import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { AIModelCard } from './ai-model-card';
import { AssistantCard } from './assistant-card';
import { MCPServerCard } from './mcp-server-card';
import { WorkflowCard } from './workflow-card';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type {
  DataTypes,
  MCPServerType,
  SoftwareType,
  TemplateType,
  WorkflowType,
} from '@/lib/types';

type FilterType =
  | 'all'
  | 'assistant'
  | 'ai-model'
  | 'mcp-server'
  | 'workflow'
  | 'software'
  | 'template';

interface FeaturedItemsProps {
  assistants: DataTypes[];
  aiModels: DataTypes[];
  mcpServers: MCPServerType[];
  workflows: WorkflowType[];
  software: SoftwareType[];
  templates: TemplateType[];
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
  title?: string;
  defaultShowAssistantsAndWorkflows?: boolean;
}

export function FeaturedMarketplaceSection({
  assistants,
  aiModels,
  mcpServers,
  workflows,
  software,
  templates,
  onItemClick,
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
    assistant: 6,
    'ai-model': 6,
    'mcp-server': 6,
    workflow: 6,
    software: 6,
    template: 6,
  });

  // Function to get random items from an array (consistent based on array length)
  const getRandomItems = (items: any[], count: number, seed?: string) => {
    if (items.length === 0) return [];
    if (items.length <= count) return items;

    // Use a simple hash for consistent randomness
    const hash = seed || items.length.toString();
    const shuffled = [...items].sort((a, b) => {
      const aHash = hash + a.id + a.name;
      const bHash = hash + b.id + b.name;
      return aHash.localeCompare(bHash);
    });
    return shuffled.slice(0, count);
  };

  // Memoized random items for each type
  const randomItems = useMemo(
    () => ({
      assistant: getRandomItems(
        assistants,
        Math.max(expandedItems.assistant, 6),
        'assistant',
      ),
      'ai-model': getRandomItems(
        aiModels,
        Math.max(expandedItems['ai-model'], 6),
        'ai-model',
      ),
      workflow: getRandomItems(
        workflows,
        Math.max(expandedItems.workflow, 6),
        'workflow',
      ),
      'mcp-server': getRandomItems(
        mcpServers,
        Math.max(expandedItems['mcp-server'], 6),
        'mcp-server',
      ),
      software: getRandomItems(
        software,
        Math.max(expandedItems.software, 6),
        'software',
      ),
      template: getRandomItems(
        templates,
        Math.max(expandedItems.template, 6),
        'template',
      ),
    }),
    [
      assistants,
      aiModels,
      mcpServers,
      workflows,
      software,
      templates,
      expandedItems,
    ],
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
    // window.scrollTo({ top: 20, behavior: 'smooth' });
  };

  // Count items for each category
  const counts = {
    all: defaultShowAssistantsAndWorkflows
      ? assistants.length + workflows.length
      : assistants.length +
        aiModels.length +
        mcpServers.length +
        workflows.length +
        software.length +
        templates.length,
    assistant: assistants.length,
    'ai-model': aiModels.length,
    'mcp-server': mcpServers.length,
    workflow: workflows.length,
    software: software.length,
    template: templates.length,
  };

  // Filter items based on selected filter
  const getFilteredItems = () => {
    switch (selectedFilter) {
      case 'assistant':
        return assistants.map((item) => ({
          item,
          type: 'assistant' as const,
        }));
      case 'ai-model':
        return aiModels.map((item) => ({
          item,
          type: 'ai-model' as const,
        }));
      case 'mcp-server':
        return mcpServers.map((item) => ({
          item,
          type: 'mcp-server' as const,
        }));
      case 'workflow':
        return workflows.map((item) => ({
          item,
          type: 'workflow' as const,
        }));
      case 'software':
        return software.map((item) => ({
          item,
          type: 'software' as const,
        }));
      case 'template':
        return templates.map((item) => ({
          item,
          type: 'template' as const,
        }));
      default:
        // When "all" is selected, return sections with random items
        if (selectedFilter === 'all') {
          return {
            type: 'all-sections' as const,
            sections: [
              {
                type: 'assistant' as const,
                title: 'Assistants',
                items: randomItems.assistant.slice(0, expandedItems.assistant),
                total: assistants.length,
                expanded: expandedItems.assistant,
              },
              {
                type: 'ai-model' as const,
                title: 'AI Models',
                items: randomItems['ai-model'].slice(
                  0,
                  expandedItems['ai-model'],
                ),
                total: aiModels.length,
                expanded: expandedItems['ai-model'],
              },
              {
                type: 'mcp-server' as const,
                title: 'MCP Servers',
                items: randomItems['mcp-server'].slice(
                  0,
                  expandedItems['mcp-server'],
                ),
                total: mcpServers.length,
                expanded: expandedItems['mcp-server'],
              },
              {
                type: 'workflow' as const,
                title: 'Workflows',
                items: randomItems.workflow.slice(0, expandedItems.workflow),
                total: workflows.length,
                expanded: expandedItems.workflow,
              },
              {
                type: 'software' as const,
                title: 'Software',
                items: randomItems.software.slice(0, expandedItems.software),
                total: software.length,
                expanded: expandedItems.software,
              },
              {
                type: 'template' as const,
                title: 'Templates',
                items: randomItems.template.slice(0, expandedItems.template),
                total: templates.length,
                expanded: expandedItems.template,
              },
            ],
          };
        }

        // When defaultShowAssistantsAndWorkflows is true, only show assistants and workflows in the "all" view
        if (defaultShowAssistantsAndWorkflows) {
          return [
            ...assistants.map((item) => ({
              item,
              type: 'assistant' as const,
            })),
            ...workflows.map((item) => ({
              item,
              type: 'workflow' as const,
            })),
          ];
        }
        // Otherwise combine all items
        return [
          ...assistants.map((item) => ({
            item,
            type: 'assistant' as const,
          })),
          ...aiModels.map((item) => ({
            item,
            type: 'ai-model' as const,
          })),
          ...mcpServers.map((item) => ({
            item,
            type: 'mcp-server' as const,
          })),
          ...workflows.map((item) => ({
            item,
            type: 'workflow' as const,
          })),
          ...software.map((item) => ({
            item,
            type: 'software' as const,
          })),
          ...templates.map((item) => ({
            item,
            type: 'template' as const,
          })),
        ];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div ref={sectionRef} className="w-full">
      <div className="flex gap-6 lg:gap-8">
        {/* Left sidebar with filters */}
        <div className="w-72 shrink-0 space-y-4 lg:space-y-6 sticky top-20 z-40 h-[calc(100vh-7rem)] overflow-y-auto bg-background">
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

                {/* Assistants */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('assistant');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'assistant'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">A</span>
                    </div>
                    <span className="text-left truncate">Assistants</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.assistant > 500 ? '1k+' : counts.assistant}
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

                {/* AI Models */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('ai-model');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'ai-model'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">M</span>
                    </div>
                    <span className="text-left truncate">AI Models</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['ai-model'] > 50 ? '50+' : counts['ai-model']}
                  </Badge>
                </button>

                {/* MCP Servers */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('mcp-server');
                    scrollToSection();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 lg:py-3 text-sm rounded-lg transition-colors ${
                    selectedFilter === 'mcp-server'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">S</span>
                    </div>
                    <span className="text-left truncate">MCP Servers</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts['mcp-server'] > 50 ? '50+' : counts['mcp-server']}
                  </Badge>
                </button>

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
                    <div className="size-5 lg:size-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0">
                      <span className="text-xs text-white font-medium">S</span>
                    </div>
                    <span className="text-left truncate">Software</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {counts.software > 50 ? '50+' : counts.software}
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
                          {section.type === 'assistant' ? (
                            <AssistantCard
                              assistant={item}
                              onClick={() => onItemClick(item, section.type)}
                            />
                          ) : section.type === 'workflow' ? (
                            <WorkflowCard
                              workflow={item as WorkflowType}
                              onClick={() => onItemClick(item, section.type)}
                            />
                          ) : section.type === 'ai-model' ? (
                            <AIModelCard
                              aiModel={item}
                              onClick={() => onItemClick(item, section.type)}
                            />
                          ) : section.type === 'mcp-server' ? (
                            <MCPServerCard
                              server={{
                                id: item.name || String(index),
                                name: item.name,
                                creator: 'Admin',
                                description: item.description,
                                category: item.category,
                                icon: '',
                                url: item.url,
                                official: item.official,
                                languages: item.languages,
                                scope: item.scope,
                                operating_systems: item.operating_systems,
                              }}
                              onClick={() => onItemClick(item, section.type)}
                            />
                          ) : section.type === 'software' ? (
                            <Card
                              className="h-full cursor-pointer"
                              onClick={() => onItemClick(item, section.type)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0">
                                    <div className="size-10 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center text-lg shadow-sm border border-red-200 dark:border-red-700/50">
                                      {item.icon || '💻'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      @{item.creator}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : section.type === 'template' ? (
                            <Card
                              className="h-full cursor-pointer"
                              onClick={() => onItemClick(item, section.type)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0">
                                    <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50">
                                      {item.icon || '🎨'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                      @{item.creator}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : null}
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
                      {item.type === 'assistant' ? (
                        <AssistantCard
                          assistant={item.item}
                          onClick={() => onItemClick(item.item, item.type)}
                        />
                      ) : item.type === 'ai-model' ? (
                        <AIModelCard
                          aiModel={item.item}
                          onClick={() => onItemClick(item.item, item.type)}
                        />
                      ) : item.type === 'mcp-server' ? (
                        <MCPServerCard
                          server={{
                            id: item.item.name || String(index),
                            name: item.item.name,
                            creator: 'Admin',
                            description: item.item.description,
                            category: item.item.category,
                            icon: '',
                            url: item.item.url,
                            official: item.item.official,
                            languages: item.item.languages,
                            scope: item.item.scope,
                            operating_systems: item.item.operating_systems,
                          }}
                          onClick={() => onItemClick(item.item, item.type)}
                        />
                      ) : item.type === 'workflow' ? (
                        <WorkflowCard
                          workflow={item.item as WorkflowType}
                          onClick={() => onItemClick(item.item, item.type)}
                        />
                      ) : item.type === 'software' ? (
                        <Card
                          className="h-full cursor-pointer"
                          onClick={() => onItemClick(item.item, item.type)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center text-lg shadow-sm border border-red-200 dark:border-red-700/50">
                                  {item.item.icon || '💻'}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                  {item.item.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                  @{item.item.creator}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                  {item.item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : item.type === 'template' ? (
                        <Card
                          className="h-full cursor-pointer"
                          onClick={() => onItemClick(item.item, item.type)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                <div className="size-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center text-lg shadow-sm border border-purple-200 dark:border-purple-700/50">
                                  {item.item.icon || '🎨'}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 line-clamp-1">
                                  {item.item.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium line-clamp-1">
                                  @{item.item.creator}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                                  {item.item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null}
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
