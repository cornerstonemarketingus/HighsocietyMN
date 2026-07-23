import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { db } from "@/lib/db";
import { fallbackCategories, fallbackProducts } from "@/lib/fallback-content";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

function filterFallbackProducts(params: SearchParams) {
  let products = [...fallbackProducts];

  if (params.category) {
    products = products.filter((product) => product.category.slug === params.category);
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    products = products.filter((product) =>
      [product.name, product.description, product.brand ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }

  if (params.sort === "price_asc") products.sort((a, b) => a.price - b.price);
  if (params.sort === "price_desc") products.sort((a, b) => b.price - a.price);
  if (params.sort === "newest") {
    products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return products;
}

async function getProducts(params: SearchParams) {
  try {
    const where: Record<string, unknown> = { published: true };

    if (params.category) {
      const cat = await db.category.findFirst({ where: { slug: params.category } });
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

    return products.length > 0 ? products : filterFallbackProducts(params);
  } catch {
    return filterFallbackProducts(params);
  }
}

async function getCategories() {
  try {
    const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
    return categories.length > 0 ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
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
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_34%),rgba(255,255,255,0.03)] p-7 sm:p-9">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.34em] text-amber-300/80">
            The Collection
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {params.category
              ? categories.find((category) => category.slug === params.category)?.name ??
                "Products"
              : "Premium Cannabis"}
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            {products.length} curated product{products.length !== 1 ? "s" : ""} available for adults 21+.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/products"
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              !params.category
                ? "border-amber-500 bg-amber-500 font-medium text-black"
                : "border-white/20 text-gray-300 hover:border-amber-500/50"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                params.category === cat.slug
                  ? "border-amber-500 bg-amber-500 font-medium text-black"
                  : "border-white/20 text-gray-300 hover:border-amber-500/50"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        <Suspense fallback={<div className="text-gray-400">Loading collection...</div>}>
          {products.length === 0 ? (
            <div className="space-y-4 py-20 text-center">
              <p className="text-lg text-gray-400">No products match those filters.</p>
              <a href="/products" className="text-amber-400 hover:underline">
                View the full collection
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
