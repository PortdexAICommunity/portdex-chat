import {
	AuthGetCurrentUserServer,
	ensureUserInDatabase,
	getServerAuthSession,
} from "@/utils/amplify-utils";

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

// Auth operations handled client-side

export async function getServerSession(): Promise<Session | null> {
	try {
		// First try to get the auth session
		const authSession = await getServerAuthSession();

		// If we couldn't get an auth session at all, return guest
		if (!authSession) {
			console.log("getServerSession: No auth session, returning guest");
			return createGuestSession();
		}

		// Check for authenticated user based on tokens
		if (authSession.tokens) {
			console.log("getServerSession: Authenticated user with tokens");

			try {
				// Try to get the current user if we have tokens
				const user = await AuthGetCurrentUserServer();

				if (user) {
					const userId = user.userId;
					// Prefer email from user.signInDetails; fallback to idToken; finally, generate a placeholder to satisfy NOT NULL
					const tokenEmail =
						authSession.tokens?.idToken?.payload?.email?.toString() || null;
					const resolvedEmail =
						user.signInDetails?.loginId ||
						tokenEmail ||
						`user-${userId}@placeholder.local`;

					console.log(
						`getServerSession: User authenticated: ${userId}, ${resolvedEmail}`
					);

					// Ensure the user exists in our database (always pass a non-empty email string)
					await ensureUserInDatabase(userId, resolvedEmail);

					return {
						user: {
							id: userId,
							name: user.username,
							email: resolvedEmail || null,
							image: null,
							type: "regular",
						},
						expires: new Date(Date.now() + 3600 * 1000).toISOString(),
					};
				} else {
					console.log(
						"getServerSession: No user from AuthGetCurrentUserServer but have tokens"
					);
				}
			} catch (error) {
				console.log("Error getting current user:", error);
				// Fall through to use token data
			}

			// Fallback to using token data if AuthGetCurrentUserServer fails
			const idToken = authSession.tokens.idToken?.payload;
			if (!idToken) {
				console.log("getServerSession: No idToken in tokens");
				return createGuestSession();
			}

			const userId = idToken.sub?.toString() || "unknown";
			const email =
				idToken.email?.toString() || `user-${userId}@placeholder.local`;

			console.log(`getServerSession: Using token data: ${userId}, ${email}`);

			// Ensure the user exists in our database
			await ensureUserInDatabase(userId, email);

			return {
				user: {
					id: userId,
					name: idToken["cognito:username"]?.toString() || "User",
					email: email,
					image: null,
					type: "regular",
				},
				expires: new Date(Date.now() + 3600 * 1000).toISOString(),
			};
		}

		// Check for guest user based on credentials but no tokens
		if (authSession.credentials && !authSession.tokens) {
			console.log("getServerSession: Guest user with credentials");
			const identityId = authSession.identityId || "guest";

			return {
				user: {
					id: identityId,
					name: "Guest",
					email: null,
					image: null,
					type: "guest",
				},
				expires: new Date(Date.now() + 3600 * 1000).toISOString(),
			};
		}

		// Default guest session if no credentials or tokens
		console.log("getServerSession: Default guest session");
		return createGuestSession();
	} catch (error) {
		console.log("getServerSession: Error, returning guest session", error);
		// Return guest session on error
		return createGuestSession();
	}
}

function createGuestSession(): Session {
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
