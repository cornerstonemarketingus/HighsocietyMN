"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  AGE_GATE_COOKIE_NAME,
  AGE_GATE_COOKIE_VALUE,
} from "@/lib/age-gate";

function hasAgeVerificationCookie(): boolean {
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .some((part) => part === `${AGE_GATE_COOKIE_NAME}=${AGE_GATE_COOKIE_VALUE}`);
}

export function AgeVerification() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasAgeVerificationCookie()) {
      // Schedule on next tick.
      const t = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(t);
    }
  }, []);

  function handleVerify() {
    setSubmitting(true);

    void (async () => {
      try {
        const res = await fetch("/api/age/verify", { method: "POST" });
        if (!res.ok) {
          return;
        }

        setShow(false);

        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo");
        if (returnTo && returnTo.startsWith("/")) {
          router.replace(returnTo);
        }
      } finally {
        setSubmitting(false);
      }
    })();
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
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-amber-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleVerify}
              disabled={submitting}
              className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-bold py-3 text-base"
            >
              {submitting ? "Verifying..." : "Yes, I&apos;m 21+"}
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
