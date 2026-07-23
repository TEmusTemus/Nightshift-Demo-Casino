import { NextResponse } from "next/server";
import { unauthorized } from "../../../../lib/api";
import { getRuntimeUser, runtimeHistory } from "../../../../lib/runtime-db";
import { summarizeTransactions } from "../../../../lib/stats";
import { sessionUser } from "../../../../lib/auth";
export async function GET(request: Request) { const user = await sessionUser(request); if (!user) return unauthorized(); const rows = await runtimeHistory(user.id); return NextResponse.json({ user: await getRuntimeUser(user.id), transactions: rows, stats: summarizeTransactions(rows) }); }
