import Link from "next/link";
import { getProducts } from "@/lib/store";

type Props = { searchParams: Promise<{ search?: string; category?: string; sort?: string; page?: string; limit?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const limit = Number(params.limit ?? "12");
  const query = (params.search ?? "").toLowerCase();
  const category = params.category ?? "";

  let items = getProducts().filter((product) => (!query || product.name.toLowerCase().includes(query)) && (!category || product.category === category));
  if (params.sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
  if (params.sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);

  const offset = (page - 1) * limit;
  const paged = items.slice(offset, offset + limit);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black text-emerald-900">Products ({items.length})</h1>
      <form className="card grid gap-3 md:grid-cols-4" action="/products">
        <input name="search" placeholder="Search strains, vapes..." defaultValue={params.search} className="rounded-lg border border-emerald-200 px-3 py-2" />
        <select name="category" defaultValue={category} className="rounded-lg border border-emerald-200 px-3 py-2">
          <option value="">All categories</option>
          {["Flower", "Edibles", "Vapes", "Concentrates", "Beverages", "Accessories"].map((entry) => <option key={entry}>{entry}</option>)}
        </select>
        <select name="sort" defaultValue={params.sort} className="rounded-lg border border-emerald-200 px-3 py-2">
          <option value="">Sort default</option>
          <option value="price_asc">Price: low-high</option>
          <option value="price_desc">Price: high-low</option>
        </select>
        <button className="btn" type="submit">Apply filters</button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {paged.map((product) => (
          <article key={product.id} className="card">
            <p className="text-xs font-semibold uppercase text-emerald-700">{product.category}</p>
            <h2 className="mt-1 text-lg font-bold text-emerald-950">{product.name}</h2>
            <p className="text-sm text-emerald-800">THC {product.thc}% • CBD {product.cbd}%</p>
            <p className="mt-3 text-2xl font-black text-emerald-900">${product.price.toFixed(2)}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/products/${product.id}`} className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold">Details</Link>
              <Link href={`/cart?add=${product.id}`} className="btn text-sm">Add to cart</Link>
            </div>
          </article>
        ))}
      </div>
      <div className="flex gap-2">
        {page > 1 ? <Link className="rounded-lg border border-emerald-200 px-3 py-2" href={`/products?page=${page - 1}`}>Previous</Link> : null}
        {offset + limit < items.length ? <Link className="rounded-lg border border-emerald-200 px-3 py-2" href={`/products?page=${page + 1}`}>Next</Link> : null}
      </div>
    </div>
  );
}
