"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const AGE_VERIFIED_KEY = "hs_age_verified";

export function AgeVerification() {
  const [show, setShow] = useState(false);

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-2xl space-y-8">
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
              className="flex-1 bg-indigo-600 text-slate-950 hover:bg-indigo-700 font-bold py-3 text-base"
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
    </div>
  );
}
