"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Lock, Pin, Loader2, Send } from "lucide-react";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

interface Thread {
  id: string;
  title: string;
  slug: string;
  locked: boolean;
  pinned: boolean;
  views: number;
  category: { name: string; slug: string };
  author: Author;
  createdAt: string;
}

export default function ForumThreadPage() {
  const params = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/forum/threads/${params.slug}/posts`).catch(() => null);
      if (!res?.ok) { router.push("/forum"); return; }
      const data = await res.json() as { thread: Thread; posts: Post[] };
      setThread(data.thread);
      setPosts(data.posts);
      setLoading(false);
    }
    load();
  }, [params.slug, router]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/forum/threads/${thread?.id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent.trim() }),
    });

    const data = await res.json() as Post & { error?: string };

    if (!res.ok) {
      setError(data.error ?? "Failed to post reply.");
      setSubmitting(false);
      return;
    }

    setPosts((prev) => [...prev, data]);
    setReplyContent("");
    setSubmitting(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Forum
        </Link>

        {/* Thread header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {thread.pinned && <Pin className="h-4 w-4 text-amber-500" />}
            {thread.locked && <Lock className="h-4 w-4 text-gray-500" />}
            <span className="text-xs text-amber-500 font-medium">{thread.category.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{thread.title}</h1>
          <p className="text-xs text-gray-500">
            Started by {thread.author.name ?? "Anonymous"} · {formatDate(thread.createdAt)} · {thread.views} views
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4 mb-10">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                {post.author.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.author.image} alt={post.author.name ?? ""} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                    {(post.author.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{post.author.name ?? "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{formatDate(post.createdAt)} {i === 0 ? "· OP" : ""}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Reply form */}
        {thread.locked ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" /> This thread is locked.
          </div>
        ) : session ? (
          <form onSubmit={handleReply} className="space-y-3">
            <h3 className="text-white font-semibold">Leave a Reply</h3>
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts…"
              rows={5}
              maxLength={5000}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Posting…" : "Post Reply"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center space-y-3">
            <p className="text-gray-400 text-sm">Sign in to join the conversation.</p>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
