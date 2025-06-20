"use client";

// Example component showing how to use the new reusable marketplace functionality
import React, { useState } from "react";
import { useMarketplace } from "@/hooks/use-marketplace";
import {
	useMarketplaceFilters,
	useLoadMore,
} from "@/hooks/use-marketplace-filters";
import { AgentGrid, AgentGridPresets } from "./agent-grid";
import { MarketplaceSearch } from "./marketplace-search";
import { DetailDialog } from "./detail-dialog";
import type { Agent } from "@/lib/types";

// Example 1: Featured Agents Component (for home page or dashboard)
export function FeaturedAgents({ maxItems = 8 }: { maxItems?: number }) {
	const { agents, isLoading } = useMarketplace();
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const featuredAgents = agents.slice(0, maxItems);

	const handleAgentClick = (agent: Agent) => {
		setSelectedAgent(agent);
		setIsDialogOpen(true);
	};

	return (
		<>
			<AgentGrid
				agents={featuredAgents}
				title="Featured AI Agents"
				onAgentClick={handleAgentClick}
				isLoading={isLoading}
				{...AgentGridPresets.featured}
			/>

			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedAgent}
				type="assistant"
			/>
		</>
	);
}

// Example 2: Searchable Agents List (for dedicated listing pages)
export function SearchableAgentsList() {
	const { agents, isLoading } = useMarketplace();
	const {
		paginatedItems,
		searchTerm,
		setSearchTerm,
		currentPage,
		setCurrentPage,
		hasMoreItems,
		totalItems,
	} = useMarketplaceFilters(agents);

	const { isLoadingMore, loadMore } = useLoadMore();
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleAgentClick = (agent: Agent) => {
		setSelectedAgent(agent);
		setIsDialogOpen(true);
	};

	const handleLoadMore = () => {
		loadMore(currentPage, setCurrentPage, hasMoreItems);
	};

	return (
		<div className="space-y-6">
			{/* Search */}
			<MarketplaceSearch
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				placeholder="Search AI agents..."
			/>

			{/* Results */}
			<AgentGrid
				agents={paginatedItems}
				title="All AI Agents"
				totalCount={totalItems}
				isLoading={isLoading || isLoadingMore}
				hasMoreItems={hasMoreItems}
				onLoadMore={handleLoadMore}
				onAgentClick={handleAgentClick}
				{...AgentGridPresets.listing}
			/>

			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedAgent}
				type="assistant"
			/>
		</div>
	);
}

// Example 3: Category-specific Agents (for category pages)
export function CategoryAgents({ category }: { category: string }) {
	const { agents, isLoading } = useMarketplace();
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const categoryAgents = agents.filter(
		(agent) => agent.category === category || agent.tags?.includes(category)
	);

	const handleAgentClick = (agent: Agent) => {
		setSelectedAgent(agent);
		setIsDialogOpen(true);
	};

	return (
		<>
			<AgentGrid
				agents={categoryAgents}
				title={`${category} Agents`}
				onAgentClick={handleAgentClick}
				isLoading={isLoading}
				{...AgentGridPresets.related}
			/>

			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedAgent}
				type="assistant"
			/>
		</>
	);
}

// Example 4: Compact Agent List (for sidebars or small spaces)
export function CompactAgentList({ maxItems = 6 }: { maxItems?: number }) {
	const { agents, isLoading } = useMarketplace();
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const compactAgents = agents.slice(0, maxItems);

	const handleAgentClick = (agent: Agent) => {
		setSelectedAgent(agent);
		setIsDialogOpen(true);
	};

	return (
		<>
			<AgentGrid
				agents={compactAgents}
				onAgentClick={handleAgentClick}
				isLoading={isLoading}
				{...AgentGridPresets.compact}
				className="space-y-4"
			/>

			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedAgent}
				type="assistant"
			/>
		</>
	);
}

// Example 5: Mobile-optimized Search
export function MobileAgentSearch() {
	const { agents, isLoading } = useMarketplace();
	const { paginatedItems, searchTerm, setSearchTerm, totalItems } =
		useMarketplaceFilters(agents);

	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleAgentClick = (agent: Agent) => {
		setSelectedAgent(agent);
		setIsDialogOpen(true);
	};

	return (
		<div className="lg:hidden space-y-4">
			{/* Mobile Search */}
			<div className="bg-white dark:bg-black border-b border-border px-4 py-3">
				<MarketplaceSearch
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					variant="mobile"
					placeholder="Search agents..."
				/>
			</div>

			{/* Mobile Results */}
			<div className="px-4">
				<AgentGrid
					agents={paginatedItems}
					totalCount={totalItems}
					isLoading={isLoading}
					onAgentClick={handleAgentClick}
					gridCols="grid-cols-1 sm:grid-cols-2"
					enableAnimation={false}
				/>
			</div>

			<DetailDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				item={selectedAgent}
				type="assistant"
			/>
		</div>
	);
}
