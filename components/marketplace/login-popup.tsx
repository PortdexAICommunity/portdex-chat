"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface LoginPopupProps {
	isOpen: boolean;
	onClose: () => void;
}

export function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
	const router = useRouter();

	const handleLogin = () => {
		onClose();
		router.push("/login");
	};

	const handleRegister = () => {
		onClose();
		router.push("/register");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						🔒 Login Required
					</DialogTitle>
					<DialogDescription>
						You need to be logged in to download workflows. Please login or
						create an account to continue.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
						<p>
							✨ <strong>Free account benefits:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Download unlimited workflows</li>
							<li>Access to premium templates</li>
							<li>Save your favorite items</li>
							<li>Get notified of new releases</li>
						</ul>
					</div>
				</div>

				<DialogFooter className="flex-col-reverse sm:flex-row gap-2">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<div className="flex gap-2 w-full sm:w-auto">
						<Button
							variant="outline"
							onClick={handleRegister}
							className="flex-1 sm:flex-none"
						>
							Sign Up
						</Button>
						<Button onClick={handleLogin} className="flex-1 sm:flex-none">
							Login
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
