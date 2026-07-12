import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";

const STATUS_COLOR: Record<string, string> = {
  DELIVERED: "var(--success)",
  SHIPPED: "var(--brass)",
  AWAITING_SHIPMENT: "var(--brass)",
  PAID: "var(--brass)",
  PENDING: "var(--ink-soft)",
  CANCELLED: "var(--danger)",
};

const STATUS_LABEL: Record<string, string> = {
  DELIVERED: "Delivered",
  SHIPPED: "Shipped",
  AWAITING_SHIPMENT: "Awaiting shipment",
  PAID: "Paid",
  PENDING: "Payment pending",
  CANCELLED: "Cancelled",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/orders");

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[700px]">
      <h2 className="font-display mb-5 text-2xl">Order history</h2>
      {orders.length === 0 && (
        <p className="mb-5" style={{ color: "var(--ink-soft)" }}>You haven't placed any orders yet.</p>
      )}
      {orders.map((o) => (
        <div key={o.id} className="mb-3 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          <div>
            <div className="font-mono mb-1 text-sm font-medium">{o.id}</div>
            <div className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
              {o.items.map((i) => i.title).join(", ")}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>{o.createdAt.toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <span className="font-mono rounded-full border px-2.5 py-0.5 text-[11px]" style={{ color: STATUS_COLOR[o.status], borderColor: STATUS_COLOR[o.status] }}>
              {STATUS_LABEL[o.status]}
            </span>
            <div className="font-mono mt-2 font-medium">{money(o.total)}</div>
          </div>
        </div>
      ))}
      <Link href="/browse" className="mt-1.5 inline-block rounded-lg border px-4 py-2.5 text-[13px]" style={{ borderColor: "var(--line)" }}>
        Browse more listings
      </Link>
    </div>
  );
}
