import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { db } from "@/lib/db";
import { attachSoldCounts } from "@/lib/products";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  try {
    const where: Record<string, unknown> = { published: true };

    if (params.category) {
      const cat = await db.category.findFirst({
        where: { slug: params.category },
      });
      if (cat) where.categoryId = cat.id;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { brand: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, string> =
      params.sort === "price_asc"
        ? { price: "asc" }
        : params.sort === "price_desc"
        ? { price: "desc" }
        : params.sort === "newest"
        ? { createdAt: "desc" }
        : { featured: "desc" };

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      take: 48,
    });

    return await attachSoldCounts(products);
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-white/[.07] bg-black">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-green-500">
              <Sparkles className="h-4 w-4" /> The High Society Edit
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
            {params.category
              ? categories.find((c) => c.slug === params.category)?.name ??
                "Products"
              : "Shop our collection"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
              Curated cannabis products sourced for quality, consistency, and a
              better Minnesota experience.
            </p>
            <form action="/products" className="mt-8 flex max-w-xl items-center rounded-full border border-white/10 bg-white/[.04] p-1.5">
              <Search className="ml-4 h-5 w-5 text-neutral-500" />
              <input
                name="search"
                defaultValue={params.search}
                placeholder="Search flower, edibles, brands..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500"
              />
              <button className="rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-white/[.07] bg-white/[.03] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                <SlidersHorizontal className="h-4 w-4 text-green-500" /> Browse by category
              </div>
              <p className="text-sm text-neutral-500">
                {products.length} result{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
            <a
              href="/products"
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !params.category
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-white/10 bg-transparent text-neutral-300 hover:border-green-500/50 hover:text-green-400"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  params.category === cat.slug
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/10 bg-transparent text-neutral-300 hover:border-green-500/50 hover:text-green-400"
                }`}
              >
                {cat.name}
              </a>
            ))}
            </div>
          </div>

        <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
          {products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-neutral-400 text-lg">No products found.</p>
              <a href="/products" className="text-green-400 hover:underline">
                View all products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}
