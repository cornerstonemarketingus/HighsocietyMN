'use client';

import { useState, useEffect } from 'react';
import { AgeVerificationGate } from './AgeVerificationGate';

export function AgeVerificationWrapper({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ageVerified');
    setVerified(stored === 'true');
  }, []);

  // Still hydrating
  if (verified === null) return null;

  if (!verified) return <AgeVerificationGate />;

  return <>{children}</>;
}
