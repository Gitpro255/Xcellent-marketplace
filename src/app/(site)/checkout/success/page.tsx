import Link from "next/link";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import { ClearCartOnMount } from "./ClearCartOnMount";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const order = searchParams.order
    ? await prisma.order.findUnique({ where: { id: searchParams.order }, include: { items: true } })
    : null;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <h2 className="mb-2 text-xl font-semibold">Order not found</h2>
        <Link href="/browse" className="text-sm underline">Back to browsing</Link>
      </div>
    );
  }

  const paid = order.status !== "PENDING" && order.status !== "CANCELLED";

  return (
    <div className="mx-auto max-w-[480px] py-8 text-center">
      <ClearCartOnMount />
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: paid ? "var(--forest)" : "var(--brass)" }}>
        <Check size={26} color="var(--paper)" />
      </div>
      <h2 className="mb-1.5 text-xl font-semibold">{paid ? "Order placed" : "Payment processing"}</h2>
      <p className="mb-5" style={{ color: "var(--ink-soft)" }}>
        Confirmation <span className="font-mono">{order.id}</span> · {order.createdAt.toLocaleDateString()}
      </p>
      {!paid && (
        <p className="mb-5 text-[13px]" style={{ color: "var(--brass)" }}>
          We're still confirming this payment with Paystack — refresh in a few seconds if it doesn't update.
        </p>
      )}
      <div className="mb-5 rounded-xl border p-5 text-left" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-1 text-[13px]">
            <span>{item.title} × {item.qty}</span>
            <span className="font-mono">{money(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="perf my-3" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total paid</span><span className="font-mono">{money(order.total)}</span>
        </div>
      </div>
      <div className="flex justify-center gap-2.5">
        <Link href="/orders" className="rounded-lg border px-4.5 py-2.5 text-[13px]" style={{ borderColor: "var(--line)" }}>View orders</Link>
        <Link href="/browse" className="rounded-lg px-4.5 py-2.5 text-[13px]" style={{ background: "var(--forest)", color: "var(--paper)" }}>Keep browsing</Link>
      </div>
    </div>
  );
}
