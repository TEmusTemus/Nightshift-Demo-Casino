import { NextResponse } from "next/server";
import { invalid } from "../../../../lib/api";
import { db, getUser } from "../../../../lib/db";
import { summarizeTransactions } from "../../../../lib/stats";
export function GET(request: Request) { const userId = Number(new URL(request.url).searchParams.get("userId")); if (!getUser(userId)) return invalid("Account not found.", 404); const rows = db.prepare("SELECT game_type, bet_amount, result, payout, created_at FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50").all(userId) as Array<{ game_type: string; bet_amount: number; result: string; payout: number; created_at: string }>; return NextResponse.json({ user: getUser(userId), transactions: rows, stats: summarizeTransactions(rows) }); }
