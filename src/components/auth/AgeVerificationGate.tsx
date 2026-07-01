'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function AgeVerificationGate() {
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
      age--;
    }

    if (age < 21) {
      setError('You must be at least 21 years old to enter this site.');
      return;
    }

    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerifiedDate', new Date().toISOString());
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-700 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            21+
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">High Society MN</h1>
          <p className="text-gray-600">Age Verification Required</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Age Restricted</p>
              <p className="text-sm text-yellow-700">
                You must be at least 21 years old to enter this site and purchase cannabis products.
              </p>
            </div>
          </div>

          <p className="text-gray-700 text-center mb-4">
            Please verify your age by entering your date of birth.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
          >
            Verify &amp; Enter
          </button>
        </form>

        {/* Legal Text */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By entering this site, you acknowledge that you are 21+ years old and agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
