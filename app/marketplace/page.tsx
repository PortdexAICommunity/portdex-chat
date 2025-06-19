"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Home,
	Users,
	Puzzle,
	Search,
	Brain,
	PackageOpen,
	FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTypes } from "@/lib/types";
import {
	assistants,
	plugins,
	aiModels,
	softwareTools,
	siteTemplates,
} from "@/lib/constants";
import { AssistantCard } from "@/components/marketplace/assistant-card";
import { PluginCard } from "@/components/marketplace/plugin-card";
import { DetailDialog } from "@/components/marketplace/detail-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

type TabType =
	| "home"
	| "assistants"
	| "plugins"
	| "ai-models"
	| "softwares"
	| "templates";

export default function Marketplace() {
	const [activeTab, setActiveTab] = useState<TabType>("home");
	const [selectedItem, setSelectedItem] = useState<DataTypes | null>(null);
	const [dialogType, setDialogType] = useState<"assistant" | "plugin">(
		"assistant"
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleItemClick = (item: DataTypes, type: "assistant" | "plugin") => {
		setSelectedItem(item);
		setDialogType(type);
		setIsDialogOpen(true);
	};

	const handleViewMore = (type: "assistants" | "plugins") => {
		setActiveTab(type);
	};

	// Filter items based on search term
	const filteredAssistants = assistants.filter(
		(assistant) =>
			assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assistant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assistant.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredPlugins = plugins.filter(
		(plugin) =>
			plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			plugin.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredAiModels = aiModels.filter(
		(aiModel) =>
			aiModel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			aiModel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			aiModel.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredSoftwareTools = softwareTools.filter(
		(softwareTool) =>
			softwareTool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			softwareTool.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			softwareTool.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredSiteTemplates = siteTemplates.filter(
		(siteTemplate) =>
			siteTemplate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			siteTemplate.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			siteTemplate.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (!mounted) {
		return null;
	}

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
									placeholder="Search assistants and plugins..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-64 xl:w-80 bg-white dark:bg-white/10 border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>

						<div className="flex items-center justify-end space-x-2">
							<Badge variant="secondary" className="text-xs">
								{assistants.length + plugins.length} items
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
						placeholder="Search assistants and plugins..."
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
								{tab.id === "plugins" && (
									<Badge variant="secondary" className="ml-1 text-xs">
										{plugins.length}
									</Badge>
								)}
								{tab.id === "ai-models" && (
									<Badge variant="secondary" className="ml-1 text-xs">
										{aiModels.length}
									</Badge>
								)}
								{tab.id === "softwares" && (
									<Badge variant="secondary" className="ml-1 text-xs">
										{softwareTools.length}
									</Badge>
								)}
								{tab.id === "templates" && (
									<Badge variant="secondary" className="ml-1 text-xs">
										{siteTemplates.length}
									</Badge>
								)}
							</motion.button>
						))}
					</div>
				</div>
			</motion.nav>

			{/* Content */}
			<div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="max-w-7xl mx-auto">
					<AnimatePresence mode="wait">
						{activeTab === "home" && (
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
												key={assistant.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.1 }}
											>
												<AssistantCard
													assistant={assistant}
													onClick={() =>
														handleItemClick(assistant, "assistant")
													}
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
											onClick={() => handleViewMore("plugins")}
											className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 self-start sm:self-auto"
										>
											Discover More →
										</Button>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
										{plugins.slice(0, 4).map((plugin, index) => (
											<motion.div
												key={plugin.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.1 }}
											>
												<PluginCard
													plugin={plugin}
													onClick={() => handleItemClick(plugin, "plugin")}
												/>
											</motion.div>
										))}
									</div>
								</section>

								<section>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
										<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
											Featured Models
										</h2>
										<Button
											variant="ghost"
											onClick={() => handleViewMore("plugins")}
											className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 self-start sm:self-auto"
										>
											Discover More →
										</Button>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
										{aiModels.slice(0, 4).map((model, index) => (
											<motion.div
												key={model.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.1 }}
											>
												<PluginCard
													plugin={model}
													onClick={() => handleItemClick(model, "plugin")}
												/>
											</motion.div>
										))}
									</div>
								</section>
							</motion.div>
						)}

						{activeTab === "assistants" && (
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
											key={assistant.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<AssistantCard
												assistant={assistant}
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

						{activeTab === "plugins" && (
							<motion.section
								key="plugins"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
										All Plugins
									</h2>
									<Badge
										variant="secondary"
										className="self-start sm:self-auto"
									>
										{filteredPlugins.length} of {plugins.length} plugins
									</Badge>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
									{filteredPlugins.map((plugin, index) => (
										<motion.div
											key={plugin.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<PluginCard
												plugin={plugin}
												onClick={() => handleItemClick(plugin, "plugin")}
											/>
										</motion.div>
									))}
								</div>
								{filteredPlugins.length === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 dark:text-gray-400">
											No plugins found matching your search.
										</p>
									</div>
								)}
							</motion.section>
						)}

						{activeTab === "ai-models" && (
							<motion.section
								key="plugins"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
										All Models
									</h2>
									<Badge
										variant="secondary"
										className="self-start sm:self-auto"
									>
										{filteredAiModels.length} of {aiModels.length} Models
									</Badge>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
									{filteredAiModels.map((model, index) => (
										<motion.div
											key={model.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<AssistantCard
												assistant={model}
												onClick={() => handleItemClick(model, "assistant")}
											/>
										</motion.div>
									))}
								</div>
								{filteredAiModels.length === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 dark:text-gray-400">
											No plugins found matching your search.
										</p>
									</div>
								)}
							</motion.section>
						)}

						{activeTab === "softwares" && (
							<motion.section
								key="plugins"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
										All Softwares
									</h2>
									<Badge
										variant="secondary"
										className="self-start sm:self-auto"
									>
										{filteredSoftwareTools.length} of {softwareTools.length}{" "}
										Softwares
									</Badge>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
									{filteredSoftwareTools.map((software, index) => (
										<motion.div
											key={software.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<AssistantCard
												assistant={software}
												onClick={() => handleItemClick(software, "assistant")}
											/>
										</motion.div>
									))}
								</div>
								{filteredSoftwareTools.length === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 dark:text-gray-400">
											No plugins found matching your search.
										</p>
									</div>
								)}
							</motion.section>
						)}

						{activeTab === "templates" && (
							<motion.section
								key="plugins"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
										All Templates
									</h2>
									<Badge
										variant="secondary"
										className="self-start sm:self-auto"
									>
										{filteredSiteTemplates.length} of {siteTemplates.length}{" "}
										Templates
									</Badge>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
									{filteredSiteTemplates.map((template, index) => (
										<motion.div
											key={template.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<AssistantCard
												assistant={template}
												onClick={() => handleItemClick(template, "assistant")}
											/>
										</motion.div>
									))}
								</div>
								{filteredSiteTemplates.length === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 dark:text-gray-400">
											No plugins found matching your search.
										</p>
									</div>
								)}
							</motion.section>
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
