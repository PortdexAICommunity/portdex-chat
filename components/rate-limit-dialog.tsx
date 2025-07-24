"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { registerUser } from "@/app/(auth)/actions";
import { GUEST_MESSAGE_LIMIT } from "@/lib/ai/entitlements";

interface RateLimitDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const RateLimitDialog = ({
	open,
	onOpenChange,
}: RateLimitDialogProps) => {
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const router = useRouter();

	const handleSignUp = async (email: string, password: string) => {
		try {
			const result = await registerUser(email, password);

			if (result.status === "success") {
				setIsSuccessful(true);
				toast({
					type: "success",
					description: result.message || "Account created successfully!",
				});
				// Close dialog and redirect to login
				setTimeout(() => {
					onOpenChange(false);
					router.push("/login");
				}, 1500);
			} else {
				toast({
					type: "error",
					description: result.message || "Registration failed",
				});
			}
		} catch (error) {
			toast({
				type: "error",
				description: "An unexpected error occurred",
			});
		}
	};

	const handleSignIn = () => {
		onOpenChange(false);
		router.push("/login");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center">
						{showSignUp ? "Create Your Account" : "Message Limit Reached"}
					</DialogTitle>
					<DialogDescription className="text-center">
						{showSignUp ? (
							"Sign up to continue chatting and get unlimited messages"
						) : (
							<>
								You&apos;ve reached your limit of{" "}
								<strong>{GUEST_MESSAGE_LIMIT} messages</strong> as a guest user.
								<br />
								Create an account to continue the conversation!
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				{showSignUp ? (
					<div className="space-y-4">
						<AuthForm onSubmit={handleSignUp}>
							<SubmitButton isSuccessful={isSuccessful}>
								Create Account
							</SubmitButton>
						</AuthForm>

						<div className="text-center">
							<Button
								variant="ghost"
								onClick={() => setShowSignUp(false)}
								className="text-sm text-muted-foreground"
							>
								← Back to options
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="space-y-3">
							<Button
								onClick={() => setShowSignUp(true)}
								className="w-full"
								size="lg"
							>
								Create Free Account
							</Button>

							<Separator className="my-4" />

							<Button
								onClick={handleSignIn}
								variant="outline"
								className="w-full"
								size="lg"
							>
								Sign In to Existing Account
							</Button>
						</div>

						<div className="text-center text-sm text-muted-foreground">
							<p>✨ Unlimited messages</p>
							<p>💾 Save chat history</p>
							<p>🚀 Access to premium features</p>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
