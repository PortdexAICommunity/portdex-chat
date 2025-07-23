"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { registerUser } from "../actions";

export default function Page() {
	const router = useRouter();

	const [isSuccessful, setIsSuccessful] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async (email: string, password: string) => {
		setIsLoading(true);

		try {
			const result = await registerUser(email, password);

			if (result.status === "success") {
				setIsSuccessful(true);
				toast({
					type: "success",
					description:
						result.message ||
						"Account created successfully! Please check your email for confirmation.",
				});
				// Redirect to login after a short delay
				setTimeout(() => {
					router.push("/login");
				}, 2000);
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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
				<h1 className="text-2xl font-bold text-center">Create Account</h1>
				<AuthForm onSubmit={handleRegister}>
					<SubmitButton isSuccessful={isSuccessful}>
						{isLoading
							? "Creating Account..."
							: isSuccessful
							? "Account Created!"
							: "Sign Up"}
					</SubmitButton>
					<Link
						href="/login"
						className="text-sm text-center text-blue-500 hover:underline"
					>
						Already have an account? Sign in
					</Link>
				</AuthForm>
			</div>
		</div>
	);
}
