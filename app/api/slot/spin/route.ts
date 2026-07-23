import { NextResponse } from "next/server";
import { chips, invalid, isResponse, readJson, unauthorized } from "../../../../lib/api";
import { sessionUser } from "../../../../lib/auth";
import { settleRuntimeSlot } from "../../../../lib/runtime-db";

const symbols = ["7", "7", "7", "bar", "bar", "cherry", "cherry", "lemon"];

export async function POST(request: Request) {
  const user = await sessionUser(request);
  if (!user) return unauthorized();
  const body = await readJson(request, (value): value is { betAmount: unknown } => typeof value === "object" && value !== null && "betAmount" in value);
  if (isResponse(body)) return body;
  const bet = chips(body.betAmount);
  if (!bet) return invalid("A valid chip bet is required.");
  const reels = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
  const settled = await settleRuntimeSlot(user.id, bet, reels);
  if (!settled) return invalid("Insufficient virtual-chip balance.", 409);
  const payout = settled.balance - user.balance + bet;
  return NextResponse.json({ symbols: reels, payout, user: settled });
}
