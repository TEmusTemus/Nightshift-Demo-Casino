import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { invalid, isResponse, readJson } from "../../../../lib/api";
import { setSession } from "../../../../lib/auth";
import { createRuntimeUser } from "../../../../lib/runtime-db";

export async function POST(request: Request) {
  const body = await readJson(request, (value): value is { username: unknown; password: unknown } => typeof value === "object" && value !== null && "username" in value && "password" in value);
  if (isResponse(body)) return body;
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username) || password.length < 6) return invalid("Use a 3–24 character username and a password of at least 6 characters.");
  try {
    const user = await createRuntimeUser(username, await bcrypt.hash(password, 10));
    return setSession(NextResponse.json({ user }, { status: 201 }), user);
  } catch { return invalid("That username is already in use.", 409); }
}
