import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck, Store, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { shop: true, reviews: true },
  });
  if (!product) notFound();

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 4.7;

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex h-[340px] items-center justify-center overflow-hidden rounded-2xl text-8xl" style={{ background: product.color || "#8B5E34" }}>
          {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> : product.emoji}
        </div>
        <div>
          <div className="mb-1.5 text-xs font-medium" style={{ color: "var(--brass)" }}>{product.category}</div>
          <h1 className="font-display mb-2 text-[30px]">{product.title}</h1>
          <div className="mb-4 flex items-center gap-1.5 text-[13px]" style={{ color: "var(--ink-soft)" }}>
            <Star size={14} fill="var(--brass)" color="var(--brass)" /> {avgRating.toFixed(1)} · {product.reviews.length} reviews · {product.stock} in stock
          </div>
          <div className="font-mono mb-4 text-[26px] font-medium">{money(product.price)}</div>
          <p className="mb-5 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{product.description}</p>

          <div className="mb-4">
            <AddToCartButton product={product} full />
          </div>

          <div className="mb-5 flex gap-4 text-xs" style={{ color: "var(--ink-soft)" }}>
            <span className="flex items-center gap-1"><Truck size={14} /> Ships in 2-3 days</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} /> Buyer protection</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border p-3.5" style={{ borderColor: "var(--line)" }}>
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full" style={{ background: "var(--brass-bg)" }}>
              <Store size={18} color="var(--brass)" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium">{product.shop.name} <BadgeCheck size={14} color="var(--forest)" /></div>
              <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{product.shop.city ?? "Nigeria"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
