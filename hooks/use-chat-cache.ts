import { useEffect, useCallback } from "react";

interface CachedChat {
	id: string;
	title: string;
	createdAt: string;
	userId: string;
	visibility: "private" | "public";
}

interface CachedMessage {
	id: string;
	chatId: string;
	role: "user" | "assistant";
	content: string;
	createdAt: string;
}

const CHAT_CACHE_KEY = "maava_chat_cache";
const MESSAGE_CACHE_KEY = "maava_message_cache";
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

export function useChatCache() {
	const cacheChat = useCallback((chat: CachedChat) => {
		try {
			const cached = {
				...chat,
				cachedAt: Date.now(),
			};
			localStorage.setItem(
				`${CHAT_CACHE_KEY}_${chat.id}`,
				JSON.stringify(cached)
			);
		} catch (error) {
			console.error("Failed to cache chat:", error);
		}
	}, []);

	const getCachedChat = useCallback((chatId: string): CachedChat | null => {
		try {
			const cached = localStorage.getItem(`${CHAT_CACHE_KEY}_${chatId}`);
			if (!cached) return null;

			const parsed = JSON.parse(cached);
			const isExpired = Date.now() - parsed.cachedAt > CACHE_EXPIRY;

			if (isExpired) {
				localStorage.removeItem(`${CHAT_CACHE_KEY}_${chatId}`);
				return null;
			}

			return parsed;
		} catch (error) {
			console.error("Failed to get cached chat:", error);
			return null;
		}
	}, []);

	const cacheMessage = useCallback((message: CachedMessage) => {
		try {
			const cached = {
				...message,
				cachedAt: Date.now(),
			};
			localStorage.setItem(
				`${MESSAGE_CACHE_KEY}_${message.id}`,
				JSON.stringify(cached)
			);
		} catch (error) {
			console.error("Failed to cache message:", error);
		}
	}, []);

	const getCachedMessages = useCallback((chatId: string): CachedMessage[] => {
		try {
			const messages: CachedMessage[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith(MESSAGE_CACHE_KEY)) {
					const cached = localStorage.getItem(key);
					if (cached) {
						const parsed = JSON.parse(cached);
						const isExpired = Date.now() - parsed.cachedAt > CACHE_EXPIRY;

						if (isExpired) {
							localStorage.removeItem(key);
						} else if (parsed.chatId === chatId) {
							messages.push(parsed);
						}
					}
				}
			}
			return messages.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
		} catch (error) {
			console.error("Failed to get cached messages:", error);
			return [];
		}
	}, []);

	const clearChatCache = useCallback((chatId: string) => {
		try {
			localStorage.removeItem(`${CHAT_CACHE_KEY}_${chatId}`);
			// Clear related messages
			for (let i = localStorage.length - 1; i >= 0; i--) {
				const key = localStorage.key(i);
				if (key?.startsWith(MESSAGE_CACHE_KEY)) {
					const cached = localStorage.getItem(key);
					if (cached) {
						const parsed = JSON.parse(cached);
						if (parsed.chatId === chatId) {
							localStorage.removeItem(key);
						}
					}
				}
			}
		} catch (error) {
			console.error("Failed to clear chat cache:", error);
		}
	}, []);

	const clearExpiredCache = useCallback(() => {
		try {
			for (let i = localStorage.length - 1; i >= 0; i--) {
				const key = localStorage.key(i);
				if (
					key?.startsWith(CHAT_CACHE_KEY) ||
					key?.startsWith(MESSAGE_CACHE_KEY)
				) {
					const cached = localStorage.getItem(key);
					if (cached) {
						const parsed = JSON.parse(cached);
						const isExpired = Date.now() - parsed.cachedAt > CACHE_EXPIRY;
						if (isExpired) {
							localStorage.removeItem(key);
						}
					}
				}
			}
		} catch (error) {
			console.error("Failed to clear expired cache:", error);
		}
	}, []);

	// Clear expired cache on mount
	useEffect(() => {
		clearExpiredCache();
	}, [clearExpiredCache]);

	return {
		cacheChat,
		getCachedChat,
		cacheMessage,
		getCachedMessages,
		clearChatCache,
		clearExpiredCache,
	};
}
