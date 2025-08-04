// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import {
	getCurrentUser,
	signOut as awsSignOut,
	fetchAuthSession,
} from "aws-amplify/auth";
import type { AuthUser } from "aws-amplify/auth";

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
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
				} else if (session.credentials) {
					// Guest user
					setUser(null);
					setIsGuest(true);
				} else {
					setUser(null);
					setIsGuest(true);
				}
			} catch (error) {
				setUser(null);
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
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	return { user, isGuest, loading, signOut };
}
