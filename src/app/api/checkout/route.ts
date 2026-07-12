import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { initializeTransaction } from "@/lib/paystack";
import { sendOrderConfirmationEmail } from "@/lib/email";

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "COD"]),
});

const FEE_RATE = 0.08;
const SHIPPING_FLAT = 250000; // ₦2,500 in kobo

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return NextResponse.json({ error: error.message }, { status: error.status });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { items, address, city, state, paymentMethod } = parsed.data;

  // Always re-price from the database — never trust amounts sent by the client.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more items are no longer available" }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.qty) {
      return NextResponse.json({ error: `Not enough stock for "${product.title}"` }, { status: 409 });
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.qty;
  }, 0);
  const fee = Math.round(subtotal * FEE_RATE);
  const shipping = SHIPPING_FLAT;
  const total = subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      buyerId: user.id,
      status: "PENDING",
      paymentMethod,
      subtotal,
      fee,
      shipping,
      total,
      address,
      city,
      state,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            title: product.title,
            price: product.price,
            qty: item.qty,
            sellerId: product.shopId,
          };
        }),
      },
    },
  });

  if (paymentMethod === "CARD") {
    try {
      const tx = await initializeTransaction({
        email: user.email,
        amountKobo: total,
        reference: order.id,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${order.id}`,
      });
      await prisma.order.update({ where: { id: order.id }, data: { paystackRef: tx.reference } });
      return NextResponse.json({ authorizationUrl: tx.authorization_url, orderId: order.id });
    } catch (err) {
      console.error("Paystack init failed", err);
      await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
    }
  }

  // Bank transfer / cash on delivery: no gateway round-trip, mark as awaiting
  // shipment right away and decrement stock. A real deployment would still
  // want a manual "confirm transfer received" step for bank transfers.
  await Promise.all([
    prisma.order.update({ where: { id: order.id }, data: { status: "AWAITING_SHIPMENT" } }),
    ...items.map((item) =>
      prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.qty } } })
    ),
  ]);

  sendOrderConfirmationEmail(user.email, order.id, `\u20A6${(total / 100).toLocaleString("en-NG")}`).catch(() => {});

  return NextResponse.json({ orderId: order.id });
}
