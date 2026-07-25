"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Send, Loader2, Leaf, Sparkles } from "lucide-react";

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
        "Welcome to Bud Seeker. Tell me the kind of experience you want, and I’ll help narrow down the right products from today’s High Society MN menu.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const openBudSeeker = () => setOpen(true);
    window.addEventListener("bud-seeker:open", openBudSeeker);
    return () => window.removeEventListener("bud-seeker:open", openBudSeeker);
  }, []);

  const quickPrompts = [
    "Help me unwind",
    "Something social",
    "Low-dose options",
    "What’s new?",
  ];

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
      if (!res.ok) throw new Error(data.error || "Bud Seeker is unavailable.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, I couldn't get a response. Please try again!",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Connection error — please try again in a moment.",
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-black shadow-lg hover:bg-indigo-400 transition-all hover:scale-105"
        aria-label={open ? "Close Bud Seeker" : "Open Bud Seeker"}
      >
        {open ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Bud Seeker</p>
              <p className="text-xs text-indigo-300">Personal product finder</p>
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
                      ? "bg-indigo-500 text-black rounded-br-sm"
                      : "bg-indigo-50 text-slate-950 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-indigo-50 text-slate-950 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="border-t border-slate-200 px-4 py-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                Start with a vibe
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200 transition-colors hover:bg-indigo-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-200 bg-indigo-50/90 px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What kind of experience are you seeking?"
              className="flex-1 rounded-xl bg-indigo-50 px-4 py-2 text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-black disabled:opacity-40 hover:bg-indigo-400 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="flex items-center justify-center gap-1 text-center text-xs text-slate-500 pb-2">
            <Leaf className="h-3 w-3" /> 21+ only · Not medical advice
          </p>
        </div>
      )}
    </>
  );
}
