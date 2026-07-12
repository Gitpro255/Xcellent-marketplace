import { Store, ShieldCheck, Truck, Banknote } from "lucide-react";

export default function InfoPage() {
  const features = [
    { icon: <Store size={18} />, t: "Open a shop", d: "List products in minutes and set your own prices." },
    { icon: <ShieldCheck size={18} />, t: "Buyer protection", d: "Orders are covered until they're confirmed delivered." },
    { icon: <Truck size={18} />, t: "Local delivery", d: "Sellers ship from cities across Nigeria." },
    { icon: <Banknote size={18} />, t: "Fair fees", d: "A flat 8% marketplace fee, no hidden charges." },
  ];
  return (
    <div className="mx-auto max-w-[700px]">
      <div className="mb-5">
        <div className="font-mono mb-1 text-[11px] tracking-widest" style={{ color: "var(--brass)" }}>ABOUT</div>
        <h2 className="font-display text-2xl">What is Xcellent?</h2>
      </div>
      <p className="mb-4 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        Xcellent is a marketplace built for independent Nigerian sellers — makers, home cooks, small workshops and boutique brands — to reach buyers directly, without warehousing their stock through a middleman.
      </p>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {features.map((f, i) => (
          <div key={i} className="rounded-lg border p-4" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            <div className="mb-2" style={{ color: "var(--brass)" }}>{f.icon}</div>
            <div className="mb-1 text-sm font-medium">{f.t}</div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
