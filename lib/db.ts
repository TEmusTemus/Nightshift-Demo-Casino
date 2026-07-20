import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const directory = path.join(process.cwd(), "db");
mkdirSync(directory, { recursive: true });
const filename = path.join(directory, "casino.db");
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
