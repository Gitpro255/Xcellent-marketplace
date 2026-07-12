import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

const PHONE = "0913 995 3096";

export function Footer() {
  return (
    <footer style={{ background: "var(--bar)", color: "var(--paper)" }} className="mt-10">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-4 px-5 py-6 text-sm">
        <div>
          <Logo size={30} />
          <p className="mt-2 max-w-[280px] text-xs opacity-70">Nigeria's marketplace for independent makers and sellers.</p>
        </div>
        <div className="flex flex-wrap gap-10">
          <div>
            <div className="mb-2 text-[11px] tracking-wider opacity-50">COMPANY</div>
            <Link href="/info" className="block py-0.5 text-sm opacity-85">Info / About</Link>
            <Link href="/contact" className="block py-0.5 text-sm opacity-85">Contact</Link>
          </div>
          <div>
            <div className="mb-2 text-[11px] tracking-wider opacity-50">LEGAL</div>
            <Link href="/terms" className="block py-0.5 text-sm opacity-85">Terms of Service</Link>
            <Link href="/privacy" className="block py-0.5 text-sm opacity-85">Privacy Policy</Link>
          </div>
          <div>
            <div className="mb-2 text-[11px] tracking-wider opacity-50">REACH US</div>
            <div className="mb-1.5 flex items-center gap-1.5 opacity-85"><Phone size={13} /> {PHONE}</div>
            <div className="flex items-center gap-1.5 opacity-85"><Mail size={13} /> excellentishaku@gmail.com</div>ss
        </div>
      </div>
      <div className="perf opacity-30" />
      <div className="py-3 text-center text-[11px] opacity-55">© 2026 Xcellent. All rights reserved.</div>
    </footer>
  );
}
