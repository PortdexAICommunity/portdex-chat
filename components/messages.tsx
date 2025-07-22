import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import equal from "fast-deep-equal";
import { motion } from "framer-motion";
import { memo } from "react";
import { Spotlight } from "./animation/spotlight";
import { AnimatedBadge } from "./animation/shinny-badge";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import type { HomeMarketplaceItem } from "@/lib/types";

interface MessagesProps {
	chatId: string;
	status: UseChatHelpers["status"];
	votes: Array<Vote> | undefined;
	messages: Array<UIMessage>;
	setMessages: UseChatHelpers["setMessages"];
	reload: UseChatHelpers["reload"];
	isReadonly: boolean;
	isArtifactVisible: boolean;
	selectedAssistant: HomeMarketplaceItem | null;
}

function PureMessages({
	chatId,
	status,
	votes,
	messages,
	setMessages,
	reload,
	isReadonly,
	selectedAssistant,
}: MessagesProps) {
	const {
		containerRef: messagesContainerRef,
		endRef: messagesEndRef,
		onViewportEnter,
		onViewportLeave,
		hasSentMessage,
	} = useMessages({
		chatId,
		status,
	});

	// Clean, centered layout when no messages (Lovable-style)
	if (messages.length === 0) {
		return (
			<div className="relative flex flex-col items-center justify-center min-h-[40vh] px-4 overflow-hidden">
				{/* Animated Spotlight Background - Hidden on Mobile */}
				<div className="hidden md:block">
					<Spotlight
						gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(257, 100%, 85%, .12) 0, hsla(257, 100%, 55%, .04) 50%, hsla(257, 100%, 45%, 0) 80%)"
						gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(257, 100%, 85%, .08) 0, hsla(257, 100%, 55%, .03) 80%, transparent 100%)"
						gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(257, 100%, 85%, .06) 0, hsla(257, 100%, 45%, .02) 80%, transparent 100%)"
						translateY={-250}
						width={460}
						height={1180}
						smallWidth={180}
						duration={8}
						xOffset={80}
					/>
				</div>

				{/* Content */}
				<div className="relative z-50 w-full max-w-4xl mx-auto text-center space-y-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="space-y-3"
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
							Get started with{" "}
							<span className="text-purple-500 font-bold font-sans">
								Portdex Chat
							</span>
							<br />{" "}
							{selectedAssistant
								? selectedAssistant.title
								: "A Financial and Web3.0 AI"}
						</h1>
						<p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
							{selectedAssistant
								? selectedAssistant.description
								: "👋 Access 100+ Powerful AI Agents - All in One Place 🌟"}
						</p>

						{/* Use Cases with Shinny Badges */}
						{selectedAssistant &&
							selectedAssistant.useCases &&
							selectedAssistant.useCases.length > 0 && (
								<div className="flex flex-wrap justify-center gap-2 mt-4">
									{selectedAssistant.useCases.map((useCase, index) => (
										<AnimatedBadge
											key={index}
											text={useCase}
											className="text-sm"
										/>
									))}
								</div>
							)}
					</motion.div>
				</div>
			</div>
		);
	}

	// Standard messages layout when conversation exists
	return (
		<div
			ref={messagesContainerRef}
			className="flex flex-col min-w-0 gap-4 flex-1 overflow-y-scroll pt-4 relative no-scrollbar"
		>
			{messages.map((message, index) => (
				<PreviewMessage
					key={message.id}
					chatId={chatId}
					message={message}
					isLoading={status === "streaming" && messages.length - 1 === index}
					vote={
						votes
							? votes.find((vote) => vote.messageId === message.id)
							: undefined
					}
					setMessages={setMessages}
					reload={reload}
					isReadonly={isReadonly}
					requiresScrollPadding={
						hasSentMessage && index === messages.length - 1
					}
				/>
			))}

			{status === "submitted" &&
				messages.length > 0 &&
				messages[messages.length - 1].role === "user" && <ThinkingMessage />}

			<motion.div
				ref={messagesEndRef}
				className="shrink-0 min-w-[24px] min-h-[24px]"
				onViewportLeave={onViewportLeave}
				onViewportEnter={onViewportEnter}
			/>
		</div>
	);
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
	if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

	if (prevProps.status !== nextProps.status) return false;
	if (prevProps.status && nextProps.status) return false;
	if (prevProps.messages.length !== nextProps.messages.length) return false;
	if (!equal(prevProps.messages, nextProps.messages)) return false;
	if (!equal(prevProps.votes, nextProps.votes)) return false;
	if (!equal(prevProps.selectedAssistant, nextProps.selectedAssistant))
		return false;

	return true;
});
