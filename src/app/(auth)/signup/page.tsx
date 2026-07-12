"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell, authInputClass, authInputStyle } from "@/components/AuthShell";
import { Logo } from "@/components/Logo";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "buyer" as "buyer" | "seller", agree: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = form.name && form.email.includes("@") && form.phone && form.password.length >= 6 && form.agree;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    router.push(`/verify?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <div className="flex justify-center"><Logo size={40} /></div>
        <h2 className="mb-1 mt-3.5 text-xl font-semibold">Create your account</h2>
        <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>Buy from sellers or open your own shop.</p>
      </div>

      <form onSubmit={submit}>
        <Field label="Full name">
          <input className={authInputClass} style={authInputStyle} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Amaka Chukwu" />
        </Field>
        <Field label="Email address">
          <input type="email" className={authInputClass} style={authInputStyle} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Phone number">
          <input className={authInputClass} style={authInputStyle} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0803 123 4567" />
        </Field>
        <Field label="Password (min 6 characters)">
          <div className="relative">
            <input type={showPw ? "text" : "password"} className={authInputClass} style={authInputStyle} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-2.5" style={{ color: "var(--ink-soft)" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <Field label="I want to">
          <div className="flex gap-2">
            {(["buyer", "seller"] as const).map((r) => (
              <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                className="flex-1 rounded-lg border py-2.5 text-[13px] capitalize"
                style={{
                  borderColor: form.role === r ? "var(--forest)" : "var(--line)",
                  background: form.role === r ? "var(--forest)" : "var(--surface)",
                  color: form.role === r ? "var(--paper)" : "var(--ink)",
                }}>
                {r === "buyer" ? "Shop" : "Sell"}
              </button>
            ))}
          </div>
        </Field>

        <label className="mb-4 flex items-start gap-2 text-[12.5px]" style={{ color: "var(--ink-soft)" }}>
          <input type="checkbox" className="mt-0.5" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
          I agree to the <Link href="/terms" className="underline" style={{ color: "var(--forest)" }}>Terms</Link> and{" "}
          <Link href="/privacy" className="underline" style={{ color: "var(--forest)" }}>Privacy Policy</Link>
        </label>

        {error && <p className="mb-3 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}

        <button type="submit" disabled={!valid || loading} className="w-full rounded-lg py-3 text-sm font-medium"
          style={{ background: valid ? "var(--forest)" : "var(--line)", color: valid ? "var(--paper)" : "var(--ink-soft)" }}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px]" style={{ color: "var(--ink-soft)" }}>
        Already have an account? <Link href="/login" className="font-medium" style={{ color: "var(--forest)" }}>Log in</Link>
      </p>
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>{label}</label>
      {children}
    </div>
  );
}
