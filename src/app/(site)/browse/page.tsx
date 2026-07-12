import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTabs } from "./CategoryTabs";

const CATEGORIES = ["All", "Phones", "Apparel", "Footwear", "Home & Craft", "Electronics", "Accessories", "Food", "Wellness", "Outdoors"];

export default async function BrowsePage({ searchParams }: { searchParams: { category?: string; q?: string } }) {
  const category = searchParams.category || "All";
  const q = searchParams.q || "";

  const products = await prisma.product.findMany({
    where: {
      ...(category !== "All" ? { category } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { shop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl p-9" style={{ background: "var(--forest)", color: "var(--paper)" }}>
        <div className="max-w-[460px]">
          <div className="font-mono mb-2 text-[11px] tracking-widest" style={{ color: "var(--brass-light)" }}>THE MARKETPLACE, RUN BY MAKERS</div>
          <h1 className="font-display mb-2.5 text-[34px] leading-tight">Goods from independent sellers, not warehouses.</h1>
          <p className="text-[15px] opacity-85">Every listing here ships from the person who made or sourced it.</p>
        </div>
        <div className="font-mono flex gap-5">
          <div><div className="text-xl font-semibold">120+</div><div className="text-[10px] tracking-wider opacity-75">SELLERS</div></div>
          <div><div className="text-xl font-semibold">4.7★</div><div className="text-[10px] tracking-wider opacity-75">AVG RATING</div></div>
        </div>
      </div>

      <CategoryTabs categories={CATEGORIES} active={category} />

      {products.length === 0 ? (
        <div className="py-16 text-center" style={{ color: "var(--ink-soft)" }}>No listings match that search. Try a different term or category.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4.5" style={{ gap: 18 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
