'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type AgeVerificationGateProps = {
  onVerified?: () => void;
};

export function AgeVerificationGate({ onVerified }: AgeVerificationGateProps) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!birthDate) {
      setError('Please enter your date of birth');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }

    if (age < 21) {
      setError('You must be at least 21 years old to enter this site.');
      return;
    }

    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerifiedDate', new Date().toISOString());
    onVerified?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-10">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-bold text-black">
            21+
          </div>
          <h1 className="text-3xl font-bold">High Society MN</h1>
          <p className="mt-2 text-sm text-slate-300">Age verification required before entering the menu.</p>
        </div>

        <div className="mb-6 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-100">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-300" />
            <div>
              <p className="font-semibold">Minnesota cannabis is strictly 21+.</p>
              <p className="mt-1 text-brand-50/85">
                Please confirm your date of birth to continue browsing premium flower, vapes, edibles, and concentrates.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="birthDate" className="mb-2 block text-sm font-semibold text-slate-200">
              Date of birth
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand-400"
              required
            />
            {error ? <p className="mt-2 text-sm font-medium text-red-400">{error}</p> : null}
          </div>

          <Button type="submit" size="lg" className="w-full">
            Verify & Enter
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          By entering, you confirm you are 21+ and agree to our local compliance and responsible consumption guidelines.
        </p>
      </div>
    </div>
  );
}
