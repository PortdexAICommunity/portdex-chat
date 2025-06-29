import "server-only";

import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	inArray,
	lt,
	type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
	user,
	chat,
	type User,
	document,
	type Suggestion,
	suggestion,
	message,
	vote,
	type DBMessage,
	type Chat,
	stream,
} from "./schema";
import type { ArtifactKind } from "@/components/artifact";
import { generateUUID } from "../utils";
import { generateHashedPassword } from "./utils";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// Optimized for Cloudflare Workers and serverless environments
// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!, {
	// Connection configuration optimized for serverless
	max: 1, // Single connection for serverless
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10, // Connection timeout of 10 seconds
	prepare: false, // Disable prepared statements for better compatibility
	// Disable connection pooling transform for Workers
	transform: {
		undefined: null,
	},
});
const db = drizzle(client);

// Helper function to ensure connections are cleaned up
const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs = 25000
): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("Database query timeout")), timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]);
};

export async function getUser(email: string): Promise<Array<User>> {
	try {
		return await db.select().from(user).where(eq(user.email, email));
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get user by email"
		);
	}
}

export async function createUser(email: string, password: string) {
	const hashedPassword = generateHashedPassword(password);

	try {
		return await db.insert(user).values({ email, password: hashedPassword });
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to create user");
	}
}

export async function createGuestUser() {
	const email = `guest-${Date.now()}`;
	const password = generateHashedPassword(generateUUID());

	try {
		return await db.insert(user).values({ email, password }).returning({
			id: user.id,
			email: user.email,
		});
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to create guest user"
		);
	}
}

export async function saveChat({
	id,
	userId,
	title,
	visibility,
}: {
	id: string;
	userId: string;
	title: string;
	visibility: VisibilityType;
}) {
	try {
		return await db.insert(chat).values({
			id,
			createdAt: new Date(),
			userId,
			title,
			visibility,
		});
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to save chat");
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		await db.delete(vote).where(eq(vote.chatId, id));
		await db.delete(message).where(eq(message.chatId, id));
		await db.delete(stream).where(eq(stream.chatId, id));

		const [chatsDeleted] = await db
			.delete(chat)
			.where(eq(chat.id, id))
			.returning();
		return chatsDeleted;
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete chat by id"
		);
	}
}

export async function getChatsByUserId({
	id,
	limit,
	startingAfter,
	endingBefore,
}: {
	id: string;
	limit: number;
	startingAfter: string | null;
	endingBefore: string | null;
}) {
	try {
		const extendedLimit = limit + 1;

		// Optimized query to avoid multiple sequential database calls
		if (startingAfter || endingBefore) {
			const referenceId = (startingAfter || endingBefore) as string;
			const operator = startingAfter ? gt : lt;

			// Single optimized query using subquery to avoid multiple round trips
			const filteredChats = await withTimeout(
				db
					.select({
						id: chat.id,
						createdAt: chat.createdAt,
						title: chat.title,
						userId: chat.userId,
						visibility: chat.visibility,
					})
					.from(chat)
					.where(
						and(
							eq(chat.userId, id),
							operator(
								chat.createdAt,
								db
									.select({ createdAt: chat.createdAt })
									.from(chat)
									.where(eq(chat.id, referenceId))
									.limit(1)
							)
						)
					)
					.orderBy(desc(chat.createdAt))
					.limit(extendedLimit)
			);

			const hasMore = filteredChats.length > limit;
			return {
				chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
				hasMore,
			};
		} else {
			// Simple case - no pagination
			const filteredChats = await withTimeout(
				db
					.select()
					.from(chat)
					.where(eq(chat.userId, id))
					.orderBy(desc(chat.createdAt))
					.limit(extendedLimit)
			);

			const hasMore = filteredChats.length > limit;
			return {
				chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
				hasMore,
			};
		}
	} catch (error) {
		if (error instanceof Error && error.message === "Database query timeout") {
			throw new ChatSDKError(
				"offline:database",
				"Database query timed out - request canceled to prevent hanging"
			);
		}
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get chats by user id"
		);
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const [selectedChat] = await withTimeout(
			db.select().from(chat).where(eq(chat.id, id))
		);
		return selectedChat;
	} catch (error) {
		if (error instanceof Error && error.message === "Database query timeout") {
			throw new ChatSDKError(
				"offline:database",
				"Database query timed out - request canceled to prevent hanging"
			);
		}
		throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
	}
}

export async function saveMessages({
	messages,
}: {
	messages: Array<DBMessage>;
}) {
	try {
		return await db.insert(message).values(messages);
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to save messages");
	}
}

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		return await db
			.select()
			.from(message)
			.where(eq(message.chatId, id))
			.orderBy(asc(message.createdAt));
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get messages by chat id"
		);
	}
}

