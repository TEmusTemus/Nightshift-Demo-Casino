import { NextResponse } from "next/server";
import { runtimeUsers } from "../../../../lib/runtime-db";
import { forbidden, unauthorized } from "../../../../lib/api";
import { sessionUser } from "../../../../lib/auth";
export async function GET(request: Request) { const user = await sessionUser(request); if (!user) return unauthorized(); if (user.role !== "admin") return forbidden(); return NextResponse.json({ users: await runtimeUsers() }); }
