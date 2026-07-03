'use client';

import { useEffect, useState } from 'react';
import { AgeVerificationGate } from '@/components/auth/AgeVerificationGate';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified') === 'true';
    setIsVerified(verified);
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      {!isVerified ? <AgeVerificationGate onVerified={() => setIsVerified(true)} /> : null}
      <div className="relative min-h-screen bg-background text-foreground">
        <Header />
        <main>{children}</main>
        <Footer />
        <CartSidebar />
        <ChatWidget />
      </div>
    </>
  );
}
