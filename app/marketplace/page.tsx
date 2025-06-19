"use client";

import { AssistantCard } from "@/components/marketplace/assistant-card";
import { DetailDialog } from "@/components/marketplace/detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

// Infer agent type from API
type Agent = {
  name: string;
  url: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
};

type TabType =
  | "home"
  | "assistants"
  | "plugins"
  | "ai-models"
  | "softwares"
  | "templates";

// --- SWR fetcher ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedItem, setSelectedItem] = useState<Agent | null>(null);
  const [dialogType, setDialogType] = useState<"assistant" | "plugin">(
    "assistant"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useSWR<{ agents: Agent[] }>(
    "marketplace/api/agents",
    fetcher as any
  );

  const assistants = useMemo(() => data?.agents ?? [], [data]);

  // You can also fetch plugins, aiModels, softwareTools, siteTemplates from other APIs or constants if desired

  const handleItemClick = (item: Agent, type: "assistant" | "plugin") => {
    setSelectedItem(item);
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleViewMore = (type: "assistants" | "plugins") => {
    setActiveTab(type);
  };

  // Filter items based on search term
  const filteredAssistants = useMemo(
    () =>
      assistants.filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assistant.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assistant.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    [assistants, searchTerm]
  );
  console.log({ assistants });
  if (!mounted) return null;

  return (
    <div className="min-h-screen max-w-sm md:max-w-3xl lg:max-w-full w-full bg-gray-50 dark:bg-black transition-colors duration-200">
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
                {assistants.length} items
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
                    ? "AI"
                    : "Plugins"}
                </span>
                {tab.id === "assistants" && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {assistants.length}
                  </Badge>
                )}
                {/* Plugins, ai-models, softwares, templates can be similarly updated once APIs/data available */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {assistants.slice(0, 4).map((assistant, index) => (
                      <motion.div
                        key={assistant.url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AssistantCard
                          assistant={assistant as any}
                          onClick={() =>
                            handleItemClick(assistant, "assistant")
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </section>
                {/* For plugins, aiModels, etc, add similar sections if you have APIs/constants */}
              </motion.div>
            )}

            {activeTab === "assistants" && !isLoading && (
              <motion.section
                key="assistants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    All Assistants
                  </h2>
                  <Badge
                    variant="secondary"
                    className="self-start sm:self-auto"
                  >
                    {filteredAssistants.length} of {assistants.length}{" "}
                    assistants
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredAssistants.map((assistant, index) => (
                    <motion.div
                      key={assistant.url}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AssistantCard
                        assistant={assistant as any}
                        onClick={() => handleItemClick(assistant, "assistant")}
                      />
                    </motion.div>
                  ))}
                </div>
                {filteredAssistants.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No assistants found matching your search.
                    </p>
                  </div>
                )}
              </motion.section>
            )}
            {/* You can add similar tab content for plugins, aiModels, etc, using their respective APIs/constants */}
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
