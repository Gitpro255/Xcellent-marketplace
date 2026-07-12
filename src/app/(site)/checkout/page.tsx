"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Banknote } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useUser } from "@/components/useUser";
import { money } from "@/lib/format";

const SHIPPING = 250000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { user, loading: userLoading } = useUser();

  const [form, setForm] = useState({ address: "", city: "", state: "" });
  const [method, setMethod] = useState<"CARD" | "BANK_TRANSFER" | "COD">("CARD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userLoading && !user) router.push("/login?redirect=/checkout");
  }, [userLoading, user, router]);

  useEffect(() => {
    if (!userLoading && user && items.length === 0) router.push("/cart");
  }, [userLoading, user, items.length, router]);

  const total = subtotal + SHIPPING;
  const valid = form.address && form.city && form.state;

  const methods = [
    { id: "CARD" as const, label: "Card (Paystack / Flutterwave)", icon: <CreditCard size={16} /> },
    { id: "BANK_TRANSFER" as const, label: "Bank transfer", icon: <Landmark size={16} /> },
    { id: "COD" as const, label: "Cash on delivery", icon: <Banknote size={16} /> },
  ];

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        address: form.address,
        city: form.city,
        state: form.state,
        paymentMethod: method,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    if (data.authorizationUrl) {
      // Cart clears once Paystack redirects back to /checkout/success.
      window.location.href = data.authorizationUrl;
      return;
    }
    clear();
    router.push(`/checkout/success?order=${data.orderId}`);
  };

  if (userLoading || !user || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-[640px]">
      <h2 className="mb-5 text-2xl font-semibold">Checkout</h2>

      <div className="mb-4 rounded-xl border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <h3 className="mb-3 text-[13px]" style={{ color: "var(--ink-soft)" }}>DELIVERY ADDRESS</h3>
        <FormField label="Address"><input className={inputCls} style={inputStyle} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="12 Millbrook Lane" /></FormField>
        <div className="flex gap-2.5">
          <FormField label="City" flex><input className={inputCls} style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Jos" /></FormField>
          <FormField label="State" flex><input className={inputCls} style={inputStyle} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Plateau" /></FormField>
        </div>
      </div>

      <div className="mb-4 rounded-xl border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <h3 className="mb-3 text-[13px]" style={{ color: "var(--ink-soft)" }}>PAYMENT METHOD</h3>
        <div className="flex flex-col gap-2">
          {methods.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)} className="flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[13.5px]"
              style={{ borderColor: method === m.id ? "var(--forest)" : "var(--line)", background: method === m.id ? "var(--brass-bg)" : "var(--paper)" }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        {method === "BANK_TRANSFER" && <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>Transfer to <strong>Excellent Ishaku</strong> — 1034751725, GTBank. Order ships once payment reflects.</p>}
        {method === "COD" && <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>Pay in cash when your order is delivered. Available in select cities only.</p>}
      </div>

      <div className="rounded-xl border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Shipping" value={money(SHIPPING)} />
        <div className="perf my-3" />
        <Row label="Total due" value={money(total)} bold />
        {error && <p className="mt-3 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}
        <button disabled={!valid || submitting} onClick={submit} className="mt-3.5 w-full rounded-lg py-3 text-sm font-medium"
          style={{ background: valid ? "var(--forest)" : "var(--line)", color: valid ? "var(--paper)" : "var(--ink-soft)" }}>
          {submitting ? "Placing order..." : method === "CARD" ? "Continue to payment" : "Place order"}
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border px-3 py-2.5 text-sm outline-none";
const inputStyle = { borderColor: "var(--line)", background: "var(--paper)", color: "var(--ink)" };

function FormField({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  return (
    <div className={`mb-3 ${flex ? "flex-1" : ""}`}>
      <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? "text-base font-semibold" : "text-[13px]"}`}>
      <span>{label}</span><span className="font-mono">{value}</span>
    </div>
  );
}
