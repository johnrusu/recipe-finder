import { test, expect } from "@playwright/test";

// constants
import { HOME_PAGE } from "../src/constants";

test("visits the app root url", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-test="hero-title"]')).toHaveText(
    HOME_PAGE.TITLE
  );
});
