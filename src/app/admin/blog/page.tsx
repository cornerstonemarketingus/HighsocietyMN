import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { GenerateBlogForm } from "./ui/GenerateBlogForm";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 10,
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Blog Generator</h1>
          <p className="text-gray-400 mt-2">
            Generate SEO blog posts using the configured internal LLM. Posts are created as published.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]">
          <Suspense fallback={null}>
            <GenerateBlogForm />
          </Suspense>

          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">Recent Posts</h2>
              <div className="text-xs text-gray-500">Showing last 10</div>
            </div>

            {posts.length === 0 ? (
              <div className="text-gray-500 py-10 text-center">No blog posts yet.</div>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="border border-white/10 rounded-xl bg-black/20 p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-white font-medium">{p.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {p.publishedAt ? formatDate(p.publishedAt) : formatDate(p.createdAt)}
                        {p.author?.name ? ` · ${p.author.name}` : ""}
                      </div>
                      {p.excerpt ? (
                        <div className="text-sm text-gray-400 mt-2 line-clamp-2">{p.excerpt}</div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <a
                        className="text-electricpurple-400 hover:text-electricpurple-300 text-sm"
                        href={`/blog/${p.slug}`}
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

