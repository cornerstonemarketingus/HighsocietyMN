import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Prize = {
  prize: string;
  prizeType: "discount" | "free_delivery" | "points" | "tokens" | "none";
  prizeValue: number;
  weight: number;
};

const PRIZES: Prize[] = [
  { prize: "10% off", prizeType: "discount", prizeValue: 10, weight: 25 },
  { prize: "15% off", prizeType: "discount", prizeValue: 15, weight: 10 },
  { prize: "Free delivery", prizeType: "free_delivery", prizeValue: 0, weight: 15 },
  { prize: "100 bonus points", prizeType: "points", prizeValue: 100, weight: 20 },
  { prize: "50 bonus tokens", prizeType: "tokens", prizeValue: 50, weight: 15 },
  { prize: "Better luck next time", prizeType: "none", prizeValue: 0, weight: 15 },
];

function pickPrize() {
  const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const prize of PRIZES) {
    roll -= prize.weight;
    if (roll < 0) {
      return prize;
    }
  }

  return PRIZES[PRIZES.length - 1];
}

function generateDiscountCode() {
  return `SPIN-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

type PrismaLike = {
  spinResult: {
    findUnique: (args: { where: { code: string } }) => Promise<{ code: string | null } | null>;
  };
};

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function createUniqueDiscountCode(prisma: PrismaLike) {



  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateDiscountCode();
    const existing = await prisma.spinResult.findUnique({ where: { code } });
    if (!existing) {
      return code;
    }
  }

  return `SPIN-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}


export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({})) as { userId?: string; email?: string };
    const userId = session?.user?.id ?? null;
    const email = body.email?.trim().toLowerCase() ?? "";

    if (body.userId && userId && body.userId !== userId) {
      return NextResponse.json({ error: "user_mismatch" }, { status: 403 });
    }

    const prisma = db;
    let emailSpinCode: string | null = null;

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "email_signup_required" }, { status: 400 });
      }
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
        select: { discountCode: true },
      });
      if (!subscriber) {
        return NextResponse.json({ error: "email_signup_required" }, { status: 403 });
      }
      emailSpinCode = `SPIN-${subscriber.discountCode}`;
      const existingSpin = await prisma.spinResult.findUnique({ where: { code: emailSpinCode } });
      if (existingSpin) {
        return NextResponse.json({ error: "already_used" }, { status: 400 });
      }
    }

    const selectedPrize = pickPrize();
    const code = emailSpinCode ?? (
      selectedPrize.prizeType === "discount"
        ? await createUniqueDiscountCode(prisma)
        : null
    );

    const spinResult = await prisma.$transaction(async (tx) => {
      if (userId) {
        // Claim eligibility before creating or crediting a prize. updateMany makes
        // concurrent requests contend on one atomic state transition.
        const claimed = await tx.user.updateMany({
          where: { id: userId, spinUsed: false },
          data: { spinUsed: true },
        });
        if (claimed.count !== 1) throw new Error("SPIN_ALREADY_USED");
      }

      const createdSpinResult = await tx.spinResult.create({

        data: {
          userId,
          prize: selectedPrize.prize,
          prizeType: selectedPrize.prizeType,
          prizeValue: selectedPrize.prizeValue,
          code,
        },
      });

      if (userId) {
        const userData: Record<string, unknown> = {};

        if (selectedPrize.prizeType === "points") {
          userData.points = { increment: selectedPrize.prizeValue };
          await tx.pointTransaction.create({
            data: {
              userId,
              points: selectedPrize.prizeValue,
              reason: "spin_win",
            },
          });
        }

        if (selectedPrize.prizeType === "tokens") {
          userData.tokens = { increment: selectedPrize.prizeValue };
          await tx.tokenTransaction.create({
            data: {
              userId,
              tokens: selectedPrize.prizeValue,
              reason: "spin_win",
            },
          });
        }

        await tx.user.update({
          where: { id: userId },
          data: userData,
        });
      }

      return createdSpinResult;
    });

    return NextResponse.json({
      prize: {
        ...spinResult,
        code: selectedPrize.prizeType === "discount" ? spinResult.code : null,
      },
    });
  } catch (err) {
    if ((err instanceof Error && err.message === "SPIN_ALREADY_USED") || isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "already_used" }, { status: 409 });
    }
    console.error("Spin API error:", err);
    return NextResponse.json({ error: "Failed to process spin" }, { status: 500 });
  }
}
