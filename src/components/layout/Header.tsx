"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Leaf, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropTimer } from "@/components/DropTimer";
import { BudSeekerTrigger } from "@/components/BudSeekerTrigger";

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=flower", label: "Flower" },
  { href: "/products?category=edibles", label: "Edibles" },
  { href: "/products?category=vapes", label: "Vapes" },
  { href: "/products?category=concentrates", label: "Concentrates" },
];

const communityLinks = [
  { href: "/blog", label: "Journal" },
  { href: "/forum", label: "Member Lounge" },
  { href: "/rewards", label: "Rewards" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Leaf className="h-7 w-7 text-indigo-500" />
            <span className="text-xl font-bold text-slate-950">
              High Society <span className="text-indigo-500">MN</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-slate-700 hover:text-indigo-400 transition-colors rounded-md hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}

            {/* Community dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCommunityOpen(true)}
                onMouseLeave={() => setCommunityOpen(false)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-indigo-400 transition-colors rounded-md hover:bg-slate-50"
              >
                Community <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {communityOpen && (
                <div
                  onMouseEnter={() => setCommunityOpen(true)}
                  onMouseLeave={() => setCommunityOpen(false)}
                  className="absolute left-0 top-full pt-1 w-44 z-50"
                >
                  <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    {communityLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 text-sm text-slate-700 hover:text-indigo-400 hover:bg-slate-50 transition-colors"
                        onClick={() => setCommunityOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/drops"
              className="px-3 py-2 text-sm text-indigo-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-500/10 font-medium"
            >
              ⚡ Drops
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="hidden xl:block">
              <BudSeekerTrigger compact />
            </div>
            {/* Drop timer — desktop */}
            <div className="hidden lg:block">
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
              className="md:hidden p-2 text-slate-700 hover:text-slate-950"
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
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-indigo-400 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 my-2" />
            {communityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-indigo-400 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/drops"
              className="block text-indigo-400 hover:text-indigo-600 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              ⚡ Drops
            </Link>
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
