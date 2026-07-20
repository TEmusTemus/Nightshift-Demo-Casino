import { cleanup, render, screen } from "@testing-library/react";
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
