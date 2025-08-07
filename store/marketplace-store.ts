import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MarketplaceState {
	totalItems: number;
	setTotalItems: (count: number) => void;
}

// Default value to show when there's no persisted data
const DEFAULT_TOTAL_ITEMS = 500;

export const useMarketplaceStore = create<MarketplaceState>()(
	persist(
		(set) => ({
			totalItems: DEFAULT_TOTAL_ITEMS,
			setTotalItems: (count: number) => set({ totalItems: count }),
		}),
		{
			name: "marketplace-storage", // name of the item in the storage
			skipHydration: false, // enable automatic hydration
			// Custom merge function to handle initial state
			merge: (
				persistedState: unknown,
				currentState: MarketplaceState
			): MarketplaceState => {
				// If there's persisted data, use it
				if (
					persistedState &&
					typeof persistedState === "object" &&
					"totalItems" in persistedState
				) {
					const totalItems = (persistedState as { totalItems: unknown })
						.totalItems;
					// Only take the totalItems value from persisted state, keep setTotalItems from currentState
					return {
						...currentState,
						totalItems:
							typeof totalItems === "number" ? totalItems : DEFAULT_TOTAL_ITEMS,
					};
				}
				// If no persisted data, use default value
				return { ...currentState, totalItems: DEFAULT_TOTAL_ITEMS };
			},
		}
	)
);
