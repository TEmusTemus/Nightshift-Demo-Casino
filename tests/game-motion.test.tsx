import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

test("slot starts its reel motion before prompting an unsigned visitor to sign in", () => {
  render(<GameClient game="slot" />);

  fireEvent.click(screen.getByRole("button", { name: "Spin" }));

  expect(document.querySelector(".slot-machine--spinning")).toBeInTheDocument();
});

test("baccarat has individual cards that can receive a deal animation", () => {
  render(<GameClient game="baccarat" />);

  expect(document.querySelectorAll(".playing-card--dealing")).toHaveLength(0);
  expect(screen.getByLabelText("Baccarat table")).toBeInTheDocument();
});

test("baccarat starts a card-dealing preview before prompting an unsigned visitor to sign in", () => {
  render(<GameClient game="baccarat" />);

  fireEvent.click(screen.getByRole("button", { name: "Deal" }));

  expect(document.querySelectorAll(".playing-card--dealing").length).toBeGreaterThan(0);
});