export async function voteMessage({
	chatId,
	messageId,
	type,
}: {
	chatId: string;
	messageId: string;
	type: "up" | "down";
}) {
	try {
		const [existingVote] = await withTimeout(
			db
				.select()
				.from(vote)
				.where(and(eq(vote.messageId, messageId)))
		);

		if (existingVote) {
			return await withTimeout(
				db
					.update(vote)
					.set({ isUpvoted: type === "up" })
					.where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)))
			);
		}
		return await withTimeout(
			db.insert(vote).values({
				chatId,
				messageId,
				isUpvoted: type === "up",
			})
		);
	} catch (error) {
		if (error instanceof Error && error.message === "Database query timeout") {
			throw new ChatSDKError(
				"offline:database",
				"Database query timed out - request canceled to prevent hanging"
			);
		}
		throw new ChatSDKError("bad_request:database", "Failed to vote message");
	}
}

export async function getVotesByChatId({ id }: { id: string }) {
	try {
		return await withTimeout(db.select().from(vote).where(eq(vote.chatId, id)));
	} catch (error) {
		if (error instanceof Error && error.message === "Database query timeout") {
			throw new ChatSDKError(
				"offline:database",
				"Database query timed out - request canceled to prevent hanging"
			);
		}
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get votes by chat id"
		);
	}
}

export async function saveDocument({
	id,
	title,
	kind,
	content,
	userId,
}: {
	id: string;
	title: string;
	kind: ArtifactKind;
	content: string;
	userId: string;
}) {
	try {
		return await db
			.insert(document)
			.values({
				id,
				title,
				kind,
				content,
				userId,
				createdAt: new Date(),
			})
			.returning();
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to save document");
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const documents = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(asc(document.createdAt));

		return documents;
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get documents by id"
		);
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const [selectedDocument] = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(desc(document.createdAt));

		return selectedDocument;
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get document by id"
		);
	}
}

export async function deleteDocumentsByIdAfterTimestamp({
	id,
	timestamp,
}: {
	id: string;
	timestamp: Date;
}) {
	try {
		await db
			.delete(suggestion)
			.where(
				and(
					eq(suggestion.documentId, id),
					gt(suggestion.documentCreatedAt, timestamp)
				)
			);

		return await db
			.delete(document)
			.where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
			.returning();
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete documents by id after timestamp"
		);
	}
}

export async function saveSuggestions({
	suggestions,
}: {
	suggestions: Array<Suggestion>;
}) {
	try {
		return await db.insert(suggestion).values(suggestions);
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to save suggestions"
		);
	}
}

export async function getSuggestionsByDocumentId({
	documentId,
}: {
	documentId: string;
}) {
	try {
		return await db
			.select()
			.from(suggestion)
			.where(and(eq(suggestion.documentId, documentId)));
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get suggestions by document id"
		);
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		return await db.select().from(message).where(eq(message.id, id));
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message by id"
		);
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp,
}: {
	chatId: string;
	timestamp: Date;
}) {
	try {
		const messagesToDelete = await db
			.select({ id: message.id })
			.from(message)
			.where(
				and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
			);

		const messageIds = messagesToDelete.map((message) => message.id);

		if (messageIds.length > 0) {
			await db
				.delete(vote)
				.where(
					and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
				);

			return await db
				.delete(message)
				.where(
					and(eq(message.chatId, chatId), inArray(message.id, messageIds))
				);
		}
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete messages by chat id after timestamp"
		);
	}
}

export async function updateChatVisiblityById({
	chatId,
	visibility,
}: {
	chatId: string;
	visibility: "private" | "public";
}) {
	try {
		return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to update chat visibility by id"
		);
	}
}

export async function getMessageCountByUserId({
	id,
	differenceInHours,
}: {
	id: string;
	differenceInHours: number;
}) {
	try {
		const twentyFourHoursAgo = new Date(
			Date.now() - differenceInHours * 60 * 60 * 1000
		);

		const [stats] = await db
			.select({ count: count(message.id) })
			.from(message)
			.innerJoin(chat, eq(message.chatId, chat.id))
			.where(
				and(
					eq(chat.userId, id),
					gte(message.createdAt, twentyFourHoursAgo),
					eq(message.role, "user")
				)
			)
			.execute();

		return stats?.count ?? 0;
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message count by user id"
		);
	}
}

export async function createStreamId({
	streamId,
	chatId,
}: {
	streamId: string;
	chatId: string;
}) {
	try {
		await db
			.insert(stream)
			.values({ id: streamId, chatId, createdAt: new Date() });
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to create stream id"
		);
	}
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
	try {
		const streamIds = await db
			.select({ id: stream.id })
			.from(stream)
			.where(eq(stream.chatId, chatId))
			.orderBy(asc(stream.createdAt))
			.execute();

		return streamIds.map(({ id }) => id);
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get stream ids by chat id"
		);
	}
}
