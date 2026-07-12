"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("xc-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className={compact
        ? "flex items-center gap-1.5 text-xs opacity-85"
        : "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"}
      style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
    >
      {dark ? <Sun size={13} /> : <Moon size={13} />} {dark ? "Light" : "Dark"}
    </button>
  );
}
