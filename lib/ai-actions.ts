"use server";

import type { AIState } from "./ai-context";

// Server action for handling AI state updates
export async function handleAIStateUpdate({
	state,
	done,
}: {
	state: AIState;
	done: boolean;
}) {
	if (done) {
		// Save to database if needed
		console.log("AI state finalized:", state);
	}
}
