import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Users, MessageSquare, Pin, Lock, PlusCircle, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Forum | High Society MN",
  description: "Connect with Minnesota cannabis enthusiasts. Share strains, tips, and experiences.",
};

const fallbackCategories = [
  { id: "general", name: "General Discussion", slug: "general", description: "Talk about Minnesota cannabis and the community", sortOrder: 1, createdAt: new Date(0), updatedAt: new Date(0), _count: { threads: 0 } },
  { id: "strain-reviews", name: "Strain Reviews", slug: "strain-reviews", description: "Share thoughtful product and strain experiences", sortOrder: 2, createdAt: new Date(0), updatedAt: new Date(0), _count: { threads: 0 } },
  { id: "tips-tricks", name: "Tips & Tricks", slug: "tips-tricks", description: "Responsible-use guidance and practical knowledge", sortOrder: 3, createdAt: new Date(0), updatedAt: new Date(0), _count: { threads: 0 } },
  { id: "events", name: "Events & Drops", slug: "events", description: "Follow local happenings and collection releases", sortOrder: 4, createdAt: new Date(0), updatedAt: new Date(0), _count: { threads: 0 } },
  { id: "new-members", name: "New Members", slug: "new-members", description: "Introduce yourself to the community", sortOrder: 5, createdAt: new Date(0), updatedAt: new Date(0), _count: { threads: 0 } },
];

async function getForumData() {
  try {
    const [categories, threads] = await Promise.all([
      db.forumCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { threads: true } } } }),
      db.forumThread.findMany({ take: 15, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }], include: { category: true, author: { select: { name: true } }, _count: { select: { posts: true } } } }),
    ]);
    return { categories, recentThreads: threads, available: true };
  } catch (error) {
    console.error("Forum page database unavailable:", error);
    return { categories: fallbackCategories, recentThreads: [], available: false };
  }
}

export default async function ForumPage() {
  const { categories, recentThreads, available } = await getForumData();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-7 w-7 text-[#e5a12b]" />
              <h1 className="text-4xl font-bold text-white">Community Forum</h1>
            </div>
            <p className="text-gray-400">
              Connect with Minnesota cannabis enthusiasts. Share strains, reviews, and tips.
            </p>
          </div>
          {available && <Link href="/forum/new" className="hidden sm:flex items-center gap-2 rounded-xl bg-[#e5a12b] text-black px-5 py-2.5 text-sm font-semibold hover:bg-[#ffc263] transition-colors">
            <PlusCircle className="h-4 w-4" /> New Thread
          </Link>}
        </div>

        {!available && (
          <div role="status" className="mb-8 flex items-start gap-3 border border-amber-400/35 bg-amber-400/10 p-4 text-sm text-amber-100">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#e5a12b]" />
            <div><p className="font-semibold">Community service is temporarily unavailable</p><p className="mt-1 text-amber-100/70">Categories remain visible, but discussions and posting are paused while the connection recovers.</p></div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/forum?category=${cat.slug}`}
                className="group rounded-xl border border-white/10 bg-white/5 p-5 hover:border-[#e5a12b]/40 transition-all"
              >
                <h3 className="text-white font-semibold group-hover:text-[#ffc263] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
                )}
                <p className="text-xs text-[#e5a12b] mt-3">{cat._count.threads} threads</p>
              </Link>
            ))}
          </div>
        )}

        {/* Threads */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white mb-4">
            {recentThreads.length > 0 ? "Recent Discussions" : available ? "No threads yet" : "Discussions unavailable"}
          </h2>

          {available && recentThreads.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <MessageSquare className="h-16 w-16 text-gray-700 mx-auto" />
              <p className="text-gray-400">Be the first to start a conversation!</p>
              <Link
                href="/forum/new"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e5a12b] text-black px-6 py-2.5 text-sm font-semibold hover:bg-[#ffc263] transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Start a Thread
              </Link>
            </div>
          )}

          {recentThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/forum/${thread.slug}`}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-[#e5a12b]/30 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {thread.pinned && <Pin className="h-3.5 w-3.5 text-[#e5a12b] shrink-0" />}
                  {thread.locked && <Lock className="h-3.5 w-3.5 text-gray-500 shrink-0" />}
                  <h3 className="text-white font-medium truncate group-hover:text-[#ffc263] transition-colors">
                    {thread.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-[#8a5710]">{thread.category.name}</span>
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
