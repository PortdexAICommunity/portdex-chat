import { auth } from "@/app/(auth)/auth";
import type { NextRequest } from "next/server";
import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

// Helper function to add timeout to auth calls
const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs = 10000
): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("Auth timeout")), timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]);
};

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

	try {
		const session = await withTimeout(auth());

		if (!session?.user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		const chats = await getChatsByUserId({
			id: session.user.id,
			limit,
			startingAfter,
			endingBefore,
		});

		return Response.json(chats);
	} catch (error) {
		if (error instanceof Error && error.message === "Auth timeout") {
			return new ChatSDKError(
				"offline:auth",
				"Authentication timed out - request canceled to prevent hanging"
			).toResponse();
		}

		// Re-throw other errors to be handled by the framework
		throw error;
	}
}
