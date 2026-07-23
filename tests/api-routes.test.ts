import { expect, test } from "vitest";
import { NextResponse } from "next/server";
import { setSession } from "../lib/auth";
import { db, getUser } from "../lib/db";
import { POST as topup } from "../app/api/user/topup/route";
import { GET as users } from "../app/api/admin/users/route";

function sessionRequest(user: { id: number; username: string; balance: number; role: string }, body?: unknown) {
  const response = setSession(NextResponse.json({}), user);
  const cookie = response.headers.get("set-cookie")?.split(";")[0] || "";
  return new Request("http://localhost/api", { method: body ? "POST" : "GET", headers: { cookie, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
}

test("uses the signed session instead of a supplied account ID for top-ups", async () => {
  const suffix = Date.now();
  const firstId = Number(db.prepare("INSERT INTO users (username, password_hash) VALUES (?, 'hash')").run(`first-${suffix}`).lastInsertRowid);
  const secondId = Number(db.prepare("INSERT INTO users (username, password_hash) VALUES (?, 'hash')").run(`second-${suffix}`).lastInsertRowid);
  const response = await topup(sessionRequest(getUser(firstId)!, { userId: secondId, amount: 10 }));

  expect(response.status).toBe(200);
  expect(getUser(firstId)?.balance).toBe(1010);
  expect(getUser(secondId)?.balance).toBe(1000);
});

test("blocks player access to the admin user list", async () => {
  const userId = Number(db.prepare("INSERT INTO users (username, password_hash) VALUES (?, 'hash')").run(`player-${Date.now()}`).lastInsertRowid);
  expect((await users(sessionRequest(getUser(userId)!))).status).toBe(403);
});

test("blocks unauthenticated top-ups", async () => {
  expect((await topup(new Request("http://localhost/api", { method: "POST", body: JSON.stringify({ amount: 5 }) }))).status).toBe(401);
});
