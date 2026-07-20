export type BaccaratBet = "player" | "banker" | "tie";
export type BaccaratOutcome = BaccaratBet;

export function baccaratScore(cards: string[]) {
  return cards.reduce((total, card) => {
    const value = card === "A" ? 1 : ["K", "Q", "J", "10"].includes(card) ? 0 : Number(card);
    return total + value;
  }, 0) % 10;
}

export function calculateBaccaratPayout(bet: BaccaratBet, outcome: BaccaratOutcome, amount: number) {
  if (bet !== outcome) return 0;
  if (outcome === "tie") return amount * 9;
  if (outcome === "banker") return amount * 1.95;
  return amount * 2;
}

export function calculateSlotPayout(symbols: string[], amount: number) {
  if (symbols.length !== 3 || new Set(symbols).size !== 1) return 0;
  const multiplier: Record<string, number> = { "7": 10, bar: 5, cherry: 3 };
  return amount * (multiplier[symbols[0]] ?? 2);
}
