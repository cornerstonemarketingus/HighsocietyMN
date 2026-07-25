"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Leaf, Loader2, MapPin, Navigation, Search, Send, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Place = {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  openingHours: string | null;
  website: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
};

const BUD_SEEKER_EMAIL_KEY = "hs_budseeker_email";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"nearby" | "guide">("nearby");
  const [places, setPlaces] = useState<Place[]>([]);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [locationError, setLocationError] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Tell me the experience, format, and strength you prefer. Your private guide will compare your request with today’s High Society menu.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [joining, setJoining] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMemberEmail(localStorage.getItem(BUD_SEEKER_EMAIL_KEY) || "");
  }, []);
  useEffect(() => {
    const handler = () => { setOpen(true); setTab("nearby"); };
    window.addEventListener("bud-seeker:open", handler);
    return () => window.removeEventListener("bud-seeker:open", handler);
  }, []);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function findNearby() {
    if (!navigator.geolocation) {
      setLocationState("error");
      setLocationError("Location services are not available in this browser.");
      return;
    }
    setLocationState("loading");
    setLocationError("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`/api/dispensaries?lat=${coords.latitude}&lon=${coords.longitude}&email=${encodeURIComponent(memberEmail)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Search failed.");
        setPlaces(data.places ?? []);
        setLocationState("done");
      } catch (error) {
        setLocationState("error");
        setLocationError(error instanceof Error ? error.message : "Search failed.");
      }
    }, () => {
      setLocationState("error");
      setLocationError("Allow location access to find nearby dispensaries.");
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  }

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
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
      if (!response.ok) throw new Error(data.error || "Guide is unavailable.");
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: "assistant",
        content: error instanceof Error ? error.message : "Guide is unavailable.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function joinBudSeeker(event: React.FormEvent) {
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
      localStorage.setItem(BUD_SEEKER_EMAIL_KEY, normalizedEmail);
      setMemberEmail(normalizedEmail);
    } finally {
      setJoining(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-700 text-white shadow-xl transition hover:scale-105 hover:bg-indigo-800"
        aria-label={open ? "Close Bud Seeker" : "Open Bud Seeker"}>
        {open ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
      </button>

      {open && (
        <section className="fixed inset-x-3 bottom-20 z-50 flex max-h-[78vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-950 shadow-2xl sm:left-auto sm:right-5 sm:w-[440px]">
          <header className="border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white"><Sparkles className="h-5 w-5" /></div>
              <div><h2 className="font-semibold">Bud Seeker</h2><p className="text-xs text-slate-500">Nearby dispensaries + private product guide</p></div>
            </div>
            {memberEmail && <div className="mt-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button onClick={() => setTab("nearby")} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === "nearby" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}>Nearby</button>
              <button onClick={() => setTab("guide")} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === "guide" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}>Guide</button>
            </div>}
          </header>

          {!memberEmail ? (
            <form onSubmit={joinBudSeeker} className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Members only</p>
              <h3 className="mt-3 text-2xl font-semibold">Unlock Bud Seeker.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Join the private list to search nearby dispensaries and use your personal product guide.</p>
              <label htmlFor="bud-seeker-email" className="mt-5 block text-sm font-medium text-slate-700">Email address</label>
              <input id="bud-seeker-email" type="email" required value={gateEmail} onChange={(event) => setGateEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500"
                placeholder="you@example.com" />
              {gateError && <p className="mt-3 text-sm text-red-600">{gateError}</p>}
              <button disabled={joining} className="mt-4 h-11 w-full rounded-xl bg-indigo-700 font-semibold text-white disabled:opacity-50">{joining ? "Joining…" : "Join and continue"}</button>
              <p className="mt-3 text-center text-[11px] text-slate-500">Adults 21+ · Unsubscribe anytime</p>
            </form>
          ) : tab === "nearby" ? (
            <div className="overflow-y-auto p-5">
              {locationState === "idle" && <div className="py-8 text-center"><MapPin className="mx-auto h-12 w-12 text-indigo-600" /><h3 className="mt-4 text-xl font-semibold">Find dispensaries near you</h3><p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">Use your location to view cannabis dispensaries ordered by distance.</p><button onClick={findNearby} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800"><Navigation className="h-4 w-4" />Use my location</button></div>}
              {locationState === "loading" && <div className="flex items-center justify-center gap-3 py-16 text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />Searching nearby…</div>}
              {locationState === "error" && <div className="py-10 text-center"><p className="text-sm text-red-600">{locationError}</p><button onClick={findNearby} className="mt-4 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700">Try again</button></div>}
              {locationState === "done" && <div className="space-y-3">
                {places.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No mapped cannabis dispensaries were found within 50 miles.</p>}
                {places.map((place) => <article key={place.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{place.name}</h3><p className="mt-1 text-sm text-slate-500">{place.address}</p></div><span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{place.distanceMiles} mi</span></div>
                  {place.openingHours && <p className="mt-2 text-xs text-slate-500">{place.openingHours}</p>}
                  <div className="mt-3 flex gap-2"><a target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/directions?to=${place.latitude},${place.longitude}`} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white">Directions <Navigation className="h-3.5 w-3.5" /></a>{place.website && <a target="_blank" rel="noreferrer" href={place.website} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Website <ExternalLink className="h-3.5 w-3.5" /></a>}</div>
                </article>)}
                <p className="pt-2 text-center text-[11px] text-slate-400">Location data © OpenStreetMap contributors. Verify licensing and availability directly with each retailer.</p>
              </div>}
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-800"}`}>{message.content}</div></div>)}
                {loading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="What are you looking for?" className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-indigo-500" />
                <button disabled={!input.trim() || loading} className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button>
              </form>
              <p className="flex items-center justify-center gap-1 pb-2 text-[11px] text-slate-500"><Leaf className="h-3 w-3" />Adults 21+ · Not medical advice</p>
            </>
          )}
        </section>
      )}
    </>
  );
}
