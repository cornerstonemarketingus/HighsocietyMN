import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AgeVerification } from "@/components/AgeVerification";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: "High Society MN | Premium Cannabis Dispensary",
    template: "%s | High Society MN",
  },
  description:
    "Minnesota's premier cannabis dispensary. Shop premium flower, edibles, vapes, and concentrates. 21+ only. Store pickup available.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        <SessionProvider>
          <AgeVerification />
          {children}
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
