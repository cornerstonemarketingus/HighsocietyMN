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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 text-center space-y-8">
        <div className="space-y-2">
          <div className="text-6xl font-bold text-amber-500">21+</div>
          <h1 className="text-3xl font-bold text-white">High Society MN</h1>
          <p className="text-gray-400 text-lg">Premium Cannabis Dispensary</p>
        </div>

        <div className="border border-white/10 rounded-xl p-6 space-y-4">
          <p className="text-white font-medium text-lg">
            Are you 21 years of age or older?
          </p>
          <p className="text-gray-400 text-sm">
            You must be 21 years or older to enter this site. By entering, you
            confirm you are of legal age and agree to our{" "}
            <a href="/terms" className="text-amber-400 hover:underline">
              Terms of Service
            </a>
            .
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleVerify}
              className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-bold py-3 text-base"
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

        <p className="text-gray-600 text-xs">
          Minnesota cannabis is for adults 21+. Please consume responsibly.
        </p>
      </div>
    </div>
  );
}
