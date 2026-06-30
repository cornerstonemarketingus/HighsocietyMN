import type { Metadata } from 'next';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'High Society MN',
  description: 'Premium cannabis dispensary live demo',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-50 text-slate-900">
        <ToastProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
