"use client";

import { useEffect, useState } from "react";

type Me = { id: string; name: string; email: string; role: "BUYER" | "SELLER" | "ADMIN"; shopId: string | null } | null;

export function useUser() {
  const [user, setUser] = useState<Me>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, refresh, logout };
}
