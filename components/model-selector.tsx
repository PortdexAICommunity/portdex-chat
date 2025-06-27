"use client";

import {
	startTransition,
	useMemo,
	useOptimistic,
	useState,
	useEffect,
} from "react";

import { saveChatModelAsCookie } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllChatModels } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

import { CheckCircleFillIcon, ChevronDownIcon } from "./icons";
import { getDynamicEntitlements } from "@/lib/ai/entitlements";
import type { Session } from "next-auth";
import type { HomeMarketplaceItem } from "@/lib/types";

export function ModelSelector({
	session,
	selectedModelId,
	className,
}: {
	session: Session;
	selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
	const [open, setOpen] = useState(false);
	const [optimisticModelId, setOptimisticModelId] =
		useOptimistic(selectedModelId);

	const [selectedAssistant, setSelectedAssistant] =
		useState<HomeMarketplaceItem | null>(null);

	// Load selected assistant from localStorage
	useEffect(() => {
		const savedAssistant = localStorage.getItem("selected-assistant");
		if (savedAssistant) {
			try {
				const assistant = JSON.parse(savedAssistant);
				setSelectedAssistant(assistant);
			} catch (error) {
				console.error("Failed to parse saved assistant:", error);
				localStorage.removeItem("selected-assistant");
			}
		}
	}, []);

	const clearAssistant = () => {
		setSelectedAssistant(null);
		localStorage.removeItem("selected-assistant");
	};

	const userType = session.user.type;
	const { availableChatModelIds } = getDynamicEntitlements(
		userType,
		selectedAssistant
	);

	const availableChatModels = getAllChatModels(selectedAssistant).filter(
		(chatModel) => availableChatModelIds.includes(chatModel.id)
	);

	const selectedChatModel = useMemo(
		() =>
			availableChatModels.find(
				(chatModel) => chatModel.id === optimisticModelId
			),
		[optimisticModelId, availableChatModels]
	);

	const handleModelSelect = (id: string) => {
		setOpen(false);

		startTransition(() => {
			setOptimisticModelId(id);
			saveChatModelAsCookie(id);

			// If user selects a non-assistant model, clear the assistant context
			if (!id.startsWith("assistant-")) {
				clearAssistant();
			}
		});
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				asChild
				className={cn(
					"w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
					className
				)}
			>
				<Button
					data-testid="model-selector"
					variant="outline"
					className="md:px-2 md:h-[34px]"
				>
					{selectedChatModel?.name}
					<ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-[300px]">
				{availableChatModels.map((chatModel) => {
					const { id } = chatModel;
					const isAssistant = id.startsWith("assistant-");

					return (
						<DropdownMenuItem
							data-testid={`model-selector-item-${id}`}
							key={id}
							onSelect={() => handleModelSelect(id)}
							data-active={id === optimisticModelId}
							asChild
						>
							<button
								type="button"
								className="gap-4 group/item flex flex-row justify-between items-center w-full"
							>
								<div className="flex flex-col gap-1 items-start">
									<div className="flex items-center gap-2">
										{isAssistant && (
											<span className="text-purple-600 dark:text-purple-400">
												🤖
											</span>
										)}
										{chatModel.name}
									</div>
									<div className="text-xs text-muted-foreground">
										{chatModel.description}
									</div>
								</div>

								<div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
									<CheckCircleFillIcon />
								</div>
							</button>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
