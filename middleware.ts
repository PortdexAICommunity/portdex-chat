import { type NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utils/amplify-utils";
import { fetchAuthSession } from "aws-amplify/auth/server";

export async function middleware(request: NextRequest) {
	// const response = NextResponse.next();
	// await runWithAmplifyServerContext({
	// 	nextServerContext: { request, response },
	// 	operation: async (contextSpec) => {
	// 		try {
	// 			// This is a dummy operation to ensure the context is populated.
	// 			// It will make the user's auth session available in Server Components.
	// 		} catch (error) {
	// 			// Ignore errors for guest users
	// 		}
	// 	},
	// });
	// return response;

	const response = NextResponse.next();

	const isAuthenticatedOrGuest = await runWithAmplifyServerContext({
		nextServerContext: { request, response },
		operation: async (contextSpec) => {
			try {
				const session = await fetchAuthSession(contextSpec, {});
				// If tokens exist, user is authenticated
				if (session.tokens) return true;
				// If credentials exist, user is a guest (Identity Pool)
				if (session.credentials) return true;
				console.log("session", session?.credentials);

				// No session at all
				return false;
			} catch (error) {
				// Treat errors as unauthenticated
				return false;
			}
		},
	});

	if (isAuthenticatedOrGuest) {
		return response;
	}

	// If neither authenticated nor guest, redirect to login
	return NextResponse.redirect(new URL("/login", request.url));
}
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - login
		 * - register
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
	],
};
