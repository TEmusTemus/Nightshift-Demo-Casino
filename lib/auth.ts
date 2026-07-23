import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { User } from "./db";
import { getRuntimeUser } from "./runtime-db";

const COOKIE_NAME = "nightshift-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const localSecret = "nightshift-local-development-session-secret";

type SessionPayload = { id: number; expiresAt: number };
export type SessionUser = Pick<User, "id" | "username" | "balance" | "role">;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && !value) throw new Error("SESSION_SECRET must be configured in production.");
  return value || localSecret;
}

function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function parseCookies(request: Request) {
  return Object.fromEntries((request.headers.get("cookie") || "").split(";").map((part) => part.trim().split("=", 2)).filter(([name]) => name));
}

export function readSession(request: Request): SessionPayload | null {
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return Number.isInteger(payload.id) && Number.isInteger(payload.expiresAt) && payload.expiresAt > Date.now() ? payload : null;
  } catch { return null; }
}

export async function sessionUser(request: Request): Promise<SessionUser | null> {
  const session = readSession(request);
  return session ? await getRuntimeUser(session.id) ?? null : null;
}

export function setSession(response: NextResponse, user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, expiresAt: Date.now() + SESSION_TTL_MS })).toString("base64url");
  response.cookies.set(COOKIE_NAME, `${payload}.${sign(payload)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_MS / 1000 });
  return response;
}

export function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
