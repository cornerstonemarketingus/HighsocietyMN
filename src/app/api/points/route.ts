import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = db as any;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { points: true, tokens: true },
  }) as { points: number; tokens: number } | null;

  return NextResponse.json(user ?? { points: 0, tokens: 0 });
}
