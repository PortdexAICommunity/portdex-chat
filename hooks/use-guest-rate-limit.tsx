"use client";

import { useState, useEffect } from "react";
import { GUEST_MESSAGE_LIMIT } from "@/lib/ai/entitlements";

interface GuestMessageData {
	count: number;
	lastResetDate: string;
}

const STORAGE_KEY = "guest-message-count";

export const useGuestRateLimit = (isGuest: boolean) => {
	const [messageCount, setMessageCount] = useState(0);
	const [isLimitReached, setIsLimitReached] = useState(false);

	// Get current date string for daily reset
	const getCurrentDateString = () => {
		return new Date().toDateString();
	};

	// Get guest message data from localStorage
	const getGuestMessageData = (): GuestMessageData => {
		if (typeof window === "undefined") {
			return { count: 0, lastResetDate: getCurrentDateString() };
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				return { count: 0, lastResetDate: getCurrentDateString() };
			}

			const data: GuestMessageData = JSON.parse(stored);

			// Reset count if it's a new day
			if (data.lastResetDate !== getCurrentDateString()) {
				return { count: 0, lastResetDate: getCurrentDateString() };
			}

			return data;
		} catch (error) {
			console.error("Error reading guest message data:", error);
			return { count: 0, lastResetDate: getCurrentDateString() };
		}
	};

	// Save guest message data to localStorage
	const saveGuestMessageData = (data: GuestMessageData) => {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error("Error saving guest message data:", error);
		}
	};

	// Initialize message count on mount
	useEffect(() => {
		if (!isGuest) {
			setMessageCount(0);
			setIsLimitReached(false);
			return;
		}

		const data = getGuestMessageData();
		setMessageCount(data.count);
		setIsLimitReached(data.count >= GUEST_MESSAGE_LIMIT);
	}, [isGuest]);

	// Increment message count
	const incrementMessageCount = () => {
		if (!isGuest) return false;

		const data = getGuestMessageData();
		const newCount = data.count + 1;

		if (newCount > GUEST_MESSAGE_LIMIT) {
			setIsLimitReached(true);
			return false;
		}

		const newData: GuestMessageData = {
			count: newCount,
			lastResetDate: getCurrentDateString(),
		};

		saveGuestMessageData(newData);
		setMessageCount(newCount);
		setIsLimitReached(newCount >= GUEST_MESSAGE_LIMIT);

		return true;
	};

	// Check if user can send message
	const canSendMessage = () => {
		if (!isGuest) return true;

		const data = getGuestMessageData();
		return data.count < GUEST_MESSAGE_LIMIT;
	};

	// Get remaining messages
	const getRemainingMessages = () => {
		if (!isGuest) return null;

		return Math.max(0, GUEST_MESSAGE_LIMIT - messageCount);
	};

	return {
		messageCount,
		isLimitReached,
		canSendMessage,
		incrementMessageCount,
		getRemainingMessages,
		maxMessages: GUEST_MESSAGE_LIMIT,
	};
};
