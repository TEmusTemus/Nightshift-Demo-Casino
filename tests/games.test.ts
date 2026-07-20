import { describe, expect, test } from "vitest";
import { baccaratScore, calculateBaccaratPayout, calculateSlotPayout } from "../lib/games";

describe("casino game rules", () => {
  test("scores baccarat hands with face cards as zero and drops tens", () => {
    expect(baccaratScore(["A", "9"])).toBe(0);
    expect(baccaratScore(["K", "7", "6"])).toBe(3);
  });

  test("applies baccarat payout ratios", () => {
    expect(calculateBaccaratPayout("banker", "banker", 100)).toBe(195);
    expect(calculateBaccaratPayout("tie", "tie", 100)).toBe(900);
    expect(calculateBaccaratPayout("player", "banker", 100)).toBe(0);
  });

  test("pays matching slot symbols and loses non-matches", () => {
    expect(calculateSlotPayout(["7", "7", "7"], 25)).toBe(250);
    expect(calculateSlotPayout(["7", "bar", "7"], 25)).toBe(0);
  });
});
