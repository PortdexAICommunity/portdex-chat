export type DataPart = { type: "append-message"; message: string };

export interface MarketplaceItem {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
}

export interface DataTypes {
	id: string;
	name: string;
	creator: string;
	description: string;
	category: string;
	subcategory?: string;
	useCase?: string;
	icon: string;
	gradient?: string;
	date?: string;
	url?: string;
	tags?: string[];
}

export type MCPDataTypes = DataTypes & {
	url: string;
	official: boolean;
	languages: string[];
	scope: string[];
	operating_systems: string[];
};

export type MCPServerType = {
	name: string;
	url: string;
	description: string;
	category: string;
	official: boolean;
	languages: string[];
	scope: string[];
	operating_systems: string[];
};

export type Assistant = {
	name: string;
	category: string;
	gradient: string;
	icon: string;
	creator: string;
	date: string;
	description: string;
};

/**
 * WorkflowType - Represents a workflow in the marketplace
 * Designed to work with N8N workflow files from S3 storage
 * Metadata is intelligently extracted from N8N workflow structure
 */
export type WorkflowType = {
	/** Unique identifier (derived from filename) */
	id: string;
	/** Display name (from N8N workflow.name or derived from filename) */
	name: string;
	/** Generated description based on N8N nodes and workflow content */
	description: string;
	/** Auto-categorized based on N8N node types (e.g., "Email Marketing", "AI Automation") */
	category: string;
	/** Emoji icon based on category and workflow content */
	icon: string;
	/** Creator name (from N8N metadata or "N8N Community") */
	creator: string;
	/** Date from S3 file LastModified */
	date: string;
	/** Download endpoint URL */
	downloadUrl: string;
	/** File size in human-readable format */
	fileSize?: string;
	/** File type (e.g., "N8N Workflow") */
	fileType?: string;
	/** Generated tags from N8N nodes and workflow content */
	tags?: string[];
};

export type Plugin = {
	name: string;
	category: string;
	icon: string;
	creator: string;
	description: string;
};

export type HomeMarketplaceItem = {
	id: string;
	title: string;
	description: string;
	category: string;
	icon: string;
	gradient: string;
	date: string;
	type: "plugin" | "assistant" | "ai-model" | "software" | "template";
	creator: string;
	mcp_url?: string;
	systemPrompt?: string;
	useCases?: string[];
};
