"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type PrizeType =
  | "discount"
  | "free_delivery"
  | "points"
  | "tokens"
  | "none";

export type SpinPrize = {
  prize: string;
  prizeType: PrizeType;
  prizeValue: number;
  code?: string | null;
};

const PRIZE_LABELS: Array<{ label: string; key: string; weight: number }> = [
  { key: "d10", label: "10% OFF", weight: 25 },
  { key: "d15", label: "15% OFF", weight: 10 },
  { key: "free", label: "FREE DELIVERY", weight: 15 },
  { key: "p100", label: "+100 POINTS", weight: 20 },
  { key: "t50", label: "+50 TOKENS", weight: 15 },
  { key: "none", label: "BETTER LUCK", weight: 15 },
];

function normalizeWheelSegments() {
  // Expand weights into segments for a simple “flashy” look.
  const segments: string[] = [];
  for (const p of PRIZE_LABELS) {
    for (let i = 0; i < p.weight; i++) segments.push(p.key);
  }
  return segments;
}

export function SpinWheel({
  eligible,
  onClose,
}: {
  eligible: boolean;
  onClose?: () => void;
}) {
  const segments = useMemo(() => normalizeWheelSegments(), []);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinPrize | null>(null);
  const [balance, setBalance] = useState<{ points: number; tokens: number } | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [spinEmail, setSpinEmail] = useState<string | null>(null);
  const [emailConsent, setEmailConsent] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  const canSpin = eligible || spinEmail !== null;

  useEffect(() => {
    if (!eligible) return;
    // Load balances for display
    (async () => {
      try {
        const res = await fetch("/api/points");
        if (!res.ok) return;
        const data = (await res.json()) as { points: number; tokens: number };
        setBalance(data);
      } catch {
        // ignore
      }
    })();
  }, [eligible]);

  async function handleSpin() {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spinEmail ? { email: spinEmail } : {}),
      });
      const data = (await res.json()) as
        | { prize: SpinPrize }
        | { error: string };

      if (!res.ok || !data || "error" in data) {
        setResult({
          prize: "Unable to spin right now",
          prizeType: "none",
          prizeValue: 0,
        });
        return;
      }

      // Trigger a “spin” animation by rotating to a random angle.
      // We don’t need to perfectly land on the exact segment server-side;
      // server result is shown as the prize.
      const extraTurns = 6 + Math.floor(Math.random() * 4); // 6-9 turns
      const finalDeg = Math.floor(Math.random() * 360);
      const wheel = document.getElementById("hs-wheel-rotor");
      if (wheel) {
        wheel.style.transition = "transform 3200ms cubic-bezier(0.12, 0.85, 0.25, 1)";
        wheel.style.transform = `rotate(${extraTurns * 360 + finalDeg}deg)`;
      }

      setResult(data.prize as SpinPrize);

      // Refresh balances after spin
      try {
        const balRes = await fetch("/api/points");
        if (balRes.ok) {
          const bal = (await balRes.json()) as { points: number; tokens: number };
          setBalance(bal);
        }
      } catch {
        // ignore
      }
    } catch {
      setResult({
        prize: "Connection error",
        prizeType: "none",
        prizeValue: 0,
      });
    } finally {
      setTimeout(() => setSpinning(false), 3300);
    }
  }

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!emailConsent || signingUp) return;
    setSigningUp(true);
    setSignupError("");
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to sign up");
      setSpinEmail(normalizedEmail);
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Unable to sign up");
    } finally {
      setSigningUp(false);
    }
  }

  const prizeText =
    result?.prizeType === "discount" && result?.code
      ? `${result.prize} · Code: ${result.code}`
      : result?.prize
      ? result.prize
      : null;

  if (!canSpin) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/60 p-6 text-white">
        <div className="text-[#ffc263] font-semibold">Join the list to unlock one spin</div>
        <p className="mt-2 text-sm text-gray-400">
          Enter your email for drop alerts and confirm you are 21 or older.
        </p>
        <form onSubmit={handleEmailSignup} className="mt-5 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e5a12b]"
          />
          <label className="flex items-start gap-2 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={(event) => setEmailConsent(event.target.checked)}
              required
              className="mt-0.5"
            />
            <span>I am 21+ and agree to receive High Society MN email updates. I can unsubscribe anytime.</span>
          </label>
          <Button
            type="submit"
            className="w-full rounded-xl bg-[#e5a12b] text-black hover:bg-[#ffc263] font-bold"
            disabled={!emailConsent || signingUp}
          >
            {signingUp ? "Unlocking…" : "Sign Up & Unlock Spin"}
          </Button>
          {signupError && <p className="text-sm text-red-400">{signupError}</p>}
        </form>
        <p className="mt-4 text-xs text-gray-500">One spin per subscribed email. No purchase necessary.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[#ffc263] font-semibold text-sm">Vault Wheel</div>
          <div className="text-white text-2xl font-bold">Spin for instant rewards</div>
          <div className="text-sm text-gray-400 mt-1">
            Earn points & tokens for mini-games and perks.
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            Close
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr] items-center">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_55%)]" />
          <div className="mx-auto w-[290px] h-[290px] rounded-full border border-white/10 bg-[conic-gradient(from_0deg,rgba(212,175,55,0.18),rgba(212,175,55,0.02),rgba(255,255,255,0.03),rgba(212,175,55,0.18))] shadow-[0_0_60px_rgba(212,175,55,0.15)] flex items-center justify-center">
            <div
              id="hs-wheel-rotor"
              className="w-[240px] h-[240px] rounded-full border border-white/10 bg-black/20 flex items-center justify-center"
              style={{ transform: "rotate(0deg)" }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                {/* Segment labels */}
                {segments.slice(0, 60).map((seg, idx) => {
                  const angle = (idx / 60) * 360;
                  const label =
                    PRIZE_LABELS.find((p) => p.key === seg)?.label ?? "";
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 text-[10px] text-[#b97416]/90 font-semibold select-none"
                      style={{
                        transform: `rotate(${angle}deg) translate(0,-110px) rotate(${-angle}deg)`,
                        transformOrigin: "center",
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[92px] h-[92px] rounded-full bg-[#e5a12b]/15 border border-[#ffc263]/30 shadow-[0_0_40px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center">
                    <div className="text-[#f5df9b] text-xs font-bold">SPIN</div>
                    <div className="text-white text-lg font-extrabold">🎁</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[-14px] z-10">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#e5a12b] drop-shadow-[0_10px_20px_rgba(212,175,55,0.2)]" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-gray-400">Your balance</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-white font-semibold">Points</div>
              <div className="text-[#b97416] font-mono">{balance?.points ?? 0}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-white font-semibold">Tokens</div>
              <div className="text-[#b97416] font-mono">{balance?.tokens ?? 0}</div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full rounded-xl bg-[#e5a12b] text-black hover:bg-[#ffc263] font-bold"
            disabled={spinning || !canSpin}
            onClick={handleSpin}
          >
            {spinning ? "Spinning…" : "Spin the Wheel"}
          </Button>

          {result && (
            <div className="rounded-xl border border-[#e5a12b]/30 bg-[#e5a12b]/10 p-4">
              <div className="text-[#b97416] text-sm font-semibold">Your result</div>
              <div className="text-white text-xl font-bold mt-1">{prizeText ?? "—"}</div>
              {result.prizeType === "discount" && result.code && (
                <div className="text-xs text-gray-400 mt-2">
                  Apply at checkout using the received code.
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500">
            One wheel spin per account.
          </div>
        </div>
      </div>
    </div>
  );
}

