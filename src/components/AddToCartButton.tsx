"use client";

import { Plus } from "lucide-react";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  product,
  qty = 1,
  full = false,
}: {
  product: { id: string; title: string; price: number; emoji?: string | null; color?: string | null; image?: string | null; shop?: { name: string } | null };
  qty?: number;
  full?: boolean;
}) {
  const { add } = useCart();
  return (
    <button
      onClick={() =>
        add(
          { productId: product.id, title: product.title, price: product.price, emoji: product.emoji, color: product.color, image: product.image, shopName: product.shop?.name },
          qty
        )
      }
      className={full ? "flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-medium" : "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs"}
      style={{ background: "var(--forest)", color: "var(--paper)" }}
    >
      <Plus size={full ? 15 : 13} /> {full ? "Add to cart" : "Add"}
    </button>
  );
}
