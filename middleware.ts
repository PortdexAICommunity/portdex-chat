import { type NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "./lib/amplify-server";

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	await runWithAmplifyServerContext({
		nextServerContext: { request, response },
		operation: async (contextSpec) => {
			try {
				// This is a dummy operation to ensure the context is populated.
				// It will make the user's auth session available in Server Components.
			} catch (error) {
				// Ignore errors for guest users
			}
		},
	});
	return response;
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
