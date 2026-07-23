import { Pool, type PoolClient } from "pg";
import { calculateBaccaratPayout, calculateSlotPayout, type BaccaratBet } from "./games";
import { db, getUser, settleBaccarat, settleSlot, type User } from "./db";

type LoginRow = { id: number; password_hash: string };
type HistoryRow = { game_type: string; bet_amount: number; result: string; payout: number; created_at: string };
const databaseUrl = process.env.DATABASE_URL;
const usesPostgres = Boolean(databaseUrl?.startsWith("postgres://") || databaseUrl?.startsWith("postgresql://"));
const globalPool = globalThis as unknown as { nightshiftPool?: Pool; nightshiftSchema?: Promise<void> };
const pool = usesPostgres ? globalPool.nightshiftPool ?? new Pool({ connectionString: databaseUrl }) : null;
if (pool) globalPool.nightshiftPool = pool;

function productionDatabaseRequired() {
  if (process.env.NODE_ENV === "production" && !usesPostgres) throw new Error("Production requires a PostgreSQL DATABASE_URL.");
}

async function ensureSchema() {
  if (!pool) return;
  globalPool.nightshiftSchema ??= pool.query(`
    CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, balance INTEGER NOT NULL DEFAULT 1000, role TEXT NOT NULL DEFAULT 'player', created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS transactions (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, game_type TEXT NOT NULL, bet_amount INTEGER NOT NULL, result TEXT NOT NULL, payout INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS slot_spins (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, symbols TEXT NOT NULL, win_amount INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS baccarat_rounds (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, player_cards TEXT NOT NULL, banker_cards TEXT NOT NULL, bet_type TEXT NOT NULL, bet_amount INTEGER NOT NULL, outcome TEXT NOT NULL, payout INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);
  `).then(() => undefined);
  await globalPool.nightshiftSchema;
}

function user(row: Record<string, unknown>): User { return { id: Number(row.id), username: String(row.username), balance: Number(row.balance), role: String(row.role) }; }
async function runtimeClient() { productionDatabaseRequired(); await ensureSchema(); return pool; }

export async function getRuntimeUser(id: number): Promise<User | undefined> {
  const client = await runtimeClient();
  if (!client) return getUser(id);
  const result = await client.query("SELECT id, username, balance, role FROM users WHERE id = $1", [id]);
  return result.rows[0] ? user(result.rows[0]) : undefined;
}

export async function findRuntimeLogin(username: string): Promise<LoginRow | undefined> {
  const client = await runtimeClient();
  if (!client) return db.prepare("SELECT id, password_hash FROM users WHERE username = ?").get(username) as LoginRow | undefined;
  const result = await client.query("SELECT id, password_hash FROM users WHERE username = $1", [username]);
  return result.rows[0] as LoginRow | undefined;
}

export async function createRuntimeUser(username: string, passwordHash: string) {
  const client = await runtimeClient();
  if (!client) return getUser(Number(db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, passwordHash).lastInsertRowid))!;
  const result = await client.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, balance, role", [username, passwordHash]);
  return user(result.rows[0]);
}

export async function topUpRuntimeUser(userId: number, amount: number) {
  const client = await runtimeClient();
  if (!client) { db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(amount, userId); db.prepare("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES (?, 'topup', 0, 'demo top-up', ?)").run(userId, amount); return getUser(userId)!; }
  return withTransaction(client, async (tx) => { await tx.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, userId]); await tx.query("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES ($1, 'topup', 0, 'demo top-up', $2)", [userId, amount]); return getPostgresUser(tx, userId); });
}

export async function runtimeHistory(userId: number): Promise<HistoryRow[]> {
  const client = await runtimeClient();
  if (!client) return db.prepare("SELECT game_type, bet_amount, result, payout, created_at FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50").all(userId) as HistoryRow[];
  return (await client.query("SELECT game_type, bet_amount, result, payout, created_at FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT 50", [userId])).rows as HistoryRow[];
}

export async function runtimeUsers() {
  const client = await runtimeClient();
  if (!client) return db.prepare("SELECT id, username, balance, role, created_at FROM users ORDER BY id DESC").all();
  return (await client.query("SELECT id, username, balance, role, created_at FROM users ORDER BY id DESC")).rows;
}

export async function settleRuntimeSlot(userId: number, bet: number, symbols: string[]) {
  const client = await runtimeClient();
  if (!client) return settleSlot(userId, bet, symbols);
  const payout = calculateSlotPayout(symbols, bet);
  return withTransaction(client, async (tx) => {
    const update = await tx.query("UPDATE users SET balance = balance - $1 + $2 WHERE id = $3 AND balance >= $1 RETURNING id", [bet, payout, userId]);
    if (update.rowCount !== 1) return null;
    await tx.query("INSERT INTO slot_spins (user_id, symbols, win_amount) VALUES ($1, $2, $3)", [userId, JSON.stringify(symbols), payout]);
    await tx.query("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES ($1, 'slot', $2, $3, $4)", [userId, bet, payout ? "win" : "loss", payout]);
    return getPostgresUser(tx, userId);
  });
}

export async function settleRuntimeBaccarat(userId: number, betType: BaccaratBet, bet: number, player: string[], banker: string[], outcome: BaccaratBet) {
  const client = await runtimeClient();
  if (!client) return settleBaccarat(userId, betType, bet, player, banker, outcome);
  const payout = calculateBaccaratPayout(betType, outcome, bet);
  return withTransaction(client, async (tx) => {
    const update = await tx.query("UPDATE users SET balance = balance - $1 + $2 WHERE id = $3 AND balance >= $1 RETURNING id", [bet, payout, userId]);
    if (update.rowCount !== 1) return null;
    await tx.query("INSERT INTO baccarat_rounds (user_id, player_cards, banker_cards, bet_type, bet_amount, outcome, payout) VALUES ($1, $2, $3, $4, $5, $6, $7)", [userId, JSON.stringify(player), JSON.stringify(banker), betType, bet, outcome, payout]);
    await tx.query("INSERT INTO transactions (user_id, game_type, bet_amount, result, payout) VALUES ($1, 'baccarat', $2, $3, $4)", [userId, bet, outcome, payout]);
    return getPostgresUser(tx, userId);
  });
}

async function getPostgresUser(client: PoolClient, id: number) { const result = await client.query("SELECT id, username, balance, role FROM users WHERE id = $1", [id]); return user(result.rows[0]); }
async function withTransaction<T>(client: Pool, work: (transaction: PoolClient) => Promise<T>) { const tx = await client.connect(); try { await tx.query("BEGIN"); const result = await work(tx); await tx.query("COMMIT"); return result; } catch (error) { await tx.query("ROLLBACK"); throw error; } finally { tx.release(); } }
