import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/70 py-10 light:bg-white/70">
      <div className="page-shell grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <h3 className="text-lg font-bold text-white light:text-slate-900">High Society MN</h3>
          <p className="mt-3 max-w-md text-sm text-slate-400 light:text-slate-600">
            Premium Minnesota cannabis retail with elevated product curation, fast pickup scheduling, and a community-first membership experience.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Shop</h4>
          <div className="mt-4 space-y-2 text-sm text-slate-300 light:text-slate-700">
            <Link href="/products">Menu</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Community</h4>
          <div className="mt-4 space-y-2 text-sm text-slate-300 light:text-slate-700">
            <Link href="/community">Forum</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/loyalty">Loyalty</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Visit</h4>
          <div className="mt-4 space-y-2 text-sm text-slate-300 light:text-slate-700">
            <p>Open daily · 9am – 9pm</p>
            <p>Minneapolis, Minnesota</p>
            <p>Support: hello@highsocietymn.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
