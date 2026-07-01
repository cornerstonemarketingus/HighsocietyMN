import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeVerificationWrapper } from '@/components/auth/AgeVerificationWrapper';

export const metadata: Metadata = {
  title: {
    default: 'High Society MN — Premium Cannabis Dispensary',
    template: '%s | High Society MN',
  },
  description:
    'Premium cannabis products in Minneapolis, MN. Flower, edibles, vapes, concentrates and more. Age-verified 21+ dispensary.',
  keywords: ['cannabis', 'dispensary', 'Minneapolis', 'Minnesota', 'weed', '21+'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <AgeVerificationWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AgeVerificationWrapper>
      </body>
    </html>
  );
}
