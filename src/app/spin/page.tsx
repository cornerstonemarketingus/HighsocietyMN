import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SpinWheel } from "@/components/SpinWheel";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SpinPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let eligible = false;

  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { phone: true, ageVerified: true, spinUsed: true },
    });


    eligible = Boolean(user?.phone && user?.ageVerified && !user?.spinUsed);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-amber-400 text-sm font-semibold">Vault</div>
          <h1 className="text-4xl font-bold">Spin the Wheel</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Earn points & tokens and unlock perks. Eligibility requires a phone on your account and a 21+ confirmation.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 md:p-8">
          <SpinWheel eligible={eligible} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

