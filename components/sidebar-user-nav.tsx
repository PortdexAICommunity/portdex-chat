"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { generateUsername } from "@/hooks/username-generator";

export function SidebarUserNav() {
	const { setTheme, theme } = useTheme();
	const { user, signOut, isGuest, loading, userAttributes } = useAuth();
	const router = useRouter();

	if (loading) {
		return (
			<div className="flex items-center justify-center p-2">
				<div className="text-sm text-muted-foreground">Loading...</div>
			</div>
		);
	}

	const handleSignIn = () => {
		router.push("/login");
	};

	const displayName = isGuest
		? "Guest User"
		: generateUsername(user?.signInDetails?.loginId || "") ||
			user?.signInDetails?.loginId ||
			"User";

	const displayEmail = isGuest
		? "Not signed in"
		: user?.signInDetails?.loginId || userAttributes?.email || "No email";

	const avatarInitial = isGuest
		? "G"
		: `https://avatar.vercel.sh/${user?.userId || "user"}`;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-full justify-start px-2"
				>
					<Avatar className="size-8 mr-3">
						<AvatarImage
							src={
								isGuest
									? undefined
									: `https://avatar.vercel.sh/${user?.userId || "user"}`
							}
							alt="Avatar"
						/>
						<AvatarFallback className={isGuest ? "bg-muted" : ""}>
							{avatarInitial}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col items-start text-left">
						<p className="text-sm font-medium leading-none truncate">
							{displayName}
						</p>
						<p className="text-xs leading-none text-muted-foreground truncate">
							{isGuest
								? "Guest Mode"
								: user?.signInDetails?.loginId || userAttributes?.email}
						</p>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{displayName}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{displayEmail}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{isGuest ? (
					<>
						<DropdownMenuItem
							data-testid="user-nav-item-theme"
							className="cursor-pointer"
							onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{`Toggle ${theme === "light" ? "dark" : "light"} mode`}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleSignIn}>Sign In</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem
							data-testid="user-nav-item-theme"
							className="cursor-pointer"
							onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{`Toggle ${theme === "light" ? "dark" : "light"} mode`}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button
								variant={"outline"}
								className="w-full"
								onClick={async () => await signOut()}
							>
								Sign Out
							</Button>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
