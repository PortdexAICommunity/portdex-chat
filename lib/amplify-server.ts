import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";
// Note: Server-side auth operations will be handled differently
import { cookies } from "next/headers";

interface AuthUser {
	userId: string;
	username: string;
	signInDetails?: {
		loginId?: string;
	};
}

interface Session {
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
		type: "guest" | "regular";
	};
	expires: string;
}

const config = {
	Auth: {
		Cognito: {
			userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
			userPoolClientId:
				process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
			identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || "",
		},
	},
};

export const { runWithAmplifyServerContext } = createServerRunner({
	config,
});

export async function authGetCurrentUserServer(): Promise<AuthUser | null> {
	try {
		const user = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => getCurrentUser(contextSpec),
		});
		console.log("authGetCurrentUserServer: Authenticated user found");
		return user;
	} catch (error) {
		console.log("authGetCurrentUserServer: No authenticated user (guest)");
		return null;
	}
}

// Auth operations handled client-side

export async function getServerSession(): Promise<Session | null> {
	try {
		const user = await authGetCurrentUserServer();

		if (!user) {
			console.log("getServerSession: Returning guest session");
			// Return guest session
			return {
				user: {
					id: "guest",
					name: "Guest",
					email: null,
					image: null,
					type: "guest",
				},
				expires: new Date(Date.now() + 3600 * 1000).toISOString(),
			};
		}

		console.log("getServerSession: Returning authenticated user session");
		return {
			user: {
				id: user.userId,
				name: user.username,
				email: user.signInDetails?.loginId || null,
				image: null,
				type: "regular",
			},
			expires: new Date(Date.now() + 3600 * 1000).toISOString(),
		};
	} catch (error) {
		console.log("getServerSession: Error, returning guest session");
		// Return guest session on error
		return {
			user: {
				id: "guest",
				name: "Guest",
				email: null,
				image: null,
				type: "guest",
			},
			expires: new Date(Date.now() + 3600 * 1000).toISOString(),
		};
	}
}

// runWithAmplifyServerContext is already exported above
