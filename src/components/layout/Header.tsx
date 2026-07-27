"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropTimer } from "@/components/DropTimer";
import { BudSeekerTrigger } from "@/components/BudSeekerTrigger";
import { BrandMark } from "@/components/BrandMark";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/drops", label: "Drops" },
  { href: "/forum", label: "Lounge" },
  { href: "/blog", label: "Journal" },
  { href: "/rewards", label: "Rewards" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-[0_10px_35px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.75rem] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="High Society MN home">
            <BrandMark />
            <span className="leading-none">
              <span className="block text-lg font-semibold tracking-[0.02em] text-slate-950">High Society</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.34em] text-indigo-600">Minnesota</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
            <BudSeekerTrigger compact />
            {navLinks.slice(2).map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Drop timer — desktop */}
            <div className="hidden 2xl:block">
              <DropTimer />
            </div>

            <Link
              href="/cart"
              className="relative p-2 text-slate-700 hover:text-indigo-400 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="p-2 text-slate-700 hover:text-indigo-400 transition-colors"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="hidden text-xs text-slate-500 sm:block">Sign out</button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
            )}

            <button
              className="p-2 text-slate-700 hover:text-slate-950 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-indigo-400 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <BudSeekerTrigger compact />
            </div>
            <div className="pt-2">
              <DropTimer />
            </div>
            {!session?.user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
