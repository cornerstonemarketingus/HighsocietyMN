"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Loader2 } from "lucide-react";

const CATEGORIES = [
  { slug: "general", label: "General Discussion" },
  { slug: "strain-reviews", label: "Strain Reviews" },
  { slug: "tips-tricks", label: "Tips & Tricks" },
  { slug: "events", label: "Events & Drops" },
  { slug: "new-members", label: "New Members" },
];

export default function NewThreadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, categorySlug }),
    });

    const data = await res.json() as { slug?: string; error?: string };

    if (!res.ok) {
      setError(data.error ?? "Failed to create thread.");
      setLoading(false);
      return;
    }

    router.push(`/forum/${data.slug}`);
  }

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
          <div className="space-y-4">
            <p className="text-white text-lg">Sign in to start a discussion.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Forum
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Start a New Thread</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug} className="bg-zinc-900">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Thread Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Your Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or experiences…"
              required
              rows={8}
              maxLength={5000}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <p className="text-xs text-gray-600 text-right">{content.length}/5000</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Posting…
              </>
            ) : (
              "Post Thread"
            )}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
