import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Users, MessageSquare, Pin, Lock, PlusCircle } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Forum | High Society MN",
  description: "Connect with Minnesota cannabis enthusiasts. Share strains, tips, and experiences.",
};

export default async function ForumPage() {
  const [categories, recentThreads] = await Promise.all([
    db.forumCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { threads: true } },
      },
    }),
    db.forumThread.findMany({
      take: 15,
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: {
        category: true,
        author: { select: { name: true } },
        _count: { select: { posts: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-7 w-7 text-amber-500" />
              <h1 className="text-4xl font-bold text-white">Community Forum</h1>
            </div>
            <p className="text-gray-400">
              Connect with Minnesota cannabis enthusiasts. Share strains, reviews, and tips.
            </p>
          </div>
          <Link
            href="/forum/new"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-amber-500 text-black px-5 py-2.5 text-sm font-semibold hover:bg-amber-400 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> New Thread
          </Link>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/forum?category=${cat.slug}`}
                className="group rounded-xl border border-white/10 bg-white/5 p-5 hover:border-amber-500/40 transition-all"
              >
                <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
                )}
                <p className="text-xs text-amber-500 mt-3">{cat._count.threads} threads</p>
              </Link>
            ))}
          </div>
        )}

        {/* Threads */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white mb-4">
            {recentThreads.length > 0 ? "Recent Discussions" : "No threads yet"}
          </h2>

          {recentThreads.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <MessageSquare className="h-16 w-16 text-gray-700 mx-auto" />
              <p className="text-gray-400">Be the first to start a conversation!</p>
              <Link
                href="/forum/new"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-2.5 text-sm font-semibold hover:bg-amber-400 transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Start a Thread
              </Link>
            </div>
          )}

          {recentThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/forum/${thread.slug}`}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {thread.pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                  {thread.locked && <Lock className="h-3.5 w-3.5 text-gray-500 shrink-0" />}
                  <h3 className="text-white font-medium truncate group-hover:text-amber-400 transition-colors">
                    {thread.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-amber-600">{thread.category.name}</span>
                  {" · "}by {thread.author.name ?? "Anonymous"}
                  {" · "}
                  {formatDate(thread.updatedAt)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-white">{thread._count.posts}</p>
                <p className="text-xs text-gray-500">replies</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
