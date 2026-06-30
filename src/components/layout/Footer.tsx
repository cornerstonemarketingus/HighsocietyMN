import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Leaf className="w-5 h-5 text-brand-400" />
              <span className="font-serif">High Society MN</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Premium cannabis products in Minneapolis, MN. Quality you can trust, service you&apos;ll love.
            </p>
            <p className="mt-4 text-xs text-yellow-400 font-semibold">
              ⚠️ For adults 21+ only. Cannabis is for legal use only.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['All Products', '/shop'],
                ['Flower',       '/shop?category=FLOWER'],
                ['Edibles',      '/shop?category=EDIBLES'],
                ['Vapes',        '/shop?category=VAPE_CARTS'],
                ['Concentrates', '/shop?category=CONCENTRATES'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['My Account',   '/account'],
                ['Order History','/account'],
                ['Cart',         '/cart'],
                ['Login',        '/login'],
                ['Register',     '/register'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} High Society MN. All rights reserved.</p>
          <p>Must be 21+ to purchase. Please consume responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
