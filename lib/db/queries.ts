"use server";

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
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

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

export async function getUserById(id: string): Promise<User | null> {
	try {
		const users = await db.select().from(user).where(eq(user.id, id));
		return users.length > 0 ? users[0] : null;
	} catch (error) {
		console.error("Failed to get user by ID:", error);
		return null;
	}
}

export async function createUser(id: string, email: string) {
	try {
		// First check if user already exists by ID
		const existingUserById = await getUserById(id);
		if (existingUserById) {
			console.log(`User with ID ${id} already exists`);
			return existingUserById;
		}

		// Then check if user exists by email
		const existingUsersByEmail = await getUser(email);
		if (existingUsersByEmail.length > 0) {
			console.log(`User with email ${email} already exists`);
			return existingUsersByEmail[0];
		}

		// Create new user with specified ID
		const result = await db
			.insert(user)
			.values({
				id,
				email,
				// Remove is_guest since it doesn't exist in the database
			})
			.returning();

		console.log(`Created new user: ${id}, ${email}`);
		return result[0];
	} catch (error) {
		console.error("Failed to create user:", error);
		throw new ChatSDKError("bad_request:database", "Failed to create user");
	}
}

export async function getChat(id: string, userId: string): Promise<Chat> {
	const result = await db
		.select()
		.from(chat)
		.where(and(eq(chat.id, id), eq(chat.userId, userId)));

	if (result.length === 0) {
		throw new ChatSDKError(
			"not_found:database",
			`Chat with id ${id} not found for user ${userId}`
		);
	}

	return result[0];
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
		// Check if user exists first
		const existingUser = await getUserById(userId);
		if (!existingUser) {
			console.error("User not found when saving chat:", userId);
			throw new Error(`User with id ${userId} not found`);
		}

		return await db.insert(chat).values({
			id,
			createdAt: new Date(),
			userId,
			title,
			visibility,
		});
	} catch (error) {
		console.error("Database error in saveChat:", error);
		console.error("saveChat parameters:", { id, userId, title, visibility });
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

		const query = (whereCondition?: SQL<any>) =>
			db
				.select()
				.from(chat)
				.where(
					whereCondition
						? and(whereCondition, eq(chat.userId, id))
						: eq(chat.userId, id)
				)
				.orderBy(desc(chat.createdAt))
				.limit(extendedLimit);

		let filteredChats: Array<Chat> = [];

		if (startingAfter) {
			const [selectedChat] = await db
				.select()
				.from(chat)
				.where(eq(chat.id, startingAfter))
				.limit(1);

			if (!selectedChat) {
				throw new ChatSDKError(
					"not_found:database",
					`Chat with id ${startingAfter} not found`
				);
			}

			filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
		} else if (endingBefore) {
			const [selectedChat] = await db
				.select()
				.from(chat)
				.where(eq(chat.id, endingBefore))
				.limit(1);

			if (!selectedChat) {
				throw new ChatSDKError(
					"not_found:database",
					`Chat with id ${endingBefore} not found`
				);
			}

			filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
		} else {
			filteredChats = await query();
		}

		const hasMore = filteredChats.length > limit;

		return {
			chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
			hasMore,
		};
	} catch (error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get chats by user id"
		);
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
		return selectedChat;
	} catch (error) {
		throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
	}
}

export async function saveMessages({
	messages,
}: {
	messages: Array<DBMessage>;
}) {
	try {
		// Check if all referenced chats exist
		if (messages.length > 0) {
			const chatIds = [...new Set(messages.map((m) => m.chatId))];
			for (const chatId of chatIds) {
				const [existingChat] = await db
					.select()
					.from(chat)
					.where(eq(chat.id, chatId));
				if (!existingChat) {
					console.error("Chat not found when saving messages:", chatId);
					throw new Error(`Chat with id ${chatId} not found`);
				}
			}
		}

		return await db.insert(message).values(messages);
	} catch (error) {
		console.error("Database error in saveMessages:", error);
		console.error("saveMessages parameters:", { messages });
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
		const [existingVote] = await db
			.select()
			.from(vote)
			.where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));

		if (existingVote) {
			return await db
				.update(vote)
				.set({ isUpvoted: type === "up" })
				.where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
		}
		return await db.insert(vote).values({
			chatId,
			messageId,
			isUpvoted: type === "up",
		});
	} catch (error) {
		console.error("Error in voteMessage:", error);
		throw new ChatSDKError("bad_request:database", "Failed to vote message");
	}
}

export async function getVotesByChatId({ id }: { id: string }) {
	try {
		return await db.select().from(vote).where(eq(vote.chatId, id));
	} catch (error) {
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
