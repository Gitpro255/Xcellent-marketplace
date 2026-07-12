import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SellerDashboardClient } from "./SellerDashboardClient";

export default async function SellerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/seller");
  if (user.role !== "SELLER" || !user.shop) {
    redirect("/browse");
  }

  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({ where: { shopId: user.shop.id }, orderBy: { createdAt: "desc" } }),
    prisma.orderItem.findMany({
      where: { sellerId: user.shop.id },
      include: { order: { include: { buyer: true } } },
      orderBy: { id: "desc" },
    }),
  ]);

  const revenue = orderItems
    .filter((i) => i.order.status !== "PENDING" && i.order.status !== "CANCELLED")
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <SellerDashboardClient
      shopName={user.shop.name}
      revenue={revenue}
      products={products.map((p) => ({ id: p.id, title: p.title, price: p.price, stock: p.stock, category: p.category }))}
      orders={orderItems.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        title: i.title,
        price: i.price,
        qty: i.qty,
        status: i.order.status,
        buyer: i.order.buyer.name,
      }))}
    />
  );
}
