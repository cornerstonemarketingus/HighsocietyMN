"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function BudtenderWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I am Budtender AI. Ask me for effects, potency, or product picks." },
  ]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    const response = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 rounded-2xl border border-emerald-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-100 px-3 py-2">
            <p className="font-semibold">Budtender AI</p>
            <button onClick={() => setOpen(false)} className="text-sm text-emerald-700">Close</button>
          </div>
          <div className="h-72 space-y-2 overflow-y-auto p-3 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3 py-2 ${message.role === "assistant" ? "bg-emerald-50" : "bg-emerald-900 text-white"}`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-emerald-100 p-3">
            <input
              className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Best for sleep?"
            />
            <button onClick={send} className="btn text-sm">Send</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn rounded-full px-5 py-3">Chat</button>
      )}
    </div>
  );
}
