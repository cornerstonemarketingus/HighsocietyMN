import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutClient } from "@/components/cart/CheckoutClient";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mb-10 mt-3 text-3xl font-medium text-white sm:text-5xl">Complete your order</h1>
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}
