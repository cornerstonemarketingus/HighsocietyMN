import { NextResponse } from "next/server";
import {
  AGE_GATE_COOKIE_NAME,
  AGE_GATE_COOKIE_VALUE,
} from "@/lib/age-gate";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: AGE_GATE_COOKIE_NAME,
    value: AGE_GATE_COOKIE_VALUE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
