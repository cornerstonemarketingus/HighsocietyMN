import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, referralCount: true, points: true, tokens: true },
  });
  if (!user?.referralCode) {
    user = await db.user.update({
      where: { id: session.user.id },
      data: { referralCode: `HS-${crypto.randomUUID().slice(0, 8).toUpperCase()}` },
      select: { referralCode: true, referralCount: true, points: true, tokens: true },
    });
  }
  return NextResponse.json(user);
}
