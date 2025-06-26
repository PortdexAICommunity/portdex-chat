import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ['chat-model', 'chat-model-reasoning'],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ['chat-model', 'chat-model-reasoning'],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};

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
      availableChatModelIds: [assistantModelId, ...baseEntitlements.availableChatModelIds],
    };
  }
  
  return baseEntitlements;
};
