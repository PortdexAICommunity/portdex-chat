export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];

// Dynamic assistant model creation
export const createAssistantModel = (
  assistantId: string,
  assistantTitle: string,
): ChatModel => {
  return {
    id: `assistant-${assistantId}`,
    name: assistantTitle,
    description: `AI Assistant: ${assistantTitle}`,
  };
};

// Get all available models including dynamic assistant model
export const getAllChatModels = (
  selectedAssistant?: { id: string; title: string } | null,
): Array<ChatModel> => {
  const baseModels = [...chatModels];

  if (selectedAssistant) {
    const assistantModel = createAssistantModel(
      selectedAssistant.id,
      selectedAssistant.title,
    );
    return [assistantModel, ...baseModels];
  }

  return baseModels;
};

// Utility functions for assistant model validation
export const isAssistantModel = (modelId: string): boolean => {
  return modelId.startsWith('assistant-');
};

export const extractAssistantId = (modelId: string): string | null => {
  if (!isAssistantModel(modelId)) {
    return null;
  }
  return modelId.replace('assistant-', '');
};

export const isValidBaseModel = (modelId: string): boolean => {
  return chatModels.some((model) => model.id === modelId);
};
