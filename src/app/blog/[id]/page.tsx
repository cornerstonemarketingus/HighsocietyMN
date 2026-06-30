import { notFound } from "next/navigation";
import { getBlog, listBlogs } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = getBlog(id);
  if (!post) return notFound();

  const related = listBlogs().filter((entry) => entry.id !== post.id).slice(0, 2);

  return (
    <article className="space-y-4">
      <header className="card">
        <h1 className="text-3xl font-black text-emerald-950">{post.title}</h1>
        <p className="mt-2 text-sm text-emerald-800">Tags: {post.tags.join(", ")}</p>
      </header>
      <section className="card prose max-w-none">
        <p>{post.content}</p>
      </section>
      <aside className="card">
        <h2 className="text-lg font-bold text-emerald-900">Related posts</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-emerald-800">
          {related.map((entry) => <li key={entry.id}>{entry.title}</li>)}
        </ul>
      </aside>
    </article>
  );
}
