"use client";

import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/format";

const FEE_RATE = 0.08;
const SHIPPING = 250000; // kobo

export default function CartPage() {
  const { items, updateQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingCart size={36} style={{ color: "var(--ink-soft)" }} className="mx-auto mb-3" />
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-5" style={{ color: "var(--ink-soft)" }}>Add something from one of our sellers to get started.</p>
        <Link href="/browse" className="rounded-lg px-5 py-2.5 text-sm" style={{ background: "var(--forest)", color: "var(--paper)" }}>Browse listings</Link>
      </div>
    );
  }

  const fee = subtotal * FEE_RATE;
  const total = subtotal + SHIPPING;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Your cart ({items.length})</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3.5 border-b py-3.5" style={{ borderColor: "var(--line)" }}>
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg text-2xl" style={{ background: item.color || "#8B5E34" }}>
              {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : item.emoji}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="mb-2 text-xs" style={{ color: "var(--ink-soft)" }}>{item.shopName}</div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center rounded-md border" style={{ borderColor: "var(--line)" }}>
                  <button onClick={() => updateQty(item.productId, -1)} className="px-2 py-1"><Minus size={12} /></button>
                  <span className="font-mono min-w-[18px] text-center text-xs">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="px-2 py-1"><Plus size={12} /></button>
                </div>
                <button onClick={() => remove(item.productId)} className="flex items-center gap-1 text-xs" style={{ color: "var(--danger)" }}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
            <div className="font-mono font-medium">{money(item.price * item.qty)}</div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-xl border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <h3 className="mb-3.5 text-base font-semibold">Order summary</h3>
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Marketplace fee" value={money(fee)} sub />
        <Row label="Shipping" value={money(SHIPPING)} />
        <div className="perf my-3" />
        <Row label="Total" value={money(total)} bold />
        <Link href="/checkout" className="mt-3.5 block w-full rounded-lg py-3 text-center text-sm font-medium" style={{ background: "var(--forest)", color: "var(--paper)" }}>
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? "text-base font-semibold" : "text-[13px]"}`} style={{ color: sub ? "var(--ink-soft)" : "var(--ink)" }}>
      <span>{label}</span><span className="font-mono">{value}</span>
    </div>
  );
}
