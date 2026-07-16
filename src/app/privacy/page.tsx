import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-gray-300 leading-7">
          We collect only the information needed to operate the platform,
          process orders, and improve service quality. We do not knowingly
          collect personal information from anyone under 21.
        </p>
        <p className="mt-4 text-gray-400 leading-7">
          Marketing communications include unsubscribe options, and account
          access is protected with authentication controls. Contact support for
          data access or deletion requests.
        </p>
      </main>
      <Footer />
    </div>
  );
}
