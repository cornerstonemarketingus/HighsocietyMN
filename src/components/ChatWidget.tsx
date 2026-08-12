"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Crown, Leaf, Loader2, Send, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const MEMBER_EMAIL_KEY = "hs_member_email";

const BUDTENDER_CAPABILITIES = [
  "Recommend a strain by effect or flavor",
  "Explain dosing for edibles, vapes, or flower",
  "Compare two products in today's menu",
  "Suggest what's fresh this week",
];

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hey, I'm your budtender. Tell me the experience, format, and strength you prefer, and I'll compare your request with today's High Society menu.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [joining, setJoining] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMemberEmail(localStorage.getItem(MEMBER_EMAIL_KEY) || ""), []);
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("budtender:open", handler);
    return () => window.removeEventListener("budtender:open", handler);
  }, []);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function toggleGuide() {
    setOpen((current) => !current);
  }

  async function sendText(text: string) {
    if (!text || loading) return;
    const userMessage: Message = { role: "user", content: text };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage], email: memberEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Budtender is unavailable.");
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error instanceof Error ? error.message : "Budtender is unavailable." }]);
    } finally {
      setLoading(false);
    }
  }

  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    sendText(input.trim());
  }

  async function joinPrivateList(event: React.FormEvent) {
    event.preventDefault();
    setGateError("");
    setJoining(true);
    try {
      const normalizedEmail = gateEmail.trim().toLowerCase();
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return setGateError(data.error || "Signup failed.");
      localStorage.setItem(MEMBER_EMAIL_KEY, normalizedEmail);
      setMemberEmail(normalizedEmail);
    } finally {
      setJoining(false);
    }
  }

  if (pathname === "/games") return null;

  return (
    <>
      <button onClick={toggleGuide}
        className="group fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-green-500 text-black shadow-[0_16px_45px_rgba(0,0,0,.35)] transition hover:scale-105"
        aria-label={open ? "Close budtender chat" : "Chat with your budtender"}>
        {open ? <X className="h-6 w-6" /> : (
          <>
            <Sparkles className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-black bg-white" />
          </>
        )}
      </button>

      {open && (
        <section className="fixed inset-3 z-50 flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-black bg-white text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,.3)] sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(760px,calc(100vh-8rem))] sm:w-[min(520px,calc(100vw-2.5rem))]">
          <header className="border-b-2 border-black bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 animate-guide-idle items-center justify-center overflow-hidden rounded-full border-2 border-black bg-green-500 text-black">
                  <Crown className="h-5 w-5" />
                </div>
                <div><h2 className="font-sans font-semibold">Budtender</h2><p className="text-xs text-slate-500">Ask about strains, dosing, and what to try next</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 sm:hidden" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
          </header>

          {!memberEmail ? (
            <form onSubmit={joinPrivateList} className="m-auto w-full max-w-md p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Members only</p>
              <h3 className="mt-3 text-3xl font-semibold">Unlock your budtender.</h3>
              <p className="mt-3 leading-7 text-slate-600">Join the private list to chat with your personal product guide.</p>
              <label htmlFor="budtender-email" className="mt-6 block text-sm font-medium text-slate-700">Email address</label>
              <input id="budtender-email" type="email" required value={gateEmail} onChange={(event) => setGateEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-green-500"
                placeholder="you@example.com" />
              {gateError && <p className="mt-3 text-sm text-red-600">{gateError}</p>}
              <button disabled={joining} className="mt-4 h-12 w-full rounded-xl bg-green-700 font-semibold text-white disabled:opacity-50">{joining ? "Joining…" : "Join and continue"}</button>
              <p className="mt-3 text-center text-xs text-slate-500">Adults 21+ · Unsubscribe anytime</p>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-green-700 text-white" : "bg-slate-100 text-slate-800"}`}>{message.content}</div></div>)}
                {messages.length === 1 && !loading && (
                  <div className="flex flex-wrap gap-2 pl-1">
                    {BUDTENDER_CAPABILITIES.map((capability) => (
                      <button
                        key={capability}
                        type="button"
                        onClick={() => sendText(capability)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-green-500 hover:text-green-700"
                      >
                        {capability}
                      </button>
                    ))}
                  </div>
                )}
                {loading && <Loader2 className="h-5 w-5 animate-spin text-green-600" />}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="What are you looking for?" className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-green-500" />
                <button disabled={!input.trim() || loading} className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button>
              </form>
              <p className="flex items-center justify-center gap-1 pb-2 text-[11px] text-slate-500"><Leaf className="h-3 w-3" />Adults 21+ · Not medical advice</p>
            </>
          )}
        </section>
      )}
    </>
  );
}
