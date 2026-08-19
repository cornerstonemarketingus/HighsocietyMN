"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Crown, ShoppingBag, UserRound } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Shop all" },
  { href: "/products?category=flower", label: "Flower" },
  { href: "/products?category=edibles", label: "Edibles" },
  { href: "/products?category=vapes", label: "Vapes" },
  { href: "/products?category=concentrates", label: "Concentrates" },
  { href: "/drops", label: "Drop Vault" },
  { href: "/spin", label: "Games" },
  { href: "/blog", label: "Journal" },
] as const;

export function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b border-[#8a5710]/20 bg-[#070706]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="High Society MN home">
          <Crown className="h-7 w-7 fill-[#e5a12b]/15 text-[#e5a12b]" strokeWidth={1.5} />
          <span className="text-[15px] font-semibold uppercase text-white">High Society <span className="text-[#e5a12b]">MN</span></span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {navLinks.slice(0, 8).map(link => <Link key={link.href} href={link.href} className="text-xs text-zinc-400 transition hover:text-[#ffc263]">{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/cart" className="header-icon" aria-label="Shopping bag"><ShoppingBag className="h-5 w-5" /></Link>
          {session?.user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="header-icon" aria-label="Sign out"><UserRound className="h-5 w-5" /></button>
          ) : (
            <Link href="/login" className="header-icon" aria-label="Sign in"><UserRound className="h-5 w-5" /></Link>
          )}
        </div>
      </div>
      <nav className="mx-auto flex h-11 max-w-7xl items-center gap-6 overflow-x-auto border-t border-white/[0.06] px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden" aria-label="Mobile navigation">
        {navLinks.map(link => <Link key={link.href} href={link.href} className="shrink-0 text-[11px] uppercase text-zinc-400 transition hover:text-[#ffc263]">{link.label}</Link>)}
      </nav>
    </header>
  );
}
