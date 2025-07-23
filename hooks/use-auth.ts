"use client";

import { Hub } from "aws-amplify/utils";
import {
	getCurrentUser,
	signOut as awsSignOut,
	fetchAuthSession,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";
import type { AuthUser } from "aws-amplify/auth";

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isGuest, setIsGuest] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			try {
				console.log("useAuth: Checking authentication...");

				// First, try to get the auth session (works for both authenticated and guest users)
				const session = await fetchAuthSession();
				console.log(
					"useAuth: Session credentials available:",
					!!session.credentials
				);
				console.log("useAuth: Session tokens available:", !!session.tokens);

				if (session.tokens) {
					// User is authenticated, get their info
					console.log("useAuth: Authenticated user");
					const currentUser = await getCurrentUser();
					setUser(currentUser);
					setIsGuest(false);
				} else if (session.credentials) {
					// User is a guest with Identity Pool credentials
					console.log("useAuth: Guest user with Identity Pool credentials");
					setUser(null);
					setIsGuest(true);
				} else {
					// No credentials at all
					console.log("useAuth: No credentials, setting as guest");
					setUser(null);
					setIsGuest(true);
				}
			} catch (error) {
				console.log(
					"useAuth: Error, setting as guest:",
					error instanceof Error ? error.message : error
				);
				setUser(null);
				setIsGuest(true);
			} finally {
				setLoading(false);
				console.log("useAuth: Authentication check complete");
			}
		};

		checkUser();

		const hubListener = Hub.listen("auth", ({ payload }: any) => {
			console.log("useAuth: Auth event:", payload.event);
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
