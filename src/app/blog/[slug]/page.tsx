import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { sampleBlogPost } from "@/lib/sample-blog-post";
import { ArrowLeft } from "lucide-react";
import { blogCoverFor } from "@/lib/blog-automation";
import { BlogContent } from "@/components/blog/BlogContent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
  }).catch(() => null);
  if (!post) {
    if (slug !== sampleBlogPost.slug) return {};
    return {
      title: sampleBlogPost.title,
      description: sampleBlogPost.excerpt,
      openGraph: { images: [sampleBlogPost.image] },
    };
  }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { images: [blogCoverFor(post.title, post.image)] },
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
  }).catch((error) => {
    console.warn("Blog post query failed; checking the sample post:", error);
    return null;
  });

  const displayPost =
    post ??
    (slug === sampleBlogPost.slug
      ? {
          id: "sample-blog-post",
          slug: sampleBlogPost.slug,
          title: sampleBlogPost.title,
          excerpt: sampleBlogPost.excerpt,
          content: sampleBlogPost.content,
          image: sampleBlogPost.image,
          createdAt: sampleBlogPost.publishedAt,
          publishedAt: sampleBlogPost.publishedAt,
          author: { name: sampleBlogPost.authorName, image: null },
        }
      : null);

  if (!displayPost) notFound();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc263] transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Hero image */}
        {(displayPost.image || blogCoverFor(displayPost.title)) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blogCoverFor(displayPost.title, displayPost.image)}
            alt={displayPost.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          {displayPost.author.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayPost.author.image}
              alt={displayPost.author.name ?? "Author"}
              className="h-9 w-9 rounded-full"
            />
          )}
          <div>
            {displayPost.author.name && (
              <p className="text-sm text-white font-medium">{displayPost.author.name}</p>
            )}
            <p className="text-xs text-gray-500">
              {displayPost.publishedAt ? formatDate(displayPost.publishedAt) : formatDate(displayPost.createdAt)}
            </p>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {displayPost.title}
        </h1>

        {displayPost.excerpt && (
          <p className="text-gray-400 text-lg mb-8 border-l-2 border-[#e5a12b] pl-4">
            {displayPost.excerpt}
          </p>
        )}

        {/* Content */}
        <BlogContent content={displayPost.content} />
      </main>
      <Footer />
    </div>
  );
}
