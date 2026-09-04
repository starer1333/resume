import { expect, test } from "@playwright/test";

const production = "https://how-i-see-wang-jinghan.judy40202.chatgpt.site";
const local = "http://localhost:3000";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });

async function settle(page: import("@playwright/test").Page, origin: string, route: string) {
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  if (origin === local && route === "/") {
    await expect(page.locator('[data-motion="collage-item"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  } else {
    await page.waitForTimeout(400);
  }
}

test("settled Home, Cards, and About remain pixel-identical to production", async ({ browser }) => {
  const baselinePage = await browser.newPage({ viewport: { width: 1672, height: 941 } });
  const localPage = await browser.newPage({ viewport: { width: 1672, height: 941 } });

  await settle(baselinePage, production, "/");
  await settle(localPage, local, "/");
  expect((await localPage.screenshot()).equals(await baselinePage.screenshot()), "Home final frame").toBe(true);

  await baselinePage.evaluate(() => window.scrollTo(0, 941));
  await localPage.evaluate(() => window.scrollTo(0, 941));
  await baselinePage.waitForTimeout(400);
  await expect(localPage.locator('[data-motion="playing-card"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  expect((await localPage.screenshot()).equals(await baselinePage.screenshot()), "Cards final frame").toBe(true);

  await settle(baselinePage, production, "/about");
  await settle(localPage, local, "/about");
  expect((await localPage.screenshot()).equals(await baselinePage.screenshot()), "About final frame").toBe(true);

  await baselinePage.close();
  await localPage.close();
});