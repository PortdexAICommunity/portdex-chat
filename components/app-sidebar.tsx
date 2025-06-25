"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { BotIcon, CompassIcon, MonitorIcon, PuzzleIcon } from "lucide-react";

const navigationItems = [
	{
		title: "Workflows",
		href: "https://workflow.portdex.ai/",
		icon: PuzzleIcon,
		target: "_blank",
	},
	{
		title: "Digital Content",
		href: "https://digitalcontent.portdex.ai/",
		icon: MonitorIcon,
		target: "_blank",
	},
	{
		title: "Agentic AI",
		href: "https://dev.portdex.ai/",
		icon: BotIcon,
		target: "_blank",
	},
	{
		title: "Marketplace",
		href: "/marketplace",
		icon: CompassIcon,
		target: "_self",
	},
];

export function AppSidebar({ user }: { user: User | undefined }) {
	const router = useRouter();
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar className="group-data-[side=left]:border-r-0">
			<SidebarHeader>
				<SidebarMenu>
					<div className="flex flex-row justify-between items-center">
						<Link
							href="/"
							onClick={() => {
								setOpenMobile(false);
							}}
							className="flex flex-row gap-3 items-center"
						>
							<span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
								Portdex Chat
							</span>
						</Link>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									type="button"
									className="p-2 h-fit"
									onClick={() => {
										setOpenMobile(false);
										router.push("/");
										router.refresh();
									}}
								>
									<PlusIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent align="end">New Chat</TooltipContent>
						</Tooltip>
					</div>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarHistory user={user} />
				<div className="flex flex-1" />
				<div className="p-2">
					{navigationItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							target={item.target}
							className="flex gap-3 items-center p-2 hover:bg-muted hover:text-purple-500 rounded-md transition-colors duration-200"
						>
							<item.icon className="size-5 shrink-0" />
							<span className="text-sm font-medium truncate">{item.title}</span>
						</Link>
					))}
				</div>
			</SidebarContent>
			<SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
		</Sidebar>
	);
}
