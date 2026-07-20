type Transaction = { bet_amount: number; payout: number };
export function summarizeTransactions(rows: Transaction[]) {
  const wagered = rows.reduce((sum, row) => sum + row.bet_amount, 0);
  const won = rows.reduce((sum, row) => sum + row.payout, 0);
  const wins = rows.filter((row) => row.payout > row.bet_amount).length;
  return { wagered, won, net: won - wagered, winRate: rows.length ? Math.round((wins / rows.length) * 100) : 0 };
}
