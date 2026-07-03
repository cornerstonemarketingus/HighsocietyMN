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

async function createUniqueDiscountCode(prisma: any) {
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
    const body = await req.json().catch(() => ({})) as { userId?: string };
    const userId = session?.user?.id ?? null;

    if (body.userId && userId && body.userId !== userId) {
      return NextResponse.json({ error: "user_mismatch" }, { status: 403 });
    }

    const prisma = db as any;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { spinUsed: true },
      }) as { spinUsed: boolean } | null;

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (user.spinUsed) {
        return NextResponse.json({ error: "already_used" }, { status: 400 });
      }
    }

    const selectedPrize = pickPrize();
    const code = selectedPrize.prizeType === "discount"
      ? await createUniqueDiscountCode(prisma)
      : null;

    const spinResult = await prisma.$transaction(async (tx: any) => {
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
        const userData: Record<string, unknown> = { spinUsed: true };

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

    return NextResponse.json({ prize: spinResult });
  } catch (err) {
    console.error("Spin API error:", err);
    return NextResponse.json({ error: "Failed to process spin" }, { status: 500 });
  }
}
