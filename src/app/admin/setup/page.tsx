"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Crown } from "lucide-react";

export default function AdminSetupPage() {
  return (
    <Suspense fallback={null}>
      <AdminSetupForm />
    </Suspense>
  );
}

function AdminSetupForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [email, setEmail] = useState("admin@highsocietymn.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Setup failed.");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-5 text-center">
          <Crown className="mx-auto h-10 w-10 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-950">Admin account ready.</h1>
          <p className="text-slate-600">You can now sign in with the email and password you just set.</p>
          <Link href="/login">
            <Button className="w-full">Go to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <Crown className="mx-auto h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-950">Set up admin access</h1>
          <p className="text-sm text-slate-600">Creates (or resets the password on) an admin account. Requires the setup token set as <code className="rounded bg-slate-100 px-1 py-0.5">ADMIN_SETUP_TOKEN</code> in your environment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Setup token</label>
            <Input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="From ADMIN_SETUP_TOKEN" required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Admin email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Admin password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Setting up…" : "Create / reset admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
