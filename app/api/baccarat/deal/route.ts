import { NextResponse } from "next/server";
import { chips, invalid, isResponse, readJson, unauthorized } from "../../../../lib/api";
import { sessionUser } from "../../../../lib/auth";
import { settleRuntimeBaccarat } from "../../../../lib/runtime-db";
import { baccaratScore, bankerDrawsThirdCard, calculateBaccaratPayout, playerDrawsThirdCard, type BaccaratBet } from "../../../../lib/games";

const deck = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const card = () => deck[Math.floor(Math.random() * deck.length)];

export async function POST(request: Request) {
  const user = await sessionUser(request);
  if (!user) return unauthorized();
  const body = await readJson(request, (value): value is { betType: unknown; betAmount: unknown } => typeof value === "object" && value !== null && "betType" in value && "betAmount" in value);
  if (isResponse(body)) return body;
  const bet = chips(body.betAmount);
  if (!bet || !["player", "banker", "tie"].includes(String(body.betType))) return invalid("Invalid baccarat bet.");
  const betType = body.betType as BaccaratBet;
  const player = [card(), card()];
  const banker = [card(), card()];
  const initialPlayer = baccaratScore(player);
  const initialBanker = baccaratScore(banker);
  if (!(initialPlayer >= 8 || initialBanker >= 8)) {
    if (playerDrawsThirdCard(initialPlayer)) player.push(card());
    const third = player.length === 3 ? baccaratScore([player[2]]) : null;
    if (bankerDrawsThirdCard(initialBanker, third)) banker.push(card());
  }
  const playerScore = baccaratScore(player);
  const bankerScore = baccaratScore(banker);
  const outcome: BaccaratBet = playerScore === bankerScore ? "tie" : playerScore > bankerScore ? "player" : "banker";
  const settled = await settleRuntimeBaccarat(user.id, betType, bet, player, banker, outcome);
  if (!settled) return invalid("Insufficient virtual-chip balance.", 409);
  return NextResponse.json({ player, banker, playerScore, bankerScore, outcome, payout: calculateBaccaratPayout(betType, outcome, bet), user: settled });
}
