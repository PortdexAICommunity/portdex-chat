"use server";

import { streamUI, getMutableAIState } from "ai/rsc";
import { searchProductsGenerative } from "@/lib/ai/tools/search-products-generative";
import { deepseek } from "@ai-sdk/deepseek";

export async function generateResponse(message: string) {
	const messages = getMutableAIState();

	messages.update([...messages.get(), { role: "user", content: message }]);

	const result = await streamUI({
		model: deepseek("deepseek-chat"),
		system: "You are a helpful assistant with access to product search tools.",
		messages: messages.get(),
		text: async function* ({
			content,
			done,
		}: {
			content: string;
			done: boolean;
		}) {
			if (done) {
				messages.done((messages: any) => [
					...messages,
					{ role: "assistant", content },
				]);
			}
			return content;
		},
		tools: {
			searchProducts: searchProductsGenerative,
		},
	});

	return result.value;
}
