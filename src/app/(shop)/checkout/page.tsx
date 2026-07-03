import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold text-lg">
                Contact Information
              </h2>
              <div className="space-y-3">
                <Input type="text" placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Input type="tel" placeholder="Phone Number" />
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold text-lg">
                Fulfillment Method
              </h2>
              <div className="border border-amber-500/50 rounded-lg p-4 bg-amber-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Store Pickup</p>
                    <p className="text-gray-400 text-sm">
                      Ready within 1–2 hours. Must show valid ID (21+).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-6 space-y-4 h-fit">
            <h2 className="text-white font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (8.875%)</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-base">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>
            <Button size="lg" className="w-full" disabled>
              Proceed to Payment
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
