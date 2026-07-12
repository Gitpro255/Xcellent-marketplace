import Link from "next/link";
import { Phone } from "lucide-react";
import { EnsoMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const PHONE = "0913 995 3096";

export default function GatePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }} className="flex flex-col">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-6 py-4">
        <div className="flex gap-4 text-xs" style={{ color: "var(--ink-soft)" }}>
          <Link href="/info">Info</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <EnsoMark size={190} />
        <div className="script" style={{ fontFamily: "Caveat, cursive", fontSize: 56, marginTop: -110, marginBottom: 30, fontWeight: 700 }}>
          Xcellent
        </div>
        <p className="mb-8 max-w-[340px] text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Nigeria's marketplace for independent makers, sellers and shoppers who'd rather buy from a person than a warehouse.
        </p>
        <div className="flex w-full max-w-[300px] flex-col gap-2.5">
          <Link href="/signup" className="rounded-lg py-3.5 text-sm font-medium" style={{ background: "var(--forest)", color: "var(--paper)" }}>
            Create an account
          </Link>
          <Link href="/login" className="rounded-lg border py-3.5 text-sm font-medium" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            Log in
          </Link>
          <Link href="/browse" className="mt-1 text-[13px] underline" style={{ color: "var(--ink-soft)" }}>
            Continue browsing as guest
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-4 text-xs" style={{ color: "var(--ink-soft)" }}>
        <Phone size={13} /> {PHONE} ·{" "}
        <Link href="/terms" className="underline">Terms</Link> ·{" "}
        <Link href="/privacy" className="underline">Privacy</Link>
      </div>
    </div>
  );
}
