export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[700px]">
      <div className="mb-5">
        <div className="font-mono mb-1 text-[11px] tracking-widest" style={{ color: "var(--brass)" }}>LEGAL</div>
        <h2 className="font-display text-2xl">Privacy Policy</h2>
      </div>
      <div className="rounded-xl border p-6 text-sm leading-relaxed" style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--ink-soft)" }}>
        <p><strong style={{ color: "var(--ink)" }}>What we collect.</strong> Name, email, phone number and order history, used to operate your account and process orders.</p>
        <p><strong style={{ color: "var(--ink)" }}>How it's used.</strong> To fulfil orders, verify your identity, and share only the shipping details a seller needs to fulfil your order.</p>
        <p><strong style={{ color: "var(--ink)" }}>Your choices.</strong> You can request a copy of your data or delete your account at any time by contacting us.</p>
        <p className="text-xs">This is placeholder legal text for a prototype and is not a binding agreement. Have an actual lawyer draft your real policy before launch.</p>
      </div>
    </div>
  );
}
