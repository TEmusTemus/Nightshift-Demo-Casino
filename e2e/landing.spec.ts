import { expect, test } from "@playwright/test";

test("landing page routes visitors to signup and Slot", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /create demo account/i }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByRole("link", { name: /back to NIGHTSHIFT/i }).click();
  await page.getByRole("link", { name: /play slot/i }).click();
  await expect(page).toHaveURL(/\/slot$/);
});
