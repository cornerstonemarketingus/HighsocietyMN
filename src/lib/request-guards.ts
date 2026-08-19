import type { NextRequest } from "next/server";
import { AGE_GATE_COOKIE_NAME, AGE_GATE_COOKIE_VALUE } from "@/lib/age-gate";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function isAgeVerified(request: NextRequest) {
  return request.cookies.get(AGE_GATE_COOKIE_NAME)?.value === AGE_GATE_COOKIE_VALUE;
}

export function exceedsBodyLimit(request: NextRequest, maxBytes: number) {
  const header = request.headers.get("content-length");
  if (!header) return false;
  const size = Number(header);
  return Number.isFinite(size) && size > maxBytes;
}

export async function readBoundedJson<T>(request: NextRequest, maxChars: number): Promise<T> {
  const text = await request.text();
  if (text.length > maxChars) throw new RangeError("Request is too large");
  return JSON.parse(text) as T;
}

export function rateLimit(request: NextRequest, scope: string, limit: number, windowMs: number) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "unknown";
  const key = `${scope}:${client}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count <= limit) return null;
  return Math.max(1, Math.ceil((current.resetAt - now) / 1000));
}
