import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { qwen } from 'qwen-ai-provider';
import { portdex } from './portdex';

// Dynamic provider creation based on selected assistant
export const createDynamicProvider = (selectedAssistant?: { id: string; title: string } | null) => {
  const baseLanguageModels: Record<string, any> = {
    'chat-model': isTestEnvironment ? chatModel : qwen('qwen-plus-latest'),
    'chat-model-reasoning': isTestEnvironment 
      ? reasoningModel 
      : wrapLanguageModel({
          model: portdex('thinker'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
    'title-model': isTestEnvironment ? titleModel : portdex('maker'),
    'artifact-model': isTestEnvironment ? artifactModel : portdex('maker'),
  };

  // Add dynamic assistant model if one is selected
  if (selectedAssistant) {
    const assistantModelId = `assistant-${selectedAssistant.id}`;
    baseLanguageModels[assistantModelId] = isTestEnvironment 
      ? chatModel 
      : qwen('qwen-plus-latest');
  }

  return customProvider({
    languageModels: baseLanguageModels,
  });
};

export const myProvider = createDynamicProvider();

// Utility function to get the appropriate provider based on current context
export const getProviderForAssistant = (selectedAssistant?: { id: string; title: string } | null) => {
  return selectedAssistant ? createDynamicProvider(selectedAssistant) : myProvider;
};
