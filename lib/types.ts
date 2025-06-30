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
	icon: string;
	gradient?: string;
	date?: string;
	tags?: string[];
	useCase?: string;
	subcategory?: string;
}

export type Assistant = {
	name: string;
	category: string;
	gradient: string;
	icon: string;
	creator: string;
	date: string;
	description: string;
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
};
