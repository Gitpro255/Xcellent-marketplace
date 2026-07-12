import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getSessionUserId } from "./session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Returns the logged-in user, or null. Use in server components and route handlers.
export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    include: { shop: true },
  });
}

// Throws-free guard for API routes: returns the user or a 401-shaped error object.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: { status: 401, message: "Not signed in" } };
  return { user, error: null };
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
