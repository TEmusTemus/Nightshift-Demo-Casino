import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import Signup from "@/app/signup/page";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

test("signup placeholder returns visitors to the landing page", () => {
  render(<Signup />);

  expect(
    screen.getByRole("heading", { name: /create your demo account/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to NIGHTSHIFT/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("primary return links use a WCAG AA contrast-safe foreground", () => {
  const css = readFileSync("app/globals.css", "utf8");

  expect(css).toMatch(/\.button--primary\s*\{[^}]*color:\s*var\(--color-bg\)/s);
});
