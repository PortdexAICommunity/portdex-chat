import { useMarketplaceStore } from "@/store/marketplace-store";
import { Badge } from "./ui/badge";

export function MarketplaceItemCount() {
	const { totalItems } = useMarketplaceStore();

	return (
		<Badge variant="secondary" className="text-xs">
			{totalItems} items
		</Badge>
	);
}
