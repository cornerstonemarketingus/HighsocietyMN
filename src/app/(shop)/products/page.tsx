import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { db } from "@/lib/db";

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

    return products;
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
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {params.category
              ? categories.find((c) => c.slug === params.category)?.name ??
                "Products"
              : "All Products"}
          </h1>
          <p className="text-gray-400 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            <a
              href="/products"
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                !params.category
                  ? "bg-amber-500 text-black border-amber-500 font-medium"
                  : "border-white/20 text-gray-300 hover:border-amber-500/50"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  params.category === cat.slug
                    ? "bg-amber-500 text-black border-amber-500 font-medium"
                    : "border-white/20 text-gray-300 hover:border-amber-500/50"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Grid */}
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          {products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-gray-400 text-lg">No products found.</p>
              <a href="/products" className="text-amber-400 hover:underline">
                View all products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
