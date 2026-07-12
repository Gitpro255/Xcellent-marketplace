"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CategoryTabs({ categories, active }: { categories: string[]; active: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const select = (c: string) => {
    const next = new URLSearchParams(params.toString());
    if (c === "All") next.delete("category");
    else next.set("category", c);
    router.push(`/browse?${next.toString()}`);
  };

  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => select(c)}
          className="whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium"
          style={{
            borderColor: active === c ? "var(--forest)" : "var(--line)",
            background: active === c ? "var(--forest)" : "var(--surface)",
            color: active === c ? "var(--paper)" : "var(--ink)",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
