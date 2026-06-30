import Link from 'next/link';

export default function Home() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700 px-6 py-16 text-white sm:px-10">
      <p className="mb-3 text-sm uppercase tracking-wider text-emerald-100">Live Demo</p>
      <h1 className="mb-4 text-4xl font-bold sm:text-5xl">High Society MN</h1>
      <p className="max-w-2xl text-emerald-100">
        Browse premium products, add to cart, and complete checkout with pickup or delivery.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className="rounded-md bg-white px-4 py-2 font-semibold text-emerald-900">
          Shop Products
        </Link>
        <Link href="/cart" className="rounded-md border border-white/50 px-4 py-2 font-semibold text-white">
          View Cart
        </Link>
      </div>
    </section>
  );
}
