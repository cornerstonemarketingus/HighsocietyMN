"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  AGE_GATE_COOKIE_NAME,
  AGE_GATE_COOKIE_VALUE,
  safeAgeGateReturnTo,
} from "@/lib/age-gate";

export function AgeVerification({ initiallyVerified }: { initiallyVerified: boolean }) {
  const [show, setShow] = useState(!initiallyVerified);
  const router = useRouter();

  function handleVerify() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AGE_GATE_COOKIE_NAME}=${AGE_GATE_COOKIE_VALUE}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
    setShow(false);

    const params = new URLSearchParams(window.location.search);
    const returnTo = safeAgeGateReturnTo(params.get("returnTo"));
    if (returnTo) {
      router.replace(returnTo);
      router.refresh();
    }
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 text-center space-y-8">
        <div className="space-y-2">
          <div className="text-6xl font-bold text-[#e5a12b]">21+</div>
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
            <a href="/terms" className="text-[#e5a12b] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#e5a12b] hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              onClick={handleVerify}
              className="flex-1 border border-[#ffc263] !bg-[#e5a12b] !text-black hover:!bg-[#ffc263] focus-visible:!ring-[#e5a12b] font-bold py-3 text-base"
            >
              Yes, I&apos;m 21+
            </Button>
            <Button
              type="button"
              onClick={handleDeny}
              className="flex-1 border border-[#ffc263] !bg-[#e5a12b] !text-black hover:!bg-[#ffc263] focus-visible:!ring-[#e5a12b] font-bold py-3 text-base"
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
