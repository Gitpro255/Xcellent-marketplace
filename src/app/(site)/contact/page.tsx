"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";

const PHONE = "0913 995 3096";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Please fill in every field.");
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  const inputCls = "w-full rounded-lg border px-3 py-2.5 text-sm outline-none";
  const inputStyle = { borderColor: "var(--line)", background: "var(--paper)", color: "var(--ink)" };

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="mb-5">
        <div className="font-mono mb-1 text-[11px] tracking-widest" style={{ color: "var(--brass)" }}>GET IN TOUCH</div>
        <h2 className="font-display text-2xl">Contact us</h2>
      </div>
      <div className="mb-5 flex flex-wrap gap-5">
        <div className="flex items-center gap-2 text-sm"><Phone size={16} color="var(--brass)" /> {PHONE}</div>
        <div className="flex items-center gap-2 text-sm"><Mail size={16} color="var(--brass)" /> excellentishaku@gmail.com</div>
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        {sent ? (
          <p style={{ color: "var(--success)" }}>Message sent — we'll reply soon.</p>
        ) : (
          <>
            <div className="mb-3">
              <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>Name</label>
              <input className={inputCls} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="mb-3">
              <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>Email</label>
              <input className={inputCls} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-soft)" }}>Message</label>
              <textarea className={inputCls} style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
            </div>
            {error && <p className="mb-3 text-[13px]" style={{ color: "var(--danger)" }}>{error}</p>}
            <button onClick={send} className="flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-medium" style={{ background: "var(--forest)", color: "var(--paper)" }}>
              <MessageCircle size={15} /> Send message
            </button>
          </>
        )}
      </div>
    </div>
  );
}
