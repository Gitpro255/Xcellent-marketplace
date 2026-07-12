"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, PlusCircle } from "lucide-react";
import { money, nairaToKobo } from "@/lib/format";

type Product = { id: string; title: string; price: number; stock: number; category: string };
type OrderItem = { id: string; orderId: string; title: string; price: number; qty: number; status: string; buyer: string };

const FEE_RATE = 0.08;

export function SellerDashboardClient({
  shopName, revenue, products, orders,
}: { shopName: string; revenue: number; products: Product[]; orders: OrderItem[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"listings" | "orders">("listings");
  const [showForm, setShowForm] = useState(false);

  const fees = revenue * FEE_RATE;
  const payout = revenue - fees;

  return (
    <div>
      <div className="mb-1 text-[11px] tracking-widest" style={{ color: "var(--brass)" }}>{shopName.toUpperCase()}</div>
      <h2 className="font-display mb-5 text-2xl">Seller dashboard</h2>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Revenue" value={money(revenue)} icon={<TrendingUp size={16} />} />
        <Metric label="Marketplace fees" value={`-${money(fees)}`} sub={`${(FEE_RATE * 100).toFixed(0)}% rate`} />
        <Metric label="Net payout" value={money(payout)} accent />
        <Metric label="Active listings" value={String(products.length)} />
      </div>

      <div className="mb-4 flex gap-1 border-b" style={{ borderColor: "var(--line)" }}>
        {(["listings", "orders"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2.5 text-[13px] font-medium"
            style={{ borderBottom: tab === t ? "2px solid var(--forest)" : "2px solid transparent", color: tab === t ? "var(--ink)" : "var(--ink-soft)" }}>
            {t === "listings" ? "Listings" : "Incoming orders"}
          </button>
        ))}
      </div>

      {tab === "listings" ? (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="mb-3.5 flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px]" style={{ background: "var(--forest)", color: "var(--paper)" }}>
            <PlusCircle size={15} /> {showForm ? "Cancel" : "New listing"}
          </button>
          {showForm && <NewListingForm onCreated={() => { setShowForm(false); router.refresh(); }} />}
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                <th className="py-2">Listing</th><th className="py-2">Price</th><th className="py-2">Stock</th><th className="py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b" style={{ borderColor: "var(--line)" }}>
                  <td className="py-2.5">{p.title}</td>
                  <td className="font-mono py-2.5">{money(p.price)}</td>
                  <td className="py-2.5">{p.stock}</td>
                  <td className="py-2.5">{p.category}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>No listings yet — create your first above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b py-3 text-[13px]" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="font-mono font-medium">{o.orderId}</div>
                <div style={{ color: "var(--ink-soft)" }}>{o.title} · {o.buyer}</div>
              </div>
              <div className="text-right">
                <div className="font-mono">{money(o.price * o.qty)}</div>
                <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{o.status}</div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p style={{ color: "var(--ink-soft)" }}>No orders yet.</p>}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, sub, icon, accent }: { label: string; value: string; sub?: string; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-lg p-3.5" style={accent ? { background: "var(--forest)", color: "var(--paper)" } : { border: "1px solid var(--line)", background: "var(--surface)" }}>
      <div className="mb-1.5 flex items-center gap-1 text-[11px]" style={{ color: accent ? "var(--brass-light)" : "var(--ink-soft)" }}>{icon}{label.toUpperCase()}</div>
      <div className="font-mono text-base font-medium">{value}</div>
      {sub && <div className="mt-0.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>{sub}</div>}
    </div>
  );
}

function NewListingForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", priceNaira: "", category: "Home & Craft", stock: "", emoji: "🛍️", color: "#8B5E34" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: nairaToKobo(Number(form.priceNaira)),
        category: form.category,
        stock: Number(form.stock),
        emoji: form.emoji,
        color: form.color,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    onCreated();
  };

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm outline-none";
  const inputStyle = { borderColor: "var(--line)", background: "var(--paper)", color: "var(--ink)" };

  return (
    <div className="mb-5 rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <div className="mb-2.5 grid grid-cols-2 gap-2.5">
        <input className={inputCls} style={inputStyle} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="Price (₦)" type="number" value={form.priceNaira} onChange={(e) => setForm({ ...form, priceNaira: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      </div>
      <textarea className={inputCls} style={{ ...inputStyle, marginBottom: 10 }} placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      {error && <p className="mb-2 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}
      <button onClick={submit} disabled={loading} className="rounded-lg px-4 py-2 text-[13px] font-medium" style={{ background: "var(--forest)", color: "var(--paper)" }}>
        {loading ? "Creating..." : "Create listing"}
      </button>
    </div>
  );
}
