import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SESSION_COOKIE, SESSION_DAYS } from "./session-constants";

const key = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return { adminId: payload.sub as string };
  } catch {
    return null;
  }
}

/** Úsalo al inicio de cada Server Action y página del admin. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) notFound();
  return session;
}
