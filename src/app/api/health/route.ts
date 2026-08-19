import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRuntimeReadiness } from "@/lib/runtime-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const readiness = getRuntimeReadiness();

  try {
    await db.$queryRaw`SELECT 1`;
    const requiredReady = Object.values(readiness.required).every(Boolean);

    return NextResponse.json({
      status: requiredReady ? "healthy" : "degraded",
      checkedAt: new Date().toISOString(),
      database: { reachable: true, latencyMs: Date.now() - startedAt },
      ...readiness,
    }, {
      status: requiredReady ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({
      status: "unavailable",
      checkedAt: new Date().toISOString(),
      database: { reachable: false, latencyMs: Date.now() - startedAt },
      ...readiness,
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
