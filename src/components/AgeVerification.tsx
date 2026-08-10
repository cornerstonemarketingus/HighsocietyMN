"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SpinWheel } from "@/components/SpinWheel";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md overflow-y-auto rounded-2xl border-2 border-black bg-white p-6 text-center shadow-[10px_10px_0_0_rgba(34,197,94,1)] sm:p-9">
        <div className="text-2xl font-black uppercase tracking-tight">
          <span className="text-slate-950">High </span>
          <span className="bg-green-500 px-2 py-0.5 text-black">Society</span>
        </div>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-green-600">Minnesota</p>

        {step === "age" && (
          <div className="mx-auto mt-6 max-w-sm">
            <h1 className="text-2xl font-black text-slate-950">This is a cannabis website</h1>
            <button type="button" className="mt-4 rounded-md border-2 border-black px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-green-500">
              Notice to visitors
            </button>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              This website lists age-restricted cannabis products. By entering, you affirm
              that you are at least 21 years of age, the legal age to purchase cannabis in
              Minnesota, and you agree to our{" "}
              <a href="/terms" className="font-medium text-green-700 underline">Terms of Service</a>.
            </p>
            <a href="/compliance" className="mt-2 inline-block text-xs font-bold text-green-700 hover:text-green-600">
              Minnesota compliance notice
            </a>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="w-full rounded-md border-2 border-black bg-green-500 py-3.5 text-sm font-bold text-black transition hover:bg-green-400"
              >
                I am 21 or older — Enter
              </button>
              <button
                type="button"
                onClick={handleDeny}
                className="w-full rounded-md border-2 border-black bg-white py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                I am under 21 — Exit
              </button>
            </div>
          </div>
        )}

        {step === "choice" && (
          <div className="mx-auto mt-6 max-w-sm rounded-xl border-2 border-black bg-slate-50 p-6 text-left sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Private list</p>
            <h1 className="mt-3 text-2xl font-black text-slate-950">Unlock Bud Seeker and your welcome spin.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Join for private drop alerts, nearby dispensary search, and one chance at a welcome offer—or continue without signup.</p>
            <form onSubmit={joinList}>
              <label htmlFor="gate-email" className="mt-6 block text-sm font-medium text-slate-700">Email address</label>
              <input id="gate-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border-2 border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                placeholder="you@example.com" />
              {emailError && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
              <Button type="submit" className="mt-4 w-full !rounded-md !border-2 !border-black !bg-green-500 !text-black hover:!bg-green-400" size="lg" disabled={joining}>{joining ? "Joining…" : "Join and unlock"}</Button>
            </form>
            <button type="button" onClick={enterSite} className="mt-4 w-full py-2 text-sm font-semibold text-slate-500 hover:text-green-700">No thanks, continue to the site</button>
            <p className="mt-3 text-center text-xs text-slate-500">No spam. Unsubscribe anytime. Adults 21+ only.</p>
          </div>
        )}

        {step === "reward" && (
          <div className="mt-5">
            <SpinWheel email={email} />
            <Button onClick={enterSite} size="lg" className="mt-2 w-full !rounded-md !border-2 !border-black !bg-green-500 !text-black hover:!bg-green-400 sm:w-auto">Continue to shop</Button>
          </div>
        )}

        <p className="mt-7 text-xs text-slate-500">Minnesota cannabis is for adults 21+. Please consume responsibly.</p>
      </div>
    </div>
  );
}
