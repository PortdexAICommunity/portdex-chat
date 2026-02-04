# Generative UI Implementation Guide

This guide explains how to implement Generative UI with Vercel AI SDK v4 in your Next.js application, using the `searchProducts` tool as an example.

## Overview

Generative UI allows AI models to return React components directly instead of just text or data. This creates more interactive and dynamic user interfaces that can respond to user queries with rich, structured content.

## Key Components

### 1. AI Context Provider (`lib/ai-context.tsx`)

Manages both UI state and AI state for the application:

- Uses `createAI` from `ai/rsc` to create a context provider
- Manages conversation history and UI rendering state
- Provides hooks for accessing and updating state

### 2. Generative Tool (`lib/ai/tools/search-products-generative.tsx`)

A tool that returns React components instead of data:

- Uses `createStreamableUI` for streaming UI components
- Implements loading states and final result rendering
- Returns fully styled React components

### 3. Updated Route Handler (`app/(chat)/api/chat/route.ts`)

Modified to use the generative tool:

- Imports the generative version of `searchProducts`
- Maintains compatibility with existing infrastructure
- Streams responses with tool-generated UI

### 4. Updated Message Component (`components/message.tsx`)

Modified to handle the new Generative UI approach:

- Shows loading state for tool calls
- Removes old result handling for generative tools
- Maintains compatibility with existing tools

### 5. Generative Chat Component (`components/generative-chat.tsx`)

A complete chat interface with AI context:

- Wraps the chat in `AIProvider`
- Manages message state and streaming
- Handles tool-generated UI components

## How It Works

### 1. Tool Definition

```typescript
export const searchProductsGenerative = {
  description: "Search for products based on user query...",
  parameters: z.object({
    query: z.string().describe("The search query for products"),
    // ... other parameters
  }),
  generate: async function* ({ query, category, maxResults }) {
    // Yield loading state first
    yield <ProductSearchLoading query={query} />;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process results and return final component
    return <ProductSearchResults products={filteredProducts} ... />;
  },
};
```

### 2. Route Handler Integration

```typescript
const result = streamText({
	model: provider.languageModel(selectedChatModel),
	// ... other config
	tools: {
		searchProducts: searchProductsGenerative,
		// ... other tools
	},
});
```

### 3. Message Rendering

The AI model can now call the `searchProducts` tool and return rich UI components directly in the chat stream.

## Key Benefits

1. **Rich UI Components**: Instead of parsing text responses, users get fully styled, interactive components
2. **Loading States**: Progressive enhancement with loading indicators
3. **Type Safety**: Full TypeScript support for component props
4. **Streaming**: Components can be streamed progressively as data becomes available
5. **Consistency**: UI components match your design system

## Testing

Visit `/generative-test` to test the Generative UI implementation. Try queries like:

- "Find me wireless headphones"
- "Show me office chairs under $500"
- "Search for gaming laptops"

## Usage in Your App

### Option 1: Replace Existing Chat

Update your main chat page to use the `GenerativeChat` component:

```tsx
import { GenerativeChat } from "@/components/generative-chat";

export default function ChatPage({ params }: { params: { id: string } }) {
	return <GenerativeChat chatId={params.id} />;
}
```

### Option 2: Gradual Migration

Keep your existing chat infrastructure and add Generative UI support:

```tsx
// In your existing chat route
import { searchProductsGenerative } from "@/lib/ai/tools/search-products-generative";

// Use alongside existing tools
tools: {
  searchProducts: searchProductsGenerative,
  // ... existing tools
}
```

## Best Practices

1. **Progressive Enhancement**: Always show loading states first
2. **Error Handling**: Implement error boundaries for tool-generated components
3. **Performance**: Use `React.memo` and lazy loading for heavy components
4. **Accessibility**: Ensure all generated components are accessible
5. **Testing**: Test both the tool logic and the generated UI components

## Troubleshooting

### Common Issues

1. **JSX in Server Components**: Make sure your tools are properly typed for server-side rendering
2. **Streaming Issues**: Ensure your components can handle streaming data
3. **State Management**: Use the AI context properly for state synchronization

### Debug Tips

1. Check the browser console for streaming errors
2. Verify that tools are being called correctly
3. Test components in isolation before integrating
4. Use React DevTools to inspect generated components

## Next Steps

1. **Add More Tools**: Convert other tools to use Generative UI
2. **Enhance Components**: Add more interactive features to generated components
3. **State Persistence**: Implement proper state persistence for chat sessions
4. **Testing**: Add comprehensive tests for Generative UI functionality

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Generative UI Guide](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces)
- [AI SDK RSC](https://sdk.vercel.ai/docs/ai-sdk-rsc/overview)
