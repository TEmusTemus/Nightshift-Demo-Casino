import { expect, test } from "vitest";
import { summarizeTransactions } from "../lib/stats";

test("summarizes virtual-chip transaction totals", () => {
  expect(summarizeTransactions([{ bet_amount: 100, payout: 0 }, { bet_amount: 50, payout: 100 }])).toEqual({ wagered: 150, won: 100, net: -50, winRate: 50 });
});
