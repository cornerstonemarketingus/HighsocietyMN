import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AgeVerification } from "@/components/AgeVerification";
import { ChatWidget } from "@/components/ChatWidget";
import { WelcomeSpinWheel } from "@/components/WelcomeSpinWheel";

export const metadata: Metadata = {
  title: {
    default: "High Society MN | Premium Cannabis Delivery",
    template: "%s | High Society MN",
  },
  description:
    "Minnesota's premium cannabis discovery, community, rewards, and delivery experience for adults 21+.",
  keywords: [
    "cannabis dispensary Minnesota",
    "dispensary near me Minnesota",
    "cannabis MN",
    "weed dispensary Minneapolis",
    "premium cannabis",
    "THC products Minnesota",
  ],
  openGraph: {
    title: "High Society MN | Premium Cannabis Discovery",
    description:
      "Find nearby dispensaries, explore premium products, earn rewards, and join Minnesota's cannabis community.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        <SessionProvider>
          <AgeVerification />
          <WelcomeSpinWheel />
          {children}
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
