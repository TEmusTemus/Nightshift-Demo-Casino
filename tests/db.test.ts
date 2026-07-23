import { expect, test } from "vitest";
import { db, getUser, settleSlot } from "../lib/db";

test("initializes the SQLite schema when the database directory is absent", () => {
  expect(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'").get()).toBeTruthy();
});

test("does not record a wager when the balance is no longer sufficient", () => {
  const username = `atomic-${Date.now()}`;
  const userId = Number(db.prepare("INSERT INTO users (username, password_hash, balance) VALUES (?, 'hash', 100)").run(username).lastInsertRowid);

  expect(settleSlot(userId, 75, ["lemon", "bar", "7"])?.balance).toBe(25);
  expect(settleSlot(userId, 75, ["lemon", "bar", "7"])).toBeNull();
  expect(getUser(userId)?.balance).toBe(25);
  expect(db.prepare("SELECT COUNT(*) AS count FROM transactions WHERE user_id = ?").get(userId)).toEqual({ count: 1 });
});
