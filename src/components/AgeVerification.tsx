"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SpinWheel } from "@/components/SpinWheel";

const AGE_VERIFIED_KEY = "hs_age_verified";

export function AgeVerification() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const verified = sessionStorage.getItem(AGE_VERIFIED_KEY);
    if (!verified) setShow(true);
  }, []);

  function handleVerify() {
    sessionStorage.setItem(AGE_VERIFIED_KEY, "true");
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  async function joinList(event: React.FormEvent) {
    event.preventDefault();
    setEmailError("");
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setEmailError(data.error || "Could not join the list.");
    setJoined(true);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-indigo-950/70 p-4 backdrop-blur-xl">
      <div className="my-auto grid max-h-[94vh] w-full max-w-5xl gap-6 overflow-y-auto rounded-3xl border border-indigo-100 bg-white p-6 text-center shadow-2xl lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
        <div className="space-y-8">
        <div className="space-y-2">
          <div className="text-6xl font-bold text-indigo-500">21+</div>
          <h1 className="text-3xl font-bold text-slate-950">High Society MN</h1>
          <p className="text-slate-500 text-lg">Premium Cannabis Marketplace</p>
        </div>

        <div className="border border-indigo-100 bg-indigo-50/60 rounded-2xl p-6 space-y-4">
          <p className="text-slate-950 font-medium text-lg">
            Are you 21 years of age or older?
          </p>
          <p className="text-slate-600 text-sm">
            You must be 21 years or older to enter this site. By entering, you
            confirm you are of legal age and agree to our{" "}
            <a href="/terms" className="text-indigo-400 hover:underline">
              Terms of Service
            </a>
            .
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleVerify}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-3 text-base"
            >
              Yes, I&apos;m 21+
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="flex-1 py-3 text-base"
            >
              No, exit
            </Button>
          </div>
        </div>

        <p className="text-slate-500 text-xs">
          Minnesota cannabis is for adults 21+. Please consume responsibly.
        </p>
        </div>

        <div className="flex items-center">
          {joined ? (
            <SpinWheel email={email} />
          ) : (
            <form onSubmit={joinList} className="w-full rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-left sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Private list</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Join, then spin for a reward.</h2>
              <p className="mt-3 text-slate-600">Get private drop alerts and one chance to win a percentage off your first order.</p>
              <label htmlFor="gate-email" className="mt-6 block text-sm font-medium text-slate-700">Email address</label>
              <input id="gate-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="you@example.com" />
              {emailError && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
              <Button type="submit" className="mt-4 w-full" size="lg">Join and unlock the wheel</Button>
              <p className="mt-3 text-xs text-slate-500">No spam. Unsubscribe anytime. Adults 21+ only.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
