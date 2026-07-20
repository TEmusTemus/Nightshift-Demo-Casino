import { expect, test } from "vitest";
import { db } from "../lib/db";

test("initializes the SQLite schema when the database directory is absent", () => {
  expect(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'").get()).toBeTruthy();
});
