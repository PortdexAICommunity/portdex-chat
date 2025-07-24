type UserType = "guest" | "regular";

import type { ChatModel } from "./models";

interface Entitlements {
	maxMessagesPerDay: number;
	availableChatModelIds: Array<ChatModel["id"]>;
}

// Configurable rate limits - change these numbers to update limits
const GUEST_MESSAGE_LIMIT = 3;
const REGULAR_USER_MESSAGE_LIMIT = 100;

export const entitlementsByUserType: Record<UserType, Entitlements> = {
	/*
	 * For users without an account
	 */
	guest: {
		maxMessagesPerDay: GUEST_MESSAGE_LIMIT,
		availableChatModelIds: ["chat-model", "chat-model-reasoning"],
	},

	/*
	 * For users with an account
	 */
	regular: {
		maxMessagesPerDay: REGULAR_USER_MESSAGE_LIMIT,
		availableChatModelIds: ["chat-model", "chat-model-reasoning"],
	},

	/*
	 * TODO: For users with an account and a paid membership
	 */
};

// Export the constants for use in other parts of the application
export { GUEST_MESSAGE_LIMIT, REGULAR_USER_MESSAGE_LIMIT };

// Dynamic entitlements that include assistant models
export const getDynamicEntitlements = (
	userType: UserType,
	selectedAssistant?: { id: string; title: string } | null
): Entitlements => {
	const baseEntitlements = entitlementsByUserType[userType];

	if (selectedAssistant) {
		const assistantModelId = `assistant-${selectedAssistant.id}`;
		return {
			...baseEntitlements,
			availableChatModelIds: [
				assistantModelId,
				...baseEntitlements.availableChatModelIds,
			],
		};
	}

	return baseEntitlements;
};
