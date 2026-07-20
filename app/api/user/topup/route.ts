import { NextResponse } from "next/server";
import { chips, invalid } from "../../../../lib/api";
import { db, getUser } from "../../../../lib/db";
export async function POST(request: Request) { const { userId, amount } = await request.json(); const value = chips(amount); const user = getUser(Number(userId)); if (!user || !value) return invalid("A valid account and chip amount are required."); db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(value, user.id); db.prepare("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES (?, 'topup', 0, 'demo top-up', ?)").run(user.id, value); return NextResponse.json({ user: getUser(user.id) }); }
