"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SpinWheel } from "@/components/SpinWheel";
import { BrandMark } from "@/components/BrandMark";

const AGE_VERIFIED_KEY = "hs_age_verified";
const BUD_SEEKER_EMAIL_KEY = "hs_budseeker_email";

export function AgeVerification() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<"age" | "choice" | "reward">("age");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(AGE_VERIFIED_KEY)) setShow(true);
  }, []);

  function enterSite() {
    sessionStorage.setItem(AGE_VERIFIED_KEY, "true");
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  async function joinList(event: React.FormEvent) {
    event.preventDefault();
    setEmailError("");
    setJoining(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return setEmailError(data.error || "Could not join the list.");
      localStorage.setItem(BUD_SEEKER_EMAIL_KEY, normalizedEmail);
      setEmail(normalizedEmail);
      setStep("reward");
    } finally {
      setJoining(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-indigo-950/80 p-4 backdrop-blur-xl">
      <div className="my-auto w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-indigo-100 bg-white p-6 text-center shadow-2xl sm:p-9">
        <BrandMark className="mx-auto h-14 w-14" />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">High Society Minnesota</p>

        {step === "age" && (
          <div className="mx-auto mt-7 max-w-xl">
            <div className="text-6xl font-bold text-indigo-700">21+</div>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Are you 21 years of age or older?</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">You must be 21 or older to enter. By continuing, you confirm your age and agree to our <a href="/terms" className="font-medium text-indigo-700 underline">Terms of Service</a>.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setStep("choice")} size="lg">Yes, I&apos;m 21+</Button>
              <Button onClick={handleDeny} variant="outline" size="lg">No, exit</Button>
            </div>
          </div>
        )}

        {step === "choice" && (
          <div className="mx-auto mt-7 max-w-xl rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-left sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Private list</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Unlock Bud Seeker and your welcome spin.</h1>
            <p className="mt-3 leading-7 text-slate-600">Join for private drop alerts, nearby dispensary search, and one chance at a welcome offer—or continue without signup.</p>
            <form onSubmit={joinList}>
              <label htmlFor="gate-email" className="mt-6 block text-sm font-medium text-slate-700">Email address</label>
              <input id="gate-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="you@example.com" />
              {emailError && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
              <Button type="submit" className="mt-4 w-full" size="lg" disabled={joining}>{joining ? "Joining…" : "Join and unlock"}</Button>
            </form>
            <button type="button" onClick={enterSite} className="mt-4 w-full py-2 text-sm font-semibold text-slate-600 hover:text-indigo-700">No thanks, continue to the site</button>
            <p className="mt-3 text-center text-xs text-slate-500">No spam. Unsubscribe anytime. Adults 21+ only.</p>
          </div>
        )}

        {step === "reward" && (
          <div className="mt-5">
            <SpinWheel email={email} />
            <Button onClick={enterSite} size="lg" className="mt-2 w-full sm:w-auto">Continue to shop</Button>
          </div>
        )}

        <p className="mt-7 text-xs text-slate-500">Minnesota cannabis is for adults 21+. Please consume responsibly.</p>
      </div>
    </div>
  );
}
