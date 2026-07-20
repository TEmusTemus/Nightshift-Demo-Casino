import bcrypt from "bcryptjs";
import { db, getUser } from "../../../../lib/db";
import { invalid } from "../../../../lib/api";
import { NextResponse } from "next/server";
export async function POST(request: Request) { const { username, password } = await request.json(); const row = db.prepare("SELECT id, password_hash FROM users WHERE username = ?").get(String(username)) as { id: number; password_hash: string } | undefined; if (!row || !(await bcrypt.compare(String(password), row.password_hash))) return invalid("Invalid username or password.", 401); return NextResponse.json({ user: getUser(row.id) }); }
