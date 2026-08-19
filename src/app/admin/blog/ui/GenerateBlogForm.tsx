"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Sparkles } from "lucide-react";

const TOPICS = [
  "A practical guide to reading cannabis product labels",
  "Terpenes and aroma: how to shop with your senses",
  "Flower, edibles, vapes, and concentrates: choosing a format",
  "How to build a thoughtful low-dose cannabis routine",
  "What makes small-batch flower feel premium",
  "Live resin, rosin, and distillate explained",
];

export function GenerateBlogForm() {
  const [topic, setTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestTopic = useMemo(() => {
    const trimmed = topic.trim();
    return trimmed.length ? trimmed : selectedTopic;
  }, [topic, selectedTopic]);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: requestTopic }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ? String(data.error) : "Failed to generate blog post");
        return;
      }

      setSuccess("Blog post generated successfully.");
      // Optionally: you could redirect to /blog/[slug] using data.slug.
      if (data?.slug) {
        setTimeout(() => {
          window.location.href = `/blog/${data.slug}`;
        }, 700);
      }
    } catch {
      setError("Connection error while generating blog post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onGenerate} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Choose a topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-electricpurple-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t} className="bg-zinc-950">
                {t}
              </option>
            ))}
          </select>
        </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Or override with your own topic (optional)</label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g. Best carts under $40"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {success}
        </div>
      )}


      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-electricpurple-500 text-black hover:bg-electricpurple-400 font-bold rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" /> Generate Blog Post
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500">
        Generates with the configured Ollama editorial model and publishes with a matched cover image.
      </p>
    </form>
  );
}

