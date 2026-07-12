import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });

  const ok = await verifyPassword(password, user.password);
  if (!ok) return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });

  if (!user.emailVerified) {
    return NextResponse.json({ error: "Please verify your email first", needsVerification: true, email }, { status: 403 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
