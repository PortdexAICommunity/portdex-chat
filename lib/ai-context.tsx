"use client";

import { createAI, getMutableAIState, useAIState, useUIState } from "ai/rsc";
import { ReactNode } from "react";
import { handleAIStateUpdate } from "./ai-actions";

// Define the AI state type
export interface AIState {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

// Define the UI state type
export interface UIState {
  messages: {
    id: string;
    role: "user" | "assistant";
    display: ReactNode;
  }[];
}

// Create the AI context
const AI = createAI<AIState, UIState>({
  actions: {
    // Actions will be defined in the route handler
  },
  initialAIState: {
    messages: [],
  },
  initialUIState: {
    messages: [],
  },
  onSetAIState: handleAIStateUpdate,
});

export const AIProvider = AI;

// Export hooks for use in components
export const useAIStateHook = useAIState;
export const useUIStateHook = useUIState;
export const getMutableAIStateHook = getMutableAIState;

// Export the AI instance for server actions
export { AI };
