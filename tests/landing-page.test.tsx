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

test("renders the ambient casino signal field", () => {
  render(<Home />);

  expect(document.querySelector(".signal-field")).toHaveAttribute("aria-hidden", "true");
  expect(document.querySelectorAll(".signal-field__object")).toHaveLength(6);
});

test("renders visibly orbiting homepage objects", () => {
  render(<Home />);

  expect(document.querySelector(".orbit-console__halo")).toBeInTheDocument();
  expect(document.querySelector(".orbit-console__network")).toBeInTheDocument();
  expect(document.querySelector(".orbit-console__particle-field")).toBeInTheDocument();
  expect(document.querySelectorAll(".orbit-console__particle")).toHaveLength(8);
});

test("renders hero signal sweep and satellites", () => {
  render(<Home />);

  expect(document.querySelector(".orbit-console__sweep")).toBeInTheDocument();
  expect(document.querySelectorAll(".orbit-console__satellite")).toHaveLength(3);
});
