import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("defines the NIGHTSHIFT surface and signal tokens", () => {
  const css = readFileSync("styles/tokens.css", "utf8");
  expect(css).toContain("--color-primary");
  expect(css).toContain("--color-violet");
  expect(css).toContain("--color-bg");
});
