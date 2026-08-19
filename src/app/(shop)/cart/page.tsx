import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartClient } from "@/components/cart/CartClient";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="eyebrow">Private collection</p>
        <h1 className="mb-10 mt-3 text-3xl font-medium text-white sm:text-5xl">Your bag</h1>
        <CartClient />
      </main>
      <Footer />
    </div>
  );
}
