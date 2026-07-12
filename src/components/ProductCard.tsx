import Link from "next/link";
import { Star } from "lucide-react";
import { money } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

type CardProduct = {
  id: string;
  title: string;
  price: number;
  emoji: string | null;
  color: string | null;
  image?: string | null;
  shop: { name: string; city: string | null };
};

export function ProductCard({ product }: { product: CardProduct }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <Link href={`/product/${product.id}`} className="flex h-[140px] items-center justify-center overflow-hidden text-4xl" style={{ background: product.color || "#8B5E34" }}>
        {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> : product.emoji}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>
          {product.shop.name}{product.shop.city ? ` · ${product.shop.city}` : ""}
        </div>
        <Link href={`/product/${product.id}`} className="text-[15px] font-medium leading-tight">{product.title}</Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono rounded-l-[2px] rounded-r-lg px-2.5 py-1 text-sm font-medium" style={{ background: "var(--brass-bg)", color: "var(--brass)" }}>
            {money(product.price)}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
