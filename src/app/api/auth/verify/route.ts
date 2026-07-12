import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { generateVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, code } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "No account found for that email" }, { status: 404 });

  const token = await prisma.verificationToken.findFirst({
    where: { userId: user.id, code },
    orderBy: { createdAt: "desc" },
  });

  if (!token || token.expiresAt < new Date()) {
    return NextResponse.json({ error: "That code is invalid or has expired" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
  await createSession(user.id);

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}

// Resend a fresh code, e.g. if the first one expired.
export async function PUT(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "No account found for that email" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: "Already verified" }, { status: 400 });

  const code = generateVerificationCode();
  await prisma.verificationToken.create({
    data: { userId: user.id, code, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
  });
  await sendVerificationEmail(email, user.name, code);

  return NextResponse.json({ ok: true });
}
