import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { invalid, isResponse, readJson } from "../../../../lib/api";
import { setSession } from "../../../../lib/auth";
import { findRuntimeLogin, getRuntimeUser } from "../../../../lib/runtime-db";

export async function POST(request: Request) {
  const body = await readJson(request, (value): value is { username: unknown; password: unknown } => typeof value === "object" && value !== null && "username" in value && "password" in value);
  if (isResponse(body)) return body;
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const row = await findRuntimeLogin(username);
  if (!row || !(await bcrypt.compare(password, row.password_hash))) return invalid("Invalid username or password.", 401);
  const user = (await getRuntimeUser(row.id))!;
  return setSession(NextResponse.json({ user }), user);
}
