"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Leaf, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropTimer } from "@/components/DropTimer";

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=flower", label: "Flower" },
  { href: "/products?category=edibles", label: "Edibles" },
  { href: "/products?category=vapes", label: "Vapes" },
  { href: "/products?category=concentrates", label: "Concentrates" },
];

const communityLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/forum", label: "Forum" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Leaf className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-bold text-white">
              High Society <span className="text-amber-500">MN</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-amber-400 transition-colors rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}

            {/* Community dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCommunityOpen(true)}
                onMouseLeave={() => setCommunityOpen(false)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-amber-400 transition-colors rounded-md hover:bg-white/5"
              >
                Community <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {communityOpen && (
                <div
                  onMouseEnter={() => setCommunityOpen(true)}
                  onMouseLeave={() => setCommunityOpen(false)}
                  className="absolute left-0 top-full pt-1 w-44 z-50"
                >
                  <div className="rounded-xl border border-white/10 bg-zinc-900 shadow-xl overflow-hidden">
                    {communityLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-colors"
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
              className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300 transition-colors rounded-md hover:bg-amber-500/10 font-medium"
            >
              ⚡ Drops
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Drop timer — desktop */}
            <div className="hidden lg:block">
              <DropTimer />
            </div>

            <Link
              href="/cart"
              className="relative p-2 text-gray-300 hover:text-amber-400 transition-colors"
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
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
            )}

            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
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
        <div className="md:hidden border-t border-white/10 bg-black">
          <div className="px-4 py-4 space-y-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-amber-400 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2" />
            {communityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-amber-400 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/drops"
              className="block text-amber-400 hover:text-amber-300 py-2 text-sm font-medium"
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

