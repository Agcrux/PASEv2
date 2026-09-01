import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Session helpers (Part A owns). Part B consumes `getCurrentUser()` to know
 * who is logged in.
 *
 * Session is a signed JWT stored in an httpOnly cookie.
 *
 * TODO(Part A): flesh out sign-in/sign-out route handlers that call these.
 */

const COOKIE_NAME = "crt_session";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-insecure-secret-change-me",
);

const maxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS ?? "7");
const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;

export type SessionPayload = {
  userId: number;
  studentId: string;
  role: "student" | "admin";
};

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeDays}d`)
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function destroySession(): void {
  cookies().delete(COOKIE_NAME);
}
