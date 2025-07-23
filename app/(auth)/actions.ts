"use client";

import { z } from "zod";
import {
	confirmSignUp as cognitoConfirmSignUp,
	signIn as cognitoSignIn,
	signUp as cognitoSignUp,
} from "aws-amplify/auth";

// Function to calculate SECRET_HASH for Cognito
function calculateSecretHash(username: string): string {
	const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "";
	const clientSecret =
		process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_SECRET || "";

	if (!clientSecret) {
		throw new Error("Client secret is required but not configured");
	}

	// Create the message: username + client_id
	const message = username + clientId;

	// Create HMAC-SHA256 hash
	const encoder = new TextEncoder();
	const key = encoder.encode(clientSecret);
	const data = encoder.encode(message);

	// Use Web Crypto API to create HMAC
	return btoa(
		String.fromCharCode(
			...new Uint8Array(
				// This is a simplified version - we'll use a crypto library
				Array.from(message).map((char) => char.charCodeAt(0))
			)
		)
	);
}

// Alternative implementation using crypto-js (we'll install this)
async function calculateSecretHashAsync(username: string): Promise<string> {
	const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "";
	const clientSecret =
		process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_SECRET || "";

	if (!clientSecret) {
		return ""; // Return empty if no secret
	}

	const message = username + clientId;

	// Use Web Crypto API
	const encoder = new TextEncoder();
	const keyData = encoder.encode(clientSecret);
	const messageData = encoder.encode(message);

	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		keyData,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
	const hashArray = new Uint8Array(signature);

	// Convert to base64
	return btoa(String.fromCharCode(...hashArray));
}

const authFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export interface AuthActionState {
	status:
		| "idle"
		| "in_progress"
		| "success"
		| "failed"
		| "invalid_data"
		| "user_exists"
		| "user_not_confirmed";
	message?: string;
}

export const loginUser = async (
	email: string,
	password: string
): Promise<AuthActionState> => {
	try {
		const validatedData = authFormSchema.parse({ email, password });

		const { nextStep } = await cognitoSignIn({
			username: validatedData.email,
			password: validatedData.password,
		});

		if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
			return {
				status: "user_not_confirmed",
				message: "Please confirm your email first",
			};
		}

		return { status: "success", message: "Login successful" };
	} catch (error: any) {
		console.error("Login error:", error);
		if (error instanceof z.ZodError) {
			return {
				status: "invalid_data",
				message: "Invalid email or password format",
			};
		}

		if (error.name === "UserNotConfirmedException") {
			return {
				status: "user_not_confirmed",
				message: "Please confirm your email first",
			};
		}

		if (error.name === "NotAuthorizedException") {
			return { status: "failed", message: "Incorrect email or password" };
		}

		return { status: "failed", message: "Login failed. Please try again." };
	}
};

export const registerUser = async (
	email: string,
	password: string
): Promise<AuthActionState> => {
	try {
		const validatedData = authFormSchema.parse({ email, password });

		await cognitoSignUp({
			username: validatedData.email,
			password: validatedData.password,
			options: {
				userAttributes: {
					email: validatedData.email,
				},
			},
		});

		return {
			status: "success",
			message:
				"Registration successful! Please check your email for confirmation code.",
		};
	} catch (error: any) {
		console.error("Registration error:", error);
		if (error.name === "UsernameExistsException") {
			return {
				status: "user_exists",
				message: "An account with this email already exists",
			};
		}
		if (error instanceof z.ZodError) {
			return {
				status: "invalid_data",
				message: "Invalid email or password format",
			};
		}

		return {
			status: "failed",
			message: "Registration failed. Please try again.",
		};
	}
};

const confirmSignUpSchema = z.object({
	email: z.string().email(),
	code: z.string().min(6),
});

export const confirmSignUpUser = async (
	email: string,
	code: string
): Promise<AuthActionState> => {
	try {
		const validatedData = confirmSignUpSchema.parse({ email, code });

		await cognitoConfirmSignUp({
			username: validatedData.email,
			confirmationCode: validatedData.code,
		});

		return {
			status: "success",
			message: "Email confirmed successfully! You can now sign in.",
		};
	} catch (error: any) {
		console.error("Confirmation error:", error);
		if (error instanceof z.ZodError) {
			return {
				status: "invalid_data",
				message: "Invalid email or confirmation code format",
			};
		}

		if (error.name === "CodeMismatchException") {
			return { status: "failed", message: "Invalid confirmation code" };
		}

		if (error.name === "ExpiredCodeException") {
			return { status: "failed", message: "Confirmation code has expired" };
		}

		return {
			status: "failed",
			message: "Confirmation failed. Please try again.",
		};
	}
};
