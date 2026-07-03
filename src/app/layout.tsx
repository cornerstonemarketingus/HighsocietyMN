import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BudtenderWidget } from "@/components/chat/BudtenderWidget";

export const metadata: Metadata = {
  title: "High Society MN",
  description: "AAA SaaS dispensary live demo with chat, loyalty, community, and scheduling.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
        <BudtenderWidget />
      </body>
    </html>
  );
}
