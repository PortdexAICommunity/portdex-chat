import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	/*
	 * Playwright starts the dev server and requires a 200 status to
	 * begin the tests, so this ensures that the tests can start
	 */
	if (pathname.startsWith("/ping")) {
		return new Response("pong", { status: 200 });
	}

	if (pathname.startsWith("/api/auth")) {
		return NextResponse.next();
	}

	const token = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET,
		secureCookie: !isDevelopmentEnvironment,
	});

	if (!token) {
		const redirectUrl = encodeURIComponent(request.url);

		return NextResponse.redirect(
			new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url)
		);
	}

	const isGuest = guestRegex.test(token?.email ?? "");

	if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Specific protected routes only
		"/",
		"/chat/:path*",
		"/login",
		"/register",
		"/marketplace/:path*",
		// Protected API routes (excluding auth and health)
		"/api/chat/:path*",
		"/api/document/:path*",
		"/api/files/:path*",
		"/api/history/:path*",
		"/api/suggestions/:path*",
		"/api/vote/:path*",
	],
};
