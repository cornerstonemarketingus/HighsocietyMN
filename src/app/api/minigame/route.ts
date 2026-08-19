import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SYMBOLS = ["🍀", "💎", "🌿", "⭐", "🔥", "💨"];
const PLAY_COST = 10;
const MAX_DAILY_PLAYS = 100;

function startOfUtcDay() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = db;
  const reels = [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ];

  let winTokens = 0;
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    winTokens = reels[0] === "💎" ? 500 : reels[0] === "🌿" ? 200 : 100;
  } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
    winTokens = 50;
  }

  try {
    const newBalance = await prisma.$transaction(async (tx) => {
      const playsToday = await tx.tokenTransaction.count({
        where: { userId: session.user.id, reason: "minigame_play", createdAt: { gte: startOfUtcDay() } },
      });
      if (playsToday >= MAX_DAILY_PLAYS) throw new Error("DAILY_PLAY_LIMIT");

      const debit = await tx.user.updateMany({
        where: { id: session.user.id, tokens: { gte: PLAY_COST } },
        data: { tokens: { decrement: PLAY_COST } },
      });
      if (debit.count !== 1) throw new Error("INSUFFICIENT_TOKENS");

      await tx.tokenTransaction.create({
        data: { userId: session.user.id, tokens: -PLAY_COST, reason: "minigame_play" },
      });
      if (winTokens > 0) {
        await tx.user.update({ where: { id: session.user.id }, data: { tokens: { increment: winTokens } } });
        await tx.tokenTransaction.create({
          data: { userId: session.user.id, tokens: winTokens, reason: "minigame_win" },
        });
      }
      const user = await tx.user.findUnique({ where: { id: session.user.id }, select: { tokens: true } });
      return user?.tokens ?? 0;
    });

    return NextResponse.json({ reels, winTokens, newBalance });
  } catch (error) {
    if (error instanceof Error && error.message === "DAILY_PLAY_LIMIT") {
      return NextResponse.json({ error: "Daily play limit reached" }, { status: 429 });
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_TOKENS") {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 409 });
    }
    console.error("Minigame API error:", error);
    return NextResponse.json({ error: "Unable to play right now" }, { status: 500 });
  }

}
