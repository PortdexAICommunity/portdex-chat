"use client";

import { useState } from "react";
import { AIProvider, useUIStateHook, UIState } from "@/lib/ai-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

// Inner chat component that uses the AI context
function GenerativeChatInner({ chatId }: { chatId: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useUIStateHook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // Add user message to UI state
    const userMessageId = `user-${Date.now()}`;
    setMessages([
      ...messages,
      {
        id: userMessageId,
        role: "user",
        display: (
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-xl max-w-2xl">
            {userMessage}
          </div>
        ),
      },
    ]);

    try {
      // Call the chat API
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: chatId,
          message: {
            id: userMessageId,
            role: "user",
            content: userMessage,
            parts: [{ type: "text", text: userMessage }],
          },
          selectedChatModel: "chat-model",
          selectedVisibilityType: "private",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Add loading message for assistant
      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages((prevMessages: UIState["messages"]) => [
        ...prevMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          display: <div className="animate-pulse">Thinking...</div>,
        },
      ]);

      // For now, just show a simple response since streaming is complex
      // In a real implementation, you'd handle the streaming response properly
      setTimeout(() => {
        setMessages((prevMessages: UIState["messages"]) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  display: (
                    <div>
                      I&apos;ve processed your request for: &quot;{userMessage}&quot;
                      <br />
                      <br />
                      The searchProducts tool should now return rich UI components when you search for products!
                    </div>
                  ),
                }
              : msg
          )
        );
      }, 1000);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prevMessages: UIState["messages"]) => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          display: (
            <div className="text-red-600">
              Sorry, there was an error processing your request: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-2xl">{message.display}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// Main wrapper component with AI Provider
export function GenerativeChat({ chatId }: { chatId: string }) {
  return (
    <AIProvider>
      <GenerativeChatInner chatId={chatId} />
    </AIProvider>
  );
}
