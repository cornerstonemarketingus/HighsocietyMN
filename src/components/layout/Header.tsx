import Link from 'next/link';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-emerald-900">
          High Society MN
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-emerald-800">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
