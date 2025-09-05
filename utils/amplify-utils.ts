import { cookies } from "next/headers";

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import {
	getCurrentUser,
	fetchAuthSession,
	fetchUserAttributes,
} from "aws-amplify/auth/server";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { createUser, getUserById } from "@/lib/db/queries";

export const { runWithAmplifyServerContext } = createServerRunner({
	config: outputs,
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
	config: outputs,
	cookies,
});

export async function getServerAuthSession() {
	"use server";

	try {
		return await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: async (contextSpec) => {
				return await fetchAuthSession(contextSpec);
			},
		});
	} catch (error) {
		console.error("Error fetching auth session:", error);
		return null;
	}
}

export async function getFetchUserAttributes() {
	"use server";

	try {
		const currentUser = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => fetchUserAttributes(contextSpec),
		});
		return currentUser;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function AuthGetCurrentUserServer() {
	"use server";

	try {
		const currentUser = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => getCurrentUser(contextSpec),
		});
		return currentUser;
	} catch (error) {
		// Log the error but don't rethrow
		console.error("AuthGetCurrentUserServer error:", error);
		return null;
	}
}

/**
 * Ensures a user exists in the database
 * This bridges the gap between Cognito authentication and our database
 */
export async function ensureUserInDatabase(userId: string, email: string) {
	"use server";

	try {
		// First check if user exists by ID
		const existingUser = await getUserById(userId);

		if (existingUser) {
			console.log(`User already exists in database: ${email} (${userId})`);
			return true;
		}

		// User doesn't exist, create them with the same ID from Cognito
		console.log(`Creating new user in database: ${email} (${userId})`);
		await createUser(userId, email);

		return true;
	} catch (error) {
		console.error("Error ensuring user in database:", error);
		return false;
	}
}
