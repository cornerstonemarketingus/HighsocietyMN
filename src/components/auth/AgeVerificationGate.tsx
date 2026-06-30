'use client';

import { useState } from 'react';

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
      age -= 1;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            21+
          </div>
          <h1 className="text-3xl font-bold mb-2">High Society MN</h1>
          <p className="text-gray-600">Age Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="birthDate">
              Date of Birth
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            {error && <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>}
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold">
            Verify & Enter
          </button>
        </form>
      </div>
    </div>
  );
}
