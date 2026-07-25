import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input." },
        { status: 400 }
      );
    }

    const { name, email, password, referralCode } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const ownReferralCode = `HS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const user = await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          referralCode: ownReferralCode,
          referredByCode: referralCode || null,
        },
      });
      if (referralCode) {
        await tx.user.updateMany({
          where: { referralCode },
          data: { referralCount: { increment: 1 }, points: { increment: 250 } },
        });
      }
      return created;
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
