import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameHub } from "@/components/games/GameHub";
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
          <div className="eyebrow">Society arcade</div>
          <h1 className="mt-3 text-4xl font-medium sm:text-5xl">The Game Vault</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Make a run for the vault or unlock your one-time reward wheel. For adults 21+.
          </p>
        </div>

        <div className="border border-white/10 bg-[#11110f] p-4 md:p-8">
          <GameHub eligible={eligible} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

