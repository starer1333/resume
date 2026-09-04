import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("test-results/reference-renders");
test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });
test.describe.configure({ mode: "serial" });
test.setTimeout(240_000);

test.beforeAll(async () => { await mkdir(output, { recursive: true }); });

async function capture(page: import("@playwright/test").Page, route: string, name: string, wait = 350) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: resolve(output, `${name}.png`), animations: "disabled" });
}

test("reference artboards at 1672x941", async ({ page }) => {
  await capture(page, "/", "home", 2_400);
  await page.evaluate(() => window.scrollTo(0, 941));
  await page.waitForTimeout(1_500);
  await page.screenshot({ path: resolve(output, "cards.png"), animations: "disabled" });
  await capture(page, "/about", "about");
  await capture(page, "/question", "question");
  const spatial = page.locator(".question-canvas");
  const transformBefore = await spatial.evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.move(820, 470);
  await page.mouse.down();
  await page.mouse.move(720, 420, { steps: 5 });
  await page.mouse.up();
  const transformAfter = await spatial.evaluate((element) => getComputedStyle(element).transform);
  expect(transformAfter).not.toBe(transformBefore);
  await capture(page, "/make", "make");
  await capture(page, "/make-postcard", "make-postcard");
  await capture(page, "/notes", "notes");
  await capture(page, "/unfinished", "unfinished");
});





test("observe reaches the upstream interactive state", async ({ page }) => {
  await page.goto("http://localhost:3000/observe", { waitUntil: "networkidle" });
  await expect(page.locator(".observe-carousel > div").nth(3)).toHaveText("100", { timeout: 60_000 });
  await expect(page.locator('[aria-live="polite"]')).not.toHaveText("", { timeout: 180_000 });
  await expect(page.locator('ul[aria-label="Projects"] > li')).toHaveCount(18);
  await expect(page.locator(".observe-stage .site-logo")).toBeVisible();
  await page.screenshot({ path: resolve(output, "observe.png"), animations: "disabled" });
  const ringBefore = await page.screenshot();
  await page.mouse.move(820, 470);
  await page.mouse.wheel(0, 520);
  await page.waitForTimeout(700);
  const ringAfter = await page.screenshot();
  expect(ringAfter.equals(ringBefore)).toBe(false);
});

test("mobile fallback fits without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/about", "/observe", "/question", "/make", "/make-postcard", "/notes", "/unfinished"]) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(100);
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(widths.content, route).toBeLessThanOrEqual(widths.viewport);
  }
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(output, "mobile-home.png"), fullPage: true, animations: "disabled" });
});
