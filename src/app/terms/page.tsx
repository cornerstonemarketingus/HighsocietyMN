import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-gray-300 leading-7">
          By using High Society MN, you confirm you are 21+ and agree to comply
          with all applicable local, state, and federal laws. Cannabis products
          are intended for adults only and should be used responsibly.
        </p>
        <p className="mt-4 text-gray-400 leading-7">
          Orders, promotions, and rewards may be subject to additional
          eligibility and verification requirements. Availability, pricing, and
          terms may change without notice.
        </p>
      </main>
      <Footer />
    </div>
  );
}
