import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SYMBOLS = ["🍀", "💎", "🌿", "⭐", "🔥", "💨"];
const PLAY_COST = 10;

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = db as any;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokens: true },
  }) as { tokens: number } | null;

  if (!user || user.tokens < PLAY_COST) {
    return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
  }

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

  const netChange = winTokens - PLAY_COST;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { tokens: { increment: netChange } },
    }),
    prisma.tokenTransaction.create({
      data: { userId: session.user.id, tokens: -PLAY_COST, reason: "minigame_play" },
    }),
    ...(winTokens > 0
      ? [
          prisma.tokenTransaction.create({
            data: { userId: session.user.id, tokens: winTokens, reason: "minigame_win" },
          }),
        ]
      : []),
  ]);

  const updatedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokens: true },
  }) as { tokens: number } | null;

  return NextResponse.json({ reels, winTokens, newBalance: updatedUser?.tokens ?? 0 });
}
