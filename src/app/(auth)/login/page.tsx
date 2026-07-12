"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell, authInputClass, authInputStyle } from "@/components/AuthShell";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/browse";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = email.includes("@") && password.length >= 1;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (data.needsVerification) {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(data.error || "Something went wrong");
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <div className="flex justify-center"><Logo size={40} /></div>
        <h2 className="mb-1 mt-3.5 text-xl font-semibold">Welcome back</h2>
      </div>

      <form onSubmit={submit}>
        <div className="mb-3.5">
          <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>Email address</label>
          <input type="email" className={authInputClass} style={authInputStyle} value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} className={authInputClass} style={authInputStyle} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-2.5" style={{ color: "var(--ink-soft)" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="mb-3 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}

        <button type="submit" disabled={!valid || loading} className="w-full rounded-lg py-3 text-sm font-medium"
          style={{ background: valid ? "var(--forest)" : "var(--line)", color: valid ? "var(--paper)" : "var(--ink-soft)" }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px]" style={{ color: "var(--ink-soft)" }}>
        New here? <Link href="/signup" className="font-medium" style={{ color: "var(--forest)" }}>Create an account</Link>
      </p>
    </AuthShell>
  );
}