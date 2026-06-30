import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;
  const product = getProducts().find((entry) => entry.id === id);
  if (!product) return notFound();

  const related = getProducts()
    .filter((entry) => entry.category === product.category && entry.id !== product.id)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="card grid gap-4 md:grid-cols-2">
        <div className="h-72 rounded-xl bg-emerald-100" />
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-700">{product.category}</p>
          <h1 className="text-3xl font-black text-emerald-950">{product.name}</h1>
          <p className="mt-2 text-emerald-800">{product.description}</p>
          <p className="mt-3 text-xl font-black">${product.price.toFixed(2)}</p>
          <p className="text-sm text-emerald-700">THC {product.thc}% • CBD {product.cbd}% • Stock {product.inventory}</p>
          <div className="mt-4 flex gap-3">
            <Link href={`/cart?add=${product.id}`} className="btn">Add to cart</Link>
            <Link href="/checkout" className="rounded-xl border border-emerald-300 px-4 py-2 font-semibold">Buy now</Link>
          </div>
        </div>
      </div>
      <section className="card">
        <h2 className="text-xl font-bold text-emerald-900">Effects & Terpenes</h2>
        <p className="mt-2 text-sm text-emerald-800">Effects: {product.effects.join(", ")}</p>
        <p className="text-sm text-emerald-800">Terpenes: {product.terpenes.join(", ")}</p>
      </section>
      <section className="card">
        <h2 className="text-xl font-bold text-emerald-900">Related products</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {related.map((entry) => (
            <Link key={entry.id} href={`/products/${entry.id}`} className="rounded-lg border border-emerald-200 p-3 text-sm font-semibold">
              {entry.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
