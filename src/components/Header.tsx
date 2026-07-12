"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Phone, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { useUser } from "./useUser";

const PHONE = "0913 995 3096";

export function Header() {
  const router = useRouter();
  const { count } = useCart();
  const { user, logout } = useUser();
  const [q, setQ] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/browse?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-20">
      <div style={{ background: "var(--bar)", color: "var(--paper)" }} className="text-xs">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-1.5">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 opacity-85"><Phone size={12} /> {PHONE}</span>
            <Link href="/info" className="opacity-85">Info</Link>
            <Link href="/contact" className="opacity-85">Contact</Link>
          </div>
          <ThemeToggle compact />
        </div>
      </div>
      <div style={{ background: "var(--forest)", color: "var(--paper)" }}>
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-5 py-3">
          <Link href="/browse" className="shrink-0"><Logo size={34} /></Link>
          <form onSubmit={submitSearch} className="flex max-w-[420px] flex-1 items-center rounded-lg bg-white/10 px-3 py-2">
            <Search size={16} className="shrink-0 opacity-70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, sellers..."
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-white/60"
            />
          </form>
          <nav className="ml-auto flex items-center gap-1">
            <Link href="/browse" className="rounded px-3 py-2 text-sm font-medium">Browse</Link>
            <Link href={user?.role === "SELLER" ? "/seller" : "/signup"} className="rounded px-3 py-2 text-sm font-medium">Sell</Link>
            <Link href="/orders" className="rounded px-3 py-2 text-sm font-medium">Orders</Link>
            <Link href="/cart" className="relative flex items-center px-2.5 py-2">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="font-mono absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px]" style={{ background: "var(--brass)" }}>
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <div className="ml-1.5 flex items-center gap-2">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "var(--brass)", width: 26, height: 26 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} title="Log out" className="opacity-85"><LogOut size={16} /></button>
              </div>
            ) : (
              <Link href="/login" className="ml-1.5 rounded-md px-3.5 py-2 text-sm font-medium" style={{ background: "var(--brass)" }}>
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
