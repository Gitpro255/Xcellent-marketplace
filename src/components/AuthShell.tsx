import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function AuthShell({ children, backHref = "/" }: { children: React.ReactNode; backHref?: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-6 py-4">
        <Link href={backHref} className="flex items-center gap-1 text-[13px]" style={{ color: "var(--ink-soft)" }}>
          <ChevronLeft size={16} /> Back
        </Link>
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-[380px] px-6 pb-12 pt-2">{children}</div>
    </div>
  );
}

export const authInputClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm outline-none";
export const authInputStyle = { borderColor: "var(--line)", background: "var(--surface)", color: "var(--ink)" };
