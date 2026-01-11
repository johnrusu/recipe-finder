import { test, expect } from "@playwright/test";

// constants
import { APP } from "../src/constants";

test("visits the app root url", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-test="header-app-title"]')).toHaveText(
    APP.TITLE
  );
});
