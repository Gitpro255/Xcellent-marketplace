"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => { clear(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
