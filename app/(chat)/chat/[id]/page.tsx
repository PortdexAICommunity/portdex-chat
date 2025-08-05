import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "@/lib/amplify-server";

import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
// import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import type { DBMessage } from "@/lib/db/schema";
import type { Attachment, UIMessage } from "ai";

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const { getChatById, getMessagesByChatId } = await import("@/lib/db/queries");
	const params = await props.params;
	const { id } = params;
	const chat = await getChatById({ id });

	if (!chat) {
		notFound();
	}

	const session = await getServerSession();

	// For now, allow guest access - the client-side auth will handle session management
	// if (!session || session.user.type === 'guest') {
	// 	redirect("/login");
	// }

	if (chat.visibility === "private") {
		if (!session?.user || session.user.type === "guest") {
			return notFound();
		}

		if (session.user.id !== chat.userId) {
			return notFound();
		}
	}

	const messagesFromDb = await getMessagesByChatId({
		id,
	});

	function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
		return messages.map((message) => ({
			id: message.id,
			parts: message.parts as UIMessage["parts"],
			role: message.role as UIMessage["role"],
			// Note: content will soon be deprecated in @ai-sdk/react
			content: "",
			createdAt: message.createdAt,
			experimental_attachments:
				(message.attachments as Array<Attachment>) ?? [],
		}));
	}

	const cookieStore = await cookies();
	const chatModelFromCookie = cookieStore.get("chat-model");

	const isReadonly =
		session?.user?.id !== chat.userId && chat.visibility === "private";

	if (!chatModelFromCookie) {
		return (
			<>
				<Chat
					id={chat.id}
					initialMessages={convertToUIMessages(messagesFromDb)}
					initialChatModel={DEFAULT_CHAT_MODEL}
					initialVisibilityType={chat.visibility}
					isReadonly={isReadonly}
					autoResume={true}
				/>
				<DataStreamHandler id={id} />
			</>
		);
	}

	return (
		<>
			<Chat
				id={chat.id}
				initialMessages={convertToUIMessages(messagesFromDb)}
				initialChatModel={chatModelFromCookie.value}
				initialVisibilityType={chat.visibility}
				isReadonly={isReadonly}
				autoResume={true}
			/>
			<DataStreamHandler id={id} />
		</>
	);
}
