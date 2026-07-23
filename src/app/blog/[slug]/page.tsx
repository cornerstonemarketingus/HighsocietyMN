import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { images: post.image ? [post.image] : [] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Hero image */}
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
          />
        )}
        {!post.image && (
          <div className="w-full h-40 rounded-2xl mb-8 bg-gradient-to-br from-amber-900/30 to-black/60 flex items-center justify-center">
            <BookOpen className="h-14 w-14 text-amber-800" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          {post.author.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.image}
              alt={post.author.name ?? "Author"}
              className="h-9 w-9 rounded-full"
            />
          )}
          <div>
            {post.author.name && (
              <p className="text-sm text-white font-medium">{post.author.name}</p>
            )}
            <p className="text-xs text-gray-500">
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-gray-400 text-lg mb-8 border-l-2 border-amber-500 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-amber max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
