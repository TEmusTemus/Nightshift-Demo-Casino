import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
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

test("slot locks its bet controls and withholds status until all reels settle", async () => {
  vi.useFakeTimers();
  const fetchMock = vi.spyOn(global, "fetch").mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 1, username: "player", balance: 1000 } }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({
    symbols: ["7", "BAR", "✦"],
    payout: 50,
    user: { id: 1, username: "player", balance: 1025 },
  }), { status: 200 }));
  render(<GameClient game="slot" />);
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });

  fireEvent.click(screen.getByRole("button", { name: "Spin" }));
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  await vi.advanceTimersByTimeAsync(0);

  expect(screen.getByLabelText("Bet amount")).toBeDisabled();
  expect(document.querySelectorAll(".slot-reel--spinning")).toHaveLength(3);
  expect(screen.getByRole("status")).toHaveTextContent("");

  await vi.advanceTimersByTimeAsync(2300);

  expect(screen.getByRole("status")).toHaveTextContent("7 · BAR · ✦ — payout 50 chips");
  expect(screen.getByLabelText("Bet amount")).not.toBeDisabled();
  fetchMock.mockRestore();
  vi.useRealTimers();
});

test("slot strips repeat symbols before their final outcome", () => {
  render(<GameClient game="slot" />);

  document.querySelectorAll(".slot-reel__strip").forEach((strip) => {
    expect(strip.querySelectorAll(".slot-reel__symbol")).toHaveLength(12);
    expect(strip).toHaveStyle({ "--reel-distance": "-99rem" });
  });
});

test("slot settles immediately when reduced motion is requested", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
  const fetchMock = vi.spyOn(global, "fetch").mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 1, username: "player", balance: 1000 } }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({
    symbols: ["7", "BAR", "✦"],
    payout: 50,
    user: { id: 1, username: "player", balance: 1025 },
  }), { status: 200 }));
  render(<GameClient game="slot" />);
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });

  fireEvent.click(screen.getByRole("button", { name: "Spin" }));
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  await vi.advanceTimersByTimeAsync(0);

  expect(screen.getByRole("status")).toHaveTextContent("7 · BAR · ✦ — payout 50 chips");
  expect(screen.getByLabelText("Bet amount")).not.toBeDisabled();
  fetchMock.mockRestore();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("slot spins together before reels land in sequence", async () => {
  vi.useFakeTimers();
  const fetchMock = vi.spyOn(global, "fetch").mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 1, username: "player", balance: 1000 } }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({
    symbols: ["7", "BAR", "✦"], payout: 50, user: { id: 1, username: "player", balance: 1025 },
  }), { status: 200 }));
  render(<GameClient game="slot" />);
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });

  fireEvent.click(screen.getByRole("button", { name: "Spin" }));
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  await vi.advanceTimersByTimeAsync(0);
  expect(document.querySelectorAll(".slot-reel--spinning")).toHaveLength(3);
  await act(async () => { await vi.advanceTimersByTimeAsync(1251); });
  expect(document.querySelectorAll(".slot-reel--landing")).toHaveLength(1);
  await act(async () => { await vi.advanceTimersByTimeAsync(449); });
  expect(document.querySelectorAll(".slot-reel--settled")).toHaveLength(1);
  expect(document.querySelectorAll(".slot-reel--landing")).toHaveLength(1);
  expect(document.querySelectorAll(".slot-reel--spinning")).toHaveLength(1);
  fetchMock.mockRestore();
  vi.useRealTimers();
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
