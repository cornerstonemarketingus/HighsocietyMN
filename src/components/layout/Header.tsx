import Link from "next/link";

const links = [
  ["Products", "/products"],
  ["Community", "/community"],
  ["Blog", "/blog"],
  ["Loyalty", "/loyalty"],
  ["Referral", "/referral"],
  ["Orders", "/orders"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-extrabold text-emerald-900">High Society MN</Link>
        <nav className="hidden gap-4 text-sm font-medium text-emerald-900 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-emerald-700">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/cart" className="rounded-lg border border-emerald-200 px-3 py-1.5">Cart</Link>
          <span className="rounded-lg bg-emerald-900 px-2 py-1 text-xs font-semibold text-emerald-50">GOLD +1200</span>
        </div>
      </div>
    </header>
  );
}
