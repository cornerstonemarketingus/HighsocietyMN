import Link from "next/link";
import { getForumPosts } from "@/lib/store";

export default function CommunityPage() {
  const posts = getForumPosts();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-emerald-900">Community Forum</h1>
      <section className="card">
        <p className="text-sm text-emerald-700">Categories: Strains, Consumption Methods, Events, General</p>
        <form className="mt-4 grid gap-2 md:grid-cols-[1fr,2fr,auto]" action="/api/forum/posts" method="post">
          <input name="title" placeholder="Post title" className="rounded-lg border border-emerald-200 px-3 py-2" required />
          <input name="content" placeholder="Share your perspective..." className="rounded-lg border border-emerald-200 px-3 py-2" required />
          <button className="btn" type="submit">Create</button>
        </form>
      </section>
      <div className="space-y-3">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <p className="text-xs font-semibold uppercase text-emerald-700">{post.category}</p>
            <h2 className="text-xl font-bold text-emerald-950">{post.title}</h2>
            <p className="mt-2 text-emerald-800">{post.content}</p>
            <div className="mt-3 flex gap-2 text-sm text-emerald-700">
              <span>{post.likes} likes</span>
              <Link href={`/api/forum/posts/${post.id}`} className="underline">API detail</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
