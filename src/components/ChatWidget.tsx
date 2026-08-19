"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Crown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function sanitizeAssistantContent(content: string) {
  // Remove internal tool/status chatter that can appear before the final answer.
  return content
    .replace(/\bReceived task\b[\s\S]*?(?=\n|\r|$)/gi, "")
    .replace(/Configure (OPENAI_API_KEY|ANTHROPIC_API_KEY) for full AI responses\.?/gi, "")
    .trim();
}


export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Yo, welcome in. I'm your budtender. Tell me the vibe, flavor, or potency you're after and I'll help you find something fresh on today's menu.",
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
      if (!res.ok) {
        throw new Error(data.error ?? "Chat request failed");
      }
      const reply = sanitizeAssistantContent(data.reply ?? "");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "Sorry, I couldn't get a response. Please try again!",
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
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc263]/50 bg-[#e5a12b] text-black shadow-[0_12px_40px_rgba(0,0,0,.55)] transition hover:bg-[#ffc263]"
        aria-label={open ? "Close budtender" : "Open budtender"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-3 z-50 flex max-h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden border border-[#8a5710]/35 bg-[#10100e] shadow-2xl sm:right-6 sm:w-96">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-black/60 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[#8a5710]/40 bg-[#e5a12b]/10">
              <Crown className="h-4 w-4 text-[#e5a12b]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Budtender</p>
              <p className="text-xs text-[#e5a12b]">Online · Inventory aware</p>
            </div>
            <button onClick={() => setOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-zinc-300 transition hover:border-[#e5a12b] hover:bg-[#e5a12b] hover:text-black" aria-label="Close budtender" title="Close chat"><X className="h-5 w-5" /></button>
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
                      ? "bg-[#e5a12b] text-black rounded-br-sm"
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
              placeholder="Ask about strains, effects, or potency"
              className="min-w-0 flex-1 border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#e5a12b] focus:outline-none"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center bg-[#e5a12b] text-black transition-colors hover:bg-[#ffc263] disabled:opacity-40"
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
