import Link from "next/link";
import { listBlogs } from "@/lib/store";

export default function BlogPage() {
  const posts = listBlogs();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Blog</h1>
      <p className="text-emerald-800">AI and admin posts publish here, with newsletter-ready content.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <h2 className="text-xl font-bold text-emerald-950">{post.title}</h2>
            <p className="mt-2 text-sm text-emerald-800">{post.excerpt}</p>
            <Link className="mt-3 inline-flex rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold" href={`/blog/${post.id}`}>
              Read post
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
