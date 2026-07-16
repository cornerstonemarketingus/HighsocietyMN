import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BudSeekerPage from "@/components/budseeker/BudSeekerPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BudSeeker | High Society MN",
  description:
    "Find nearby dispensaries, head shops, and cannabis-friendly stores with BudSeeker.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BudSeekerPage />
      </main>
      <Footer />
    </div>
  );
}
