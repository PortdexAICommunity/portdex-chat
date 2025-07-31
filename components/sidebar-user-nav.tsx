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

export function SidebarUserNav() {
	const { setTheme, theme } = useTheme();
	const { user, signOut, isGuest, loading } = useAuth();
	const router = useRouter();

	if (loading) {
		return (
			<div className="flex items-center justify-center p-2">
				<div className="text-sm text-muted-foreground">Loading...</div>
			</div>
		);
	}

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	const handleSignIn = () => {
		router.push("/login");
	};

	const displayName = isGuest
		? "Guest User"
		: user?.username || user?.signInDetails?.loginId || "User";

	const displayEmail = isGuest
		? "Not signed in"
		: user?.signInDetails?.loginId || "No email";

	const avatarInitial = isGuest
		? "G"
		: (
				user?.username?.[0] ||
				user?.signInDetails?.loginId?.[0] ||
				"U"
			).toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-full justify-start px-2"
				>
					<Avatar className="size-8 mr-3">
						<AvatarImage
							src={isGuest ? undefined : "/avatar.png"}
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
							{isGuest ? "Guest Mode" : "Signed In"}
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
						<DropdownMenuItem asChild>
							<Link href="/register">Create Account</Link>
						</DropdownMenuItem>
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
						<DropdownMenuItem asChild>
							<Link href="/profile">Profile Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							Sign Out
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
