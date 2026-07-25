import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { BrandMark } from "@/components/BrandMark";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12" id="newsletter">
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrandMark className="h-8 w-8" />
              <span className="text-lg font-bold text-slate-950">
                High Society <span className="text-indigo-500">MN</span>
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Premium cannabis delivery boutique serving Saint Paul and Minneapolis with a luxury, discreet experience.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-400"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-400"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950">
              Shop
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=flower", label: "Flower" },
                { href: "/products?category=edibles", label: "Edibles" },
                { href: "/products?category=vapes", label: "Vapes" },
                { href: "/products?category=concentrates", label: "Concentrates" },
                { href: "/products?category=beverages", label: "Beverages" },
                { href: "/drops", label: "⚡ Drops" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950">
              Community
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/forum", label: "Forum" },
                { href: "/about", label: "About Us" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/compliance", label: "Compliance" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950">
              Delivery Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span className="text-sm text-slate-600">
                  Saint Paul & Minneapolis Metro
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                <a
                  href="mailto:hello@highsocietymn.com"
                  className="text-sm text-slate-600 transition-colors hover:text-indigo-400"
                >
                  hello@highsocietymn.com
                </a>
              </div>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p>Delivery windows: Tue · Thu · Sat</p>
              <p>New drops land at 10am</p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-slate-200 pt-8">
          <p className="text-center text-xs text-slate-500">
            ⚠️ Cannabis products are for adults 21+ only. Valid ID required at delivery. Not for resale. Keep out of reach of children. Use responsibly.
          </p>
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} High Society MN. All rights reserved. Products and services are offered only where authorized by applicable Minnesota law.
          </p>
        </div>
      </div>
    </footer>
  );
}
