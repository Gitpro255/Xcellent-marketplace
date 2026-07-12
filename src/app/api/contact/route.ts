import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

// Wired up for you to forward to email/Slack/a support inbox — for now it
// just validates and acknowledges. Swap in Resend or a CRM webhook here.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Please fill in every field" }, { status: 400 });

  console.log("Contact form submission:", parsed.data);
  return NextResponse.json({ ok: true });
}
