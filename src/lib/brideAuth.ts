import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { BRIDE_SESSION_COOKIE_NAME } from "@/lib/constants";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 dias

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não está definido no .env");
  }
  // Chave diferente da sessão do admin (mesmo segredo base, "namespace" próprio).
  return new TextEncoder().encode(`bride:${secret}`);
}

export type BrideSessionPayload = {
  userId: string;
  name: string;
};

async function signToken(payload: BrideSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifyToken(token: string): Promise<BrideSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { userId: payload.userId, name: payload.name };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createBrideSession(payload: BrideSessionPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(BRIDE_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroyBrideSession() {
  const cookieStore = await cookies();
  cookieStore.delete(BRIDE_SESSION_COOKIE_NAME);
}

export async function getBrideSession(): Promise<BrideSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(BRIDE_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireBride(): Promise<BrideSessionPayload> {
  const session = await getBrideSession();
  if (!session) {
    throw new Error("Você precisa entrar na comunidade para fazer isso.");
  }
  return session;
}
