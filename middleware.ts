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
		"/",
		"/chat/:id",
		"/api/((?!auth|health).*)", // Allow auth and health to pass through
		"/login",
		"/register",
		"/marketplace/:path*",

		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 * - manifest.webmanifest (PWA manifest)
		 * - api/auth (auth endpoints)
		 * - api/health (health checks)
		 */
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|api/auth|api/health).*)",
	],
};
