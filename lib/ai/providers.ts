import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";
import {
	artifactModel,
	chatModel,
	reasoningModel,
	titleModel,
} from "./models.test";
import { qwen } from "qwen-ai-provider";
// import { portdex } from "./portdex";
import { deepseek } from "@ai-sdk/deepseek";
import { anthropic } from "@ai-sdk/anthropic";

// Dynamic provider creation based on selected assistant
export const createDynamicProvider = (
	selectedAssistant?: { id: string; title: string } | null
) => {
	const baseLanguageModels: Record<string, any> = {
		"chat-model": isTestEnvironment ? chatModel : qwen("qwen-plus-latest"),
		"chat-model-automate": isTestEnvironment
			? reasoningModel
			: deepseek("deepseek-chat"),
		"title-model": isTestEnvironment ? titleModel : deepseek("deepseek-chat"),
		"artifact-model": isTestEnvironment
			? artifactModel
			: deepseek("deepseek-chat"),
	};

	// Add dynamic assistant model if one is selected
	if (selectedAssistant) {
		const assistantModelId = `assistant-${selectedAssistant.id}`;
		baseLanguageModels[assistantModelId] = isTestEnvironment
			? chatModel
			: deepseek("deepseek-chat");
	}

	return customProvider({
		languageModels: baseLanguageModels,
	});
};

export const myProvider = createDynamicProvider();

// Utility function to get the appropriate provider based on current context
export const getProviderForAssistant = (
	selectedAssistant?: { id: string; title: string } | null
) => {
	return selectedAssistant
		? createDynamicProvider(selectedAssistant)
		: myProvider;
};
