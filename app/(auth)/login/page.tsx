"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser, confirmSignUpUser } from "../actions";

export default function Page() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [isConfirming, setIsConfirming] = useState(false);
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (email: string, password: string) => {
		setIsLoading(true);
		setEmail(email);

		try {
			const result = await loginUser(email, password);

			if (result.status === "success") {
				setIsSuccessful(true);
				toast({
					type: "success",
					description: result.message || "Login successful!",
				});
				router.push("/");
			} else if (result.status === "user_not_confirmed") {
				setIsConfirming(true);
				toast({
					type: "error",
					description: result.message || "Please confirm your email first",
				});
			} else {
				toast({
					type: "error",
					description: result.message || "Login failed",
				});
			}
		} catch (error) {
			toast({
				type: "error",
				description: "An unexpected error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfirmSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const code = formData.get("code") as string;

		try {
			const result = await confirmSignUpUser(email, code);

			if (result.status === "success") {
				setIsSuccessful(true);
				toast({
					type: "success",
					description: result.message || "Email confirmed successfully!",
				});
				router.push("/");
			} else {
				toast({
					type: "error",
					description: result.message || "Confirmation failed",
				});
			}
		} catch (error) {
			toast({
				type: "error",
				description: "An unexpected error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isConfirming) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
					<h1 className="text-2xl font-bold text-center">Confirm your email</h1>
					<p className="text-sm text-center text-gray-600 dark:text-gray-400">
						We sent a confirmation code to {email}
					</p>
					<form onSubmit={handleConfirmSignUp} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="code">Confirmation Code</Label>
							<Input
								id="code"
								name="code"
								placeholder="Enter 6-digit code"
								className="bg-muted"
								required
								disabled={isLoading}
								autoFocus
							/>
						</div>
						<SubmitButton isSuccessful={isSuccessful}>
							{isLoading ? "Confirming..." : "Confirm"}
						</SubmitButton>
					</form>
					<button
						onClick={() => setIsConfirming(false)}
						className="text-sm text-center text-blue-500 hover:underline w-full"
					>
						Back to login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
				<h1 className="text-2xl font-bold text-center">Sign In</h1>
				<AuthForm onSubmit={handleLogin} defaultEmail={email}>
					<SubmitButton isSuccessful={isSuccessful}>
						{isLoading
							? "Signing In..."
							: isSuccessful
							? "Signed In!"
							: "Sign In"}
					</SubmitButton>
					<Link
						href="/register"
						className="text-sm text-center text-blue-500 hover:underline"
					>
						Don&apos;t have an account? Sign up
					</Link>
				</AuthForm>
			</div>
		</div>
	);
}
