'use client';

import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi, I am the High Society Budtender. Ask about strains, pickup timing, or product recommendations.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const submitMessage = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = (await response.json()) as { reply?: string };
      setMessages([...nextMessages, { role: 'assistant', content: data.reply ?? 'Our budtender team can help you in store.' }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'I can still help with pickup, gummies, carts, or nighttime flower recommendations.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="glass-card w-[360px] rounded-[28px] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-300"><Sparkles className="h-4 w-4" /> Budtender AI</p>
              <h3 className="text-lg font-semibold">Ask for guidance</h3>
            </div>
            <button className="rounded-full p-2 hover:bg-white/10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rounded-2xl p-3 text-sm ${message.role === 'assistant' ? 'bg-white/8 text-slate-100' : 'ml-10 bg-brand-500 text-black'}`}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void submitMessage();
                }
              }}
              placeholder="Ask about sleep strains, carts, or pickup..."
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
            <Button onClick={() => void submitMessage()} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button size="lg" className="rounded-full shadow-2xl" onClick={() => setOpen(true)}>
          <MessageCircle className="mr-2 h-5 w-5" />
          Ask a budtender
        </Button>
      )}
    </div>
  );
}
