"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropTimer } from "@/components/DropTimer";
import { BrandMark } from "@/components/BrandMark";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/drops", label: "Drops" },
  { href: "/forum", label: "Lounge" },
  { href: "/blog", label: "Journal" },
  { href: "/games", label: "Games" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.75rem] items-center justify-between">
          <div className="flex shrink-0 items-center gap-2">
            {/* Mobile menu toggle — leftmost, like a hamburger nav */}
            <button
              className="-ml-2 p-2 text-slate-900 hover:text-green-600 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5" aria-label="High Society MN home">
              <BrandMark className="text-slate-950" />
              <span className="leading-none">
                <span className="font-display block text-lg uppercase tracking-tight text-slate-950">
                  High <span className="bg-green-500 px-1 text-black">Society</span>
                </span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.34em] text-green-600">Minnesota</span>
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wide text-slate-700 transition-colors hover:text-green-600"
              >
                {link.label}
              </Link>
            ))}
            {navLinks.slice(2).map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-bold uppercase tracking-wide text-slate-700 transition-colors hover:text-green-600">
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
              href="/products"
              className="p-2 text-slate-800 transition-colors hover:text-green-600"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-slate-800 transition-colors hover:text-green-600"
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
                    className="p-2 text-slate-800 transition-colors hover:text-green-600"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="hidden text-xs font-medium text-slate-500 sm:block">Sign out</button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden rounded-md !bg-black !text-white hover:!bg-slate-800 sm:flex">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t-2 border-black bg-white lg:hidden">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-bold uppercase tracking-wide text-slate-800 hover:text-green-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <DropTimer />
            </div>
            {!session?.user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 !bg-black !text-white hover:!bg-slate-800">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
