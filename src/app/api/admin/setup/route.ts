import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * One-time (or as-needed) way to create/reset the admin login without DB or terminal access.
 * Gated entirely behind ADMIN_SETUP_TOKEN — inert unless that env var is explicitly set.
 */
export async function POST(req: NextRequest) {
  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  if (!setupToken) {
    return NextResponse.json({ error: "Admin setup is not enabled. Set ADMIN_SETUP_TOKEN to use this." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({})) as { token?: string; email?: string; password?: string; name?: string };
  if (body.token !== setupToken) {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 401 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || password.length < 8) {
    return NextResponse.json({ error: "Provide an email and a password of at least 8 characters." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.upsert({
    where: { email },
    update: { password: passwordHash, role: "ADMIN" },
    create: { email, password: passwordHash, role: "ADMIN", name: body.name?.trim() || "Admin" },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({ ok: true, user });
}
