import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { sampleBlogPost } from "@/lib/sample-blog-post";
import { blogCoverFor } from "@/lib/blog-automation";
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
  }).catch((error) => {
    console.warn("Blog database query failed; showing the sample post:", error);
    return [];
  });

  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: "sample-blog-post",
            slug: sampleBlogPost.slug,
            title: sampleBlogPost.title,
            excerpt: sampleBlogPost.excerpt,
            image: sampleBlogPost.image,
            publishedAt: sampleBlogPost.publishedAt,
            createdAt: sampleBlogPost.publishedAt,
            author: { name: sampleBlogPost.authorName },
          },
        ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-7 w-7 text-[#e5a12b]" />
            <h1 className="text-4xl font-bold text-white">Blog</h1>
          </div>
          <p className="text-gray-400 max-w-xl">
            Strain reviews, cannabis culture, industry news, and tips from the High Society MN team.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#e5a12b]/40 transition-all"
              >
                {(post.image || blogCoverFor(post.title)) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blogCoverFor(post.title, post.image)}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                )}
                <div className="flex flex-col flex-1 p-6 space-y-3">
                  <p className="text-xs text-[#e5a12b] font-medium">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    {post.author?.name && ` · ${post.author.name}`}
                  </p>
                  <h2 className="text-white font-semibold text-lg leading-snug group-hover:text-[#ffc263] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm flex-1 line-clamp-3">{post.excerpt}</p>
                  )}
                  <span className="flex items-center gap-1 text-[#ffc263] text-sm mt-auto">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
