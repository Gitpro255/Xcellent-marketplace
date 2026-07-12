import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category && category !== "All" ? { category } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { shop: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().int().positive(), // in kobo
  category: z.string().min(2),
  stock: z.number().int().nonnegative(),
  emoji: z.string().optional(),
  color: z.string().optional(),
});

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return NextResponse.json({ error: error.message }, { status: error.status });
  if (user.role !== "SELLER" || !user.shop) {
    return NextResponse.json({ error: "Only sellers with a shop can create listings" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const product = await prisma.product.create({
    data: { ...parsed.data, shopId: user.shop.id },
  });

  return NextResponse.json({ product }, { status: 201 });
}
