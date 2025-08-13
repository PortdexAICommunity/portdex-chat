"use server";

import { getServerSession } from "@/lib/amplify-server";
import {
	AuthGetCurrentUserServer,
	ensureUserInDatabase,
	getServerAuthSession,
} from "@/utils/amplify-utils";
import type { NextRequest } from "next/server";
import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const limit = Number.parseInt(searchParams.get("limit") || "10");
	const startingAfter = searchParams.get("starting_after");
	const endingBefore = searchParams.get("ending_before");

	if (startingAfter && endingBefore) {
		return new ChatSDKError(
			"bad_request:api",
			"Only one of starting_after or ending_before can be provided."
		).toResponse();
	}

	let session = await getServerSession();

	// If session is guest or missing, try to recover using Cognito directly
	if (!session?.user || session.user.type === "guest") {
		try {
			// Only try Cognito user fetch if tokens are present; otherwise it will throw
			const authSession = await getServerAuthSession();
			if (authSession?.tokens) {
				const user = await AuthGetCurrentUserServer();
				if (user) {
					const userId = user.userId;
					const email =
						user.signInDetails?.loginId || `user-${userId}@placeholder.local`;
					await ensureUserInDatabase(userId, email);
					session = {
						user: {
							id: userId,
							name: user.username,
							email,
							image: null,
							type: "regular",
						},
						expires: new Date(Date.now() + 3600 * 1000).toISOString(),
					};
				}
			}
		} catch (_) {
			// ignore and fall back to guest behavior below
		}
	}

	if (!session?.user) {
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	// Still guest? Return empty history (client can retry shortly after login)
	if (session.user.type === "guest") {
		return Response.json({ chats: [], hasMore: false });
	}

	const chats = await getChatsByUserId({
		id: session.user.id,
		limit,
		startingAfter,
		endingBefore,
	});

	return Response.json(chats);
}
