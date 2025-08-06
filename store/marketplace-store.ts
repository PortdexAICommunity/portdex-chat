import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MarketplaceState {
	totalItems: number;
	setTotalItems: (count: number) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
	persist(
		(set) => ({
			totalItems: 0,
			setTotalItems: (count: number) => set({ totalItems: count }),
		}),
		{
			name: "marketplace-storage", // name of the item in the storage
			skipHydration: false, // enable automatic hydration
		}
	)
);
