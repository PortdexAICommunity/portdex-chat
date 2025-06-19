export type DataPart = { type: 'append-message'; message: string };


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
}
