import { auth } from "@/app/(auth)/auth";
import { getChatById, getVotesByChatId, voteMessage } from "@/lib/db/queries";
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

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const chatId = searchParams.get("chatId");

	if (!chatId) {
		return new ChatSDKError(
			"bad_request:api",
			"Parameter chatId is required."
		).toResponse();
	}

	try {
		const session = await withTimeout(auth());

		if (!session?.user) {
			return new ChatSDKError("unauthorized:vote").toResponse();
		}

		const chat = await getChatById({ id: chatId });

		if (!chat) {
			return new ChatSDKError("not_found:chat").toResponse();
		}

		if (chat.userId !== session.user.id) {
			return new ChatSDKError("forbidden:vote").toResponse();
		}

		const votes = await getVotesByChatId({ id: chatId });

		return Response.json(votes, { status: 200 });
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

export async function PATCH(request: Request) {
	try {
		const {
			chatId,
			messageId,
			type,
		}: { chatId: string; messageId: string; type: "up" | "down" } =
			await request.json();

		if (!chatId || !messageId || !type) {
			return new ChatSDKError(
				"bad_request:api",
				"Parameters chatId, messageId, and type are required."
			).toResponse();
		}

		const session = await withTimeout(auth());

		if (!session?.user) {
			return new ChatSDKError("unauthorized:vote").toResponse();
		}

		const chat = await getChatById({ id: chatId });

		if (!chat) {
			return new ChatSDKError("not_found:vote").toResponse();
		}

		if (chat.userId !== session.user.id) {
			return new ChatSDKError("forbidden:vote").toResponse();
		}

		await voteMessage({
			chatId,
			messageId,
			type: type,
		});

		return new Response("Message voted", { status: 200 });
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
