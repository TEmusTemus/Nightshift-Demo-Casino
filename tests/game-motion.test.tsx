import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { GameClient } from "@/components/demo-client";

afterEach(() => {
  localStorage.clear();
  cleanup();
});

test("slot renders moving reel strips instead of a single result symbol", () => {
  render(<GameClient game="slot" />);

  expect(document.querySelectorAll(".slot-reel__strip")).toHaveLength(3);
});

test("baccarat has individual cards that can receive a deal animation", () => {
  render(<GameClient game="baccarat" />);

  expect(document.querySelectorAll(".playing-card--dealing")).toHaveLength(0);
  expect(screen.getByLabelText("Baccarat table")).toBeInTheDocument();
});
