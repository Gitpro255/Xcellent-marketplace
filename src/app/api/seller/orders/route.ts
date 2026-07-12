import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// Returns order line items that belong to the current seller, grouped loosely
// by order, so the seller dashboard can show "who bought what" without
// exposing other sellers' items in the same order.
export async function GET() {
  const { user, error } = await requireUser();
  if (error) return NextResponse.json({ error: error.message }, { status: error.status });
  if (!user.shop) return NextResponse.json({ items: [] });

  const items = await prisma.orderItem.findMany({
    where: { sellerId: user.shop.id },
    include: { order: { include: { buyer: true } } },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({
    items: items.map((i) => ({
      id: i.id,
      orderId: i.orderId,
      title: i.title,
      price: i.price,
      qty: i.qty,
      status: i.order.status,
      buyer: i.order.buyer.name,
      createdAt: i.order.createdAt,
    })),
  });
}
