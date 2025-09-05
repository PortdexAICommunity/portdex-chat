"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Search } from "lucide-react";

export function SimpleGenerativeChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    isProductSearch?: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    // Add user message
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMessageId,
      role: "user",
      content: userMessage,
    }]);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if this is a product search query
      const isProductQuery = /find|search|show|looking for|need|want/i.test(userMessage) &&
                           /headphones|chair|laptop|computer|electronics|furniture/i.test(userMessage);

      if (isProductQuery) {
        // Show product search results
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          role: "assistant",
          content: "Searching for products...",
          isProductSearch: true,
        }]);

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update with product results
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Here are the products I found for you:",
                isProductSearch: true,
              }
            : msg
        ));
      } else {
        // Regular response
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          role: "assistant",
          content: `I understand you're looking for: "${userMessage}". Try searching for products like "wireless headphones" or "office chairs" to see the Generative UI in action!`,
        }]);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Search className="mx-auto mb-4 size-12 opacity-50" />
            <p>Start by asking me to find products!</p>
            <p className="text-sm mt-2">Try: &quot;Find me wireless headphones&quot;</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "user" ? (
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl max-w-2xl">
                {message.content}
              </div>
            ) : message.isProductSearch ? (
              <div className="max-w-4xl w-full">
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="mb-4">{message.content}</p>

                  {/* Mock Product Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product 1 */}
                    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-foreground line-clamp-2">
                            Sony WH-1000XM4 Wireless Headphones
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sony Electronics
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            Electronics
                          </span>
                          <div className="text-lg font-bold text-green-600">
                            $349.99
                          </div>
                        </div>
                      </div>

                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                        <div className="size-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                          🎧
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        Industry-leading noise canceling with Dual Noise Sensor technology.
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(5/5)</span>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors">
                        View Details
                      </button>
                    </div>

                    {/* Product 2 */}
                    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-foreground line-clamp-2">
                            Herman Miller Aeron Chair
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Herman Miller
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                            Furniture
                          </span>
                          <div className="text-lg font-bold text-green-600">
                            $1,395.00
                          </div>
                        </div>
                      </div>

                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                        <div className="size-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600">
                          🪑
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        Ergonomic office chair with advanced PostureFit SL support.
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                          <span className="text-gray-300 text-sm">★</span>
                        </div>
                        <span className="text-xs text-muted-foreground">(4/5)</span>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🎨 <strong>This is Generative UI in action!</strong> The AI generated these rich product cards directly as React components instead of plain text.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted px-4 py-2 rounded-xl max-w-2xl">
                {message.content}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to find products..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
