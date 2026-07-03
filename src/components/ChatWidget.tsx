"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Leaf } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your High Society MN budtender. Ask me anything about our products, strains, dosing, store hours, or today's drops!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, I couldn't get a response. Please try again!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error — please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg hover:bg-amber-400 transition-all hover:scale-105"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col w-80 sm:w-96 rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-black/60 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500">
              <Leaf className="h-4 w-4 text-black" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">HS Budtender</p>
              <p className="text-xs text-green-400">● Online now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-black rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, drops, hours…"
              className="flex-1 rounded-xl bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-black disabled:opacity-40 hover:bg-amber-400 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 pb-2">21+ only · Not medical advice</p>
        </div>
      )}
    </>
  );
}
