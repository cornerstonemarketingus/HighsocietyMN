import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AgeVerification } from "@/components/AgeVerification";
import { ChatWidget } from "@/components/ChatWidget";
import { cookies } from "next/headers";
import { AGE_GATE_COOKIE_NAME, AGE_GATE_COOKIE_VALUE } from "@/lib/age-gate";

const headingFont = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "High Society MN | Premium Cannabis Dispensary",
    template: "%s | High Society MN",
  },
  description:
    "Minnesota's premium cannabis delivery boutique. Shop curated flower, edibles, vapes, and concentrates. Adults 21+ only.",
  keywords: [
    "cannabis dispensary Minnesota",
    "cannabis MN",
    "weed dispensary Minneapolis",
    "premium cannabis",
    "THC products Minnesota",
  ],
  openGraph: {
    title: "High Society MN | Premium Cannabis Dispensary",
    description:
      "Minnesota's premier cannabis dispensary. Premium products, exceptional service.",
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ageVerified = (await cookies()).get(AGE_GATE_COOKIE_NAME)?.value === AGE_GATE_COOKIE_VALUE;
  return (
    <html lang="en" className={`dark ${headingFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased bg-black text-white font-sans">
        <SessionProvider>
          <AgeVerification initiallyVerified={ageVerified} />
          {children}
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
