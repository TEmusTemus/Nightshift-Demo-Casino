import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { calculateBaccaratPayout, calculateSlotPayout, type BaccaratBet } from "./games";

const filename = process.env.NIGHTSHIFT_DB_PATH || path.join(process.cwd(), "db", "casino.db");
const directory = path.dirname(filename);
mkdirSync(directory, { recursive: true });
const globalDb = globalThis as unknown as { casinoDb?: Database.Database };
export const db = globalDb.casinoDb ?? new Database(filename);

db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, balance INTEGER NOT NULL DEFAULT 1000, role TEXT NOT NULL DEFAULT 'player', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, game_type TEXT NOT NULL, bet_amount INTEGER NOT NULL, result TEXT NOT NULL, payout INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS slot_spins (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, symbols TEXT NOT NULL, win_amount INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS baccarat_rounds (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, player_cards TEXT NOT NULL, banker_cards TEXT NOT NULL, bet_type TEXT NOT NULL, bet_amount INTEGER NOT NULL, outcome TEXT NOT NULL, payout INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);
`);
globalDb.casinoDb = db;

export type User = { id: number; username: string; balance: number; role: string };
export function getUser(id: number) { return db.prepare("SELECT id, username, balance, role FROM users WHERE id = ?").get(id) as User | undefined; }

export function settleSlot(userId: number, bet: number, symbols: string[]): User | null {
  const payout = calculateSlotPayout(symbols, bet);
  return db.transaction(() => {
    const update = db.prepare("UPDATE users SET balance = balance - ? + ? WHERE id = ? AND balance >= ?").run(bet, payout, userId, bet);
    if (update.changes !== 1) return null;
    db.prepare("INSERT INTO slot_spins (user_id, symbols, win_amount) VALUES (?, ?, ?)").run(userId, JSON.stringify(symbols), payout);
    db.prepare("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES (?, 'slot', ?, ?, ?)").run(userId, bet, payout ? "win" : "loss", payout);
    return getUser(userId) ?? null;
  })();
}

export function settleBaccarat(userId: number, betType: BaccaratBet, bet: number, player: string[], banker: string[], outcome: BaccaratBet): User | null {
  const payout = calculateBaccaratPayout(betType, outcome, bet);
  return db.transaction(() => {
    const update = db.prepare("UPDATE users SET balance = balance - ? + ? WHERE id = ? AND balance >= ?").run(bet, payout, userId, bet);
    if (update.changes !== 1) return null;
    db.prepare("INSERT INTO baccarat_rounds (user_id, player_cards, banker_cards, bet_type, bet_amount, outcome, payout) VALUES (?, ?, ?, ?, ?, ?, ?)").run(userId, JSON.stringify(player), JSON.stringify(banker), betType, bet, outcome, payout);
    db.prepare("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES (?, 'baccarat', ?, ?, ?)").run(userId, bet, outcome, payout);
    return getUser(userId) ?? null;
  })();
}
