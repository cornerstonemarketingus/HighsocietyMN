"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=flower", label: "Flower" },
  { href: "/products?category=edibles", label: "Edibles" },
  { href: "/products?category=vapes", label: "Vapes" },
  { href: "/products?category=concentrates", label: "Concentrates" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-bold text-white">
              High Society <span className="text-amber-500">MN</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
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
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-amber-400 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
