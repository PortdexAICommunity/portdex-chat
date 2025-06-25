"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white/10 backdrop-blur-md">
			<div className="mx-5 flex justify-between h-16 items-center">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="" />

					{/* Company Logo - hidden on mobile when sidebar is open */}
					<Link href="/" className="flex items-center gap-2">
						<span className="font-bold sm:inline-block font-sans text-xl">
							Portdex
						</span>
					</Link>
				</div>

				{/* Navigation - hidden on mobile */}
				<nav className="ml-auto hidden items-center gap-4 md:flex">
					<div
						onClick={() => router.push("/")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/" ? "text-purple-400" : ""
						)}
					>
						Home
					</div>
					<div
						onClick={() => router.push("/about")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/" ? "text-purple-400" : ""
						)}
					>
						About
					</div>
					<div
						onClick={() => router.push("/marketplace")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/marketplace" ? "text-purple-400" : ""
						)}
					>
						Marketplace
					</div>
					<div
						onClick={() => router.push("/developers")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/developers" ? "text-purple-400" : ""
						)}
					>
						Developers
					</div>
					<div
						onClick={() => router.push("/blockchain")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/blockchain" ? "text-purple-400" : ""
						)}
					>
						Blockchain
					</div>
					{/* <div
						onClick={() => router.push("/models")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/models" ? "text-purple-400" : ""
						)}
					>
						Models
					</div> */}
					{/* <div
						onClick={() => router.push("/playground")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/playground" ? "text-purple-400" : ""
						)}
					>
						Playground
					</div> */}
					{/* <div
						onClick={() => router.push("/integration")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/integration" ? "text-purple-400" : ""
						)}
					>
						Integration
					</div> */}
					<div
						onClick={() => router.push("/roadmap")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/roadmap" ? "text-purple-400" : ""
						)}
					>
						Roadmap
					</div>
					<div
						onClick={() => router.push("/contact")}
						className={cn(
							"hover:text-foreground text-sm md:text-md transition-colors cursor-pointer hidden md:block",
							pathname === "/contact-us" ? "text-purple-400" : ""
						)}
					>
						Contacts
					</div>
				</nav>
			</div>
		</header>
	);
}
