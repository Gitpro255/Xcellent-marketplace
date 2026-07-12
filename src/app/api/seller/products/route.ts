import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return NextResponse.json({ error: error.message }, { status: error.status });
  if (!user.shop) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: { shopId: user.shop.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
