import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";
import { sendOrderConfirmationEmail } from "@/lib/email";

// Paystack calls this endpoint server-to-server after a card charge.
// Configure it at: Paystack dashboard -> Settings -> API Keys & Webhooks
//   URL: https://yourdomain.com/api/webhooks/paystack
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;

    // Re-verify directly with Paystack rather than trusting the webhook body alone.
    const verified = await verifyTransaction(reference);
    if (verified.status !== "success") {
      return NextResponse.json({ ok: true }); // ignore, not actually successful
    }

    const order = await prisma.order.findUnique({
      where: { id: reference },
      include: { items: true },
    });
    if (!order || order.status !== "PENDING") {
      return NextResponse.json({ ok: true }); // already processed or unknown order
    }

    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: "AWAITING_SHIPMENT" } }),
      ...order.items.map((item) =>
        prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.qty } } })
      ),
    ]);

    const buyer = await prisma.user.findUnique({ where: { id: order.buyerId } });
    if (buyer) {
      sendOrderConfirmationEmail(buyer.email, order.id, `\u20A6${(order.total / 100).toLocaleString("en-NG")}`).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
