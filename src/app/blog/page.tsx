import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | High Society MN",
  description: "Cannabis insights, strain reviews, and news from High Society MN.",
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-7 w-7 text-amber-500" />
            <h1 className="text-4xl font-bold text-white">Blog</h1>
          </div>
          <p className="text-gray-400 max-w-xl">
            Strain reviews, cannabis culture, industry news, and tips from the High Society MN team.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <BookOpen className="h-16 w-16 text-gray-700 mx-auto" />
            <p className="text-gray-400 text-lg">No posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-amber-500/40 transition-all"
              >
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                )}
                {!post.image && (
                  <div className="w-full h-48 bg-gradient-to-br from-amber-900/30 to-black/60 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-amber-800" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6 space-y-3">
                  <p className="text-xs text-amber-500 font-medium">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    {post.author.name && ` · ${post.author.name}`}
                  </p>
                  <h2 className="text-white font-semibold text-lg leading-snug group-hover:text-amber-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm flex-1 line-clamp-3">{post.excerpt}</p>
                  )}
                  <span className="flex items-center gap-1 text-amber-400 text-sm mt-auto">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
