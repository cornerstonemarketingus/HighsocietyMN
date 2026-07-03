import Link from "next/link";
import { Leaf, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-amber-500" />
              <span className="text-lg font-bold text-white">
                High Society <span className="text-amber-500">MN</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Premium cannabis dispensary serving Minnesota with luxury
              products and exceptional service.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=flower", label: "Flower" },
                { href: "/products?category=edibles", label: "Edibles" },
                { href: "/products?category=vapes", label: "Vapes" },
                {
                  href: "/products?category=concentrates",
                  label: "Concentrates",
                },
                {
                  href: "/products?category=beverages",
                  label: "Beverages",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/compliance", label: "Compliance" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Visit Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Minneapolis, MN
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a
                  href="tel:+16125550000"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  (612) 555-0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <a
                  href="mailto:hello@highsocietymn.com"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  hello@highsocietymn.com
                </a>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Mon–Sat: 10am–9pm</p>
              <p>Sunday: 11am–7pm</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 space-y-4">
          <p className="text-center text-xs text-gray-500">
            ⚠️ Cannabis products are for adults 21+ only. Must show valid ID at
            pickup. Not for resale. Keep out of reach of children. Use
            responsibly.
          </p>
          <p className="text-center text-xs text-gray-600">
            © {new Date().getFullYear()} High Society MN. All rights reserved.
            Licensed Minnesota Cannabis Retailer.
          </p>
        </div>
      </div>
    </footer>
  );
}
