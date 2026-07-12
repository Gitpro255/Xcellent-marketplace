"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { AuthShell, authInputClass, authInputStyle } from "@/components/AuthShell";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/browse");
    router.refresh();
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    setNotice("");
    setError("");
    setResending(true);
    const res = await fetch("/api/auth/verify", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false);
    if (res.ok) {
      setNotice("A new code has been sent — check your inbox (and spam folder).");
      let seconds = 30;
      setCooldown(seconds);
      const timer = setInterval(() => {
        seconds -= 1;
        setCooldown(seconds);
        if (seconds <= 0) clearInterval(timer);
      }, 1000);
    } else {
      setError("Couldn't resend — try again shortly.");
    }
  };

  return (
    <AuthShell backHref="/signup">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-full" style={{ background: "var(--brass-bg)", width: 52, height: 52 }}>
          <Mail size={22} color="var(--brass)" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Verify your email</h2>
        <p className="mb-6 text-[13.5px]" style={{ color: "var(--ink-soft)" }}>
          We sent a 6-digit code to <strong>{email || "your email"}</strong>. Enter it below to confirm your account.
        </p>

        <form onSubmit={submit}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className={`${authInputClass} mb-2 text-center text-2xl tracking-[8px]`}
            style={authInputStyle}
          />
          {error && <p className="mb-2 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}
          {notice && <p className="mb-2 text-[13px]" style={{ color: "var(--success)" }}>{notice}</p>}

          <button type="submit" disabled={code.length < 6 || loading} className="w-full rounded-lg py-3 text-sm font-medium"
            style={{ background: code.length === 6 ? "var(--forest)" : "var(--line)", color: code.length === 6 ? "var(--paper)" : "var(--ink-soft)" }}>
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
        </form>

        <button onClick={resend} disabled={resending || cooldown > 0} className="mt-3.5 text-[13px]" style={{ color: resending || cooldown > 0 ? "var(--ink-soft)" : "var(--forest)" }}>
          {resending ? "Sending..." : cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
        </button>
      </div>
    </AuthShell>
  );
}