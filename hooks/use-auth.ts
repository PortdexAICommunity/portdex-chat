// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import {
	getCurrentUser,
	signOut as awsSignOut,
	fetchAuthSession,
	fetchUserAttributes,
} from "aws-amplify/auth";
import type { AuthUser, UserAttributeKey } from "aws-amplify/auth";

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [userAttributes, setUserAttributes] = useState<Partial<
		Record<UserAttributeKey, string>
	> | null>(null);
	const [isGuest, setIsGuest] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			try {
				// Use server-side session fetch for Next.js App Router
				const session = await fetchAuthSession();
				if (session.tokens) {
					// Authenticated user
					const currentUser = await getCurrentUser();
					setUser(currentUser);
					setIsGuest(false);

					// Check if username starts with "google"
					if (currentUser.username.startsWith("google")) {
						try {
							// Fetch additional user attributes for Google users
							const attributes = await fetchUserAttributes();
							setUserAttributes(attributes);
						} catch (attributeError) {
							console.error("Error fetching user attributes:", attributeError);
						}
					}
				} else if (session.credentials) {
					// Guest user
					setUser(null);
					setUserAttributes(null);
					setIsGuest(true);
				} else {
					setUser(null);
					setUserAttributes(null);
					setIsGuest(true);
				}
			} catch (error) {
				setUser(null);
				setUserAttributes(null);
				setIsGuest(true);
			} finally {
				setLoading(false);
			}
		};

		checkUser();

		const hubListener = Hub.listen("auth", ({ payload }: any) => {
			switch (payload.event) {
				case "signedIn":
					checkUser();
					break;
				case "signedOut":
					setUser(null);
					setIsGuest(true);
					break;
			}
		});

		return () => {
			hubListener();
		};
	}, []);

	const signOut = async () => {
		try {
			await awsSignOut();
			// Refresh the page after successful sign out
			// window.location.reload();
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	return { user, userAttributes, isGuest, loading, signOut };
}
