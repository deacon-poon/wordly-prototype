"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SessionContext {
  title: string;
  presenters: string[];
  summary: string;
  scheduledDate: string;
  scheduledStart: string;
  locationName: string;
}

interface EventChatbotProps {
  eventName: string;
  eventDescription: string;
  sessions: SessionContext[];
  /** Optional: Control open state externally */
  open?: boolean;
  /** Optional: Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional: Initial message to send when chat opens */
  initialMessage?: string;
}

export function EventChatbot({
  eventName,
  eventDescription,
  sessions,
  open,
  onOpenChange,
  initialMessage,
}: EventChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Support both controlled and uncontrolled modes
  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    setInternalIsOpen(value);
    onOpenChange?.(value);
  };
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    body: {
      eventContext: {
        eventName,
        description: eventDescription,
        sessions,
      },
    },
  });

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi! I'm your AI assistant for ${eventName}. I can help you explore the session summaries, find talks on specific topics, or answer questions about the presentations. What would you like to know?`,
        },
      ]);
    }
  }, [eventName, messages.length, setMessages]);

  // Handle initial message when chat opens
  const [hasHandledInitialMessage, setHasHandledInitialMessage] =
    useState(false);
  useEffect(() => {
    if (
      isOpen &&
      initialMessage &&
      !hasHandledInitialMessage &&
      messages.length > 0
    ) {
      sendMessage(initialMessage);
      setHasHandledInitialMessage(true);
    }
  }, [
    isOpen,
    initialMessage,
    hasHandledInitialMessage,
    messages.length,
    sendMessage,
  ]);

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          "bg-primary-teal-600 hover:bg-primary-teal-700 text-white",
          "flex items-center justify-center",
          "hover:scale-105 active:scale-95"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary-teal-600 text-white px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Event Assistant</h3>
            <p className="text-xs text-white/80">
              Ask about sessions & summaries
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-primary-teal-600 text-white"
                    : "bg-white border border-gray-200 text-primary-teal-600"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  message.role === "user"
                    ? "bg-primary-teal-600 text-white rounded-tr-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.parts
                    ? message.parts
                        .filter(
                          (part): part is { type: "text"; text: string } =>
                            part.type === "text"
                        )
                        .map((part) => part.text)
                        .join("")
                    : message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-4 w-4 text-primary-teal-600 animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              Something went wrong. Please try again.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the event..."
              className="flex-1 px-4 py-2.5 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-teal-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full p-0 bg-primary-teal-600 hover:bg-primary-teal-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Powered by Wordly AI
          </p>
        </form>
      </div>
    </>
  );
}
