import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
export function GET() { return NextResponse.json({ users: db.prepare("SELECT id, username, balance, role, created_at FROM users ORDER BY id DESC").all() }); }
