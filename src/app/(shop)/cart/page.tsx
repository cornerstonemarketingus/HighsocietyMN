import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

        <div className="text-center py-20 space-y-6">
          <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto" />
          <p className="text-gray-400 text-lg">Your cart is empty</p>
          <p className="text-gray-500">Add some products to get started.</p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              Browse Products <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
