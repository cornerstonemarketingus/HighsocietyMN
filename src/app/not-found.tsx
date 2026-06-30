import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="rounded-xl border border-emerald-900/10 bg-white p-8 text-center">
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Page not found</h1>
      <Link href="/products" className="text-emerald-700 underline">
        Browse products
      </Link>
    </section>
  );
}
