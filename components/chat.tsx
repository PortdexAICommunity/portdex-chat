"use client";

import { ChatHeader } from "@/components/chat-header";
import { useArtifactSelector } from "@/hooks/use-artifact";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import type { Vote } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import { fetcher, fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import type { Attachment, UIMessage } from "ai";
import type { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { Artifact } from "./artifact";
import { HomeMarketplace } from "./marketplace/home-marketplace";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";
import type { VisibilityType } from "./visibility-selector";

export function Chat({
	id,
	initialMessages,
	initialChatModel,
	initialVisibilityType,
	isReadonly,
	session,
	autoResume,
}: {
	id: string;
	initialMessages: Array<UIMessage>;
	initialChatModel: string;
	initialVisibilityType: VisibilityType;
	isReadonly: boolean;
	session: Session;
	autoResume: boolean;
}) {
	const { mutate } = useSWRConfig();

	const { visibilityType } = useChatVisibility({
		chatId: id,
		initialVisibilityType,
	});

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		status,
		stop,
		reload,
		experimental_resume,
		data,
	} = useChat({
		id,
		initialMessages,
		experimental_throttle: 100,
		sendExtraMessageFields: true,
		generateId: generateUUID,
		fetch: fetchWithErrorHandlers,
		experimental_prepareRequestBody: (body) => ({
			id,
			message: body.messages.at(-1),
			selectedChatModel: initialChatModel,
			selectedVisibilityType: visibilityType,
		}),
		onFinish: () => {
			mutate(unstable_serialize(getChatHistoryPaginationKey));
		},
		onError: (error) => {
			if (error instanceof ChatSDKError) {
				toast({
					type: "error",
					description: error.message,
				});
			}
		},
	});

	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

	useEffect(() => {
		if (query && !hasAppendedQuery) {
			append({
				role: "user",
				content: query,
			});

			setHasAppendedQuery(true);
			window.history.replaceState({}, "", `/chat/${id}`);
		}
	}, [query, append, hasAppendedQuery, id]);

	const { data: votes } = useSWR<Array<Vote>>(
		messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
		fetcher as any
	);

	const [attachments, setAttachments] = useState<Array<Attachment>>([]);
	const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

	useAutoResume({
		autoResume,
		initialMessages,
		experimental_resume,
		data,
		setMessages,
	});

	console.log("msg", messages);

	return (
		<>
			<div className="flex flex-col min-w-0 h-dvh bg-background">
				<ChatHeader
					chatId={id}
					selectedModelId={initialChatModel}
					selectedVisibilityType={initialVisibilityType}
					isReadonly={isReadonly}
					session={session}
				/>

				{messages.length !== 0 && (
					<Messages
						chatId={id}
						status={status}
						votes={votes}
						messages={messages}
						setMessages={setMessages}
						reload={reload}
						isReadonly={isReadonly}
						isArtifactVisible={isArtifactVisible}
					/>
				)}

				<div className="min-h-[50dvh] flex items-center justify-center">
					<form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
						{!isReadonly && (
							<MultimodalInput
								chatId={id}
								input={input}
								setInput={setInput}
								handleSubmit={handleSubmit}
								status={status}
								stop={stop}
								attachments={attachments}
								setAttachments={setAttachments}
								messages={messages}
								setMessages={setMessages}
								append={append}
								selectedVisibilityType={visibilityType}
							/>
						)}
					</form>
				</div>

				{messages.length === 0 && (
					<div className="max-w-7xl mx-auto bg-sidebar my-14 rounded-lg p-10">
						<HomeMarketplace />
					</div>
				)}
			</div>

			<Artifact
				chatId={id}
				input={input}
				setInput={setInput}
				handleSubmit={handleSubmit}
				status={status}
				stop={stop}
				attachments={attachments}
				setAttachments={setAttachments}
				append={append}
				messages={messages}
				setMessages={setMessages}
				reload={reload}
				votes={votes}
				isReadonly={isReadonly}
				selectedVisibilityType={visibilityType}
			/>
		</>
	);
}
