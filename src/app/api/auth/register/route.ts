import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(6),
  role: z.enum(["buyer", "seller"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { name, email, phone, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashed,
      role: role === "seller" ? "SELLER" : "BUYER",
      ...(role === "seller" ? { shop: { create: { name: `${name}'s Shop` } } } : {}),
    },
  });

  const code = generateVerificationCode();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  try {
    await sendVerificationEmail(email, name, code);
  } catch (err) {
    console.error("Failed to send verification email", err);
    // Don't fail registration just because email delivery failed — the
    // resend-code endpoint lets the user request another one.
  }

  return NextResponse.json({ ok: true, email });
}
