import { cleanup, render, screen } from "@testing-library/react";
import Home from "../app/page";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

test("offers demo-account creation and game routes", () => {
  render(<Home />);

  expect(screen.getByRole("link", { name: /create demo account/i })).toHaveAttribute(
    "href",
    "/signup",
  );
  expect(screen.getByRole("link", { name: /play slot/i })).toHaveAttribute("href", "/slot");
  expect(screen.getByRole("link", { name: /play baccarat/i })).toHaveAttribute(
    "href",
    "/baccarat",
  );
});

test("states that play uses virtual chips only", () => {
  render(<Home />);

  expect(screen.getByText(/virtual chips only/i)).toBeInTheDocument();
});
