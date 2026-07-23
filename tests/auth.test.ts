import { describe, expect, test } from "vitest";
import { readJson } from "../lib/api";
import { readSession } from "../lib/auth";

describe("security primitives", () => {
  test("rejects a tampered session cookie", () => {
    const request = new Request("http://localhost", {
      headers: { cookie: "nightshift-session=eyJpZCI6MX0.invalid" },
    });

    expect(readSession(request)).toBeNull();
  });

  test("returns a 400 response for malformed JSON", async () => {
    const response = await readJson(new Request("http://localhost", { method: "POST", body: "{" }), () => true);

    expect(response).toHaveProperty("status", 400);
  });
});
