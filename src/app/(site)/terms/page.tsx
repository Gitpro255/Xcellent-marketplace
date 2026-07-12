export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[700px]">
      <div className="mb-5">
        <div className="font-mono mb-1 text-[11px] tracking-widest" style={{ color: "var(--brass)" }}>LEGAL</div>
        <h2 className="font-display text-2xl">Terms of Service</h2>
      </div>
      <div className="rounded-xl border p-6 text-sm leading-relaxed" style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--ink-soft)" }}>
        <p><strong style={{ color: "var(--ink)" }}>1. Using Xcellent.</strong> By creating an account you agree to buy and sell in good faith. Sellers are independent third parties responsible for their own listings, stock and shipping.</p>
        <p><strong style={{ color: "var(--ink)" }}>2. Fees.</strong> Xcellent charges a marketplace fee on completed sales, disclosed to sellers before listing.</p>
        <p><strong style={{ color: "var(--ink)" }}>3. Orders & disputes.</strong> Buyers may open a dispute if an order doesn't arrive or doesn't match its listing. Xcellent may hold payouts during an open dispute.</p>
        <p><strong style={{ color: "var(--ink)" }}>4. Account termination.</strong> Accounts that violate these terms, including fraud or counterfeit goods, may be suspended without notice.</p>
        <p className="text-xs">This is placeholder legal text for a prototype and is not a binding agreement. Have an actual lawyer draft your real terms before launch.</p>
      </div>
    </div>
  );
}
