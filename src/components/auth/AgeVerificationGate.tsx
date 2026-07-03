"use client";

import { useState } from "react";

export function AgeVerificationGate() {
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) {
      setError("Please enter a valid birth date.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }

    if (age < 21) {
      setError("You must be at least 21 years old to enter this site.");
      return;
    }

    localStorage.setItem("ageVerified", "true");
    localStorage.setItem("ageVerifiedDate", new Date().toISOString());
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/90 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-emerald-950">21+ Age Verification</h2>
        <p className="mt-2 text-sm text-emerald-800">Minnesota law requires shoppers to be 21 or older.</p>
        <label className="mt-4 block text-sm font-semibold text-emerald-900">Date of birth</label>
        <input
          required
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
        />
        {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
        <button className="btn mt-4 w-full" type="submit">Verify & Enter</button>
      </form>
    </div>
  );
}
