import { useMarketplaceStore } from "@/store/marketplace-store";

interface MarketplaceStatsProps {
	className?: string;
}

export function MarketplaceStats({ className }: MarketplaceStatsProps) {
	const { totalItems } = useMarketplaceStore();

	return (
		<div className={className}>
			<div className="flex flex-col">
				<span className="text-2xl font-bold">{totalItems}</span>
				<span className="text-sm text-muted-foreground">
					Total Marketplace Items
				</span>
			</div>
		</div>
	);
}
