import { NextResponse } from "next/server";
import { chips, invalid, isResponse, readJson, unauthorized } from "../../../../lib/api";
import { topUpRuntimeUser } from "../../../../lib/runtime-db";
import { sessionUser } from "../../../../lib/auth";
export async function POST(request: Request) { const user = await sessionUser(request); if (!user) return unauthorized(); const body = await readJson(request, (value): value is { amount: unknown } => typeof value === "object" && value !== null && "amount" in value); if (isResponse(body)) return body; const value = chips(body.amount); if (!value) return invalid("A valid chip amount is required."); return NextResponse.json({ user: await topUpRuntimeUser(user.id, value) }); }
