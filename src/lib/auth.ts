import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não está definido no .env");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  email: string;
};

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  // O hash bcrypt é armazenado em base64 no .env porque o carregador de
  // env do Next.js faz expansão de variáveis e corrompe os `$` literais
  // que fazem parte do formato do hash (ex: $2b$10$...).
  const adminPasswordHashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!adminEmail || !adminPasswordHashB64) {
    throw new Error(
      "ADMIN_EMAIL / ADMIN_PASSWORD_HASH_B64 não configurados no .env"
    );
  }
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return false;
  }
  const adminPasswordHash = Buffer.from(adminPasswordHashB64, "base64").toString(
    "utf8"
  );
  return bcrypt.compare(password, adminPasswordHash);
}

export async function createSession(email: string) {
  const token = await signSessionToken({ email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Não autorizado");
  }
  return session;
}
