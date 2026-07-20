import bcrypt from "bcryptjs";
import { db, getUser } from "../../../../lib/db";
import { invalid } from "../../../../lib/api";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || !/^[a-zA-Z0-9_]{3,24}$/.test(username) || typeof password !== "string" || password.length < 6) return invalid("Use a 3–24 character username and a password of at least 6 characters.");
  try { const result = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username.trim(), await bcrypt.hash(password, 10)); return NextResponse.json({ user: getUser(Number(result.lastInsertRowid)) }, { status: 201 }); }
  catch { return invalid("That username is already in use.", 409); }
}
