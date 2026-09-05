import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("test-results/reference-renders");
test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });
test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

test.beforeAll(async () => { await mkdir(output, { recursive: true }); });

async function capture(page: import("@playwright/test").Page, route: string, name: string, wait = 350) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: resolve(output, `${name}.png`), animations: "disabled" });
}

test("desktop visual states at 1672x941", async ({ page }) => {
  await capture(page, "/", "home-entry", 120);
  await expect(page.locator('[data-motion="hero"]')).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });
  await page.screenshot({ path: resolve(output, "home.png"), animations: "disabled" });
  await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 0.52)));
  await page.waitForTimeout(900);
  await page.screenshot({ path: resolve(output, "cards-transition.png"), animations: "disabled" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(1_250);
  await page.screenshot({ path: resolve(output, "cards.png"), animations: "disabled" });
  await capture(page, "/about", "about");
  await capture(page, "/question", "question");
  await capture(page, "/make", "make");
  await capture(page, "/make-postcard", "make-postcard");
  await capture(page, "/notes", "notes");
  await capture(page, "/unfinished", "unfinished");
});

test("Observe completes its hidden loading gate into the interactive final state", async ({ page }) => {
  await page.goto("http://localhost:3000/observe", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".observe-carousel canvas")).toBeVisible({ timeout: 6_000 });
  await expect(page.locator('[data-viscose-loader]')).toBeHidden();
  await expect(page.locator(".observe-carousel > div").first()).toHaveAttribute("data-viscose-state", "interactive", { timeout: 30_000 });
  await page.screenshot({ path: resolve(output, "observe.png"), animations: "disabled" });
  const before = await page.screenshot();
  await page.mouse.move(820, 470);
  await page.mouse.wheel(0, 520);
  await page.waitForTimeout(700);
  const after = await page.screenshot();
  expect(after.equals(before)).toBe(false);
});

test("mobile routes fit and homepage keeps its authored composition", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/about", "/observe", "/question", "/make", "/make-postcard", "/notes", "/unfinished"]) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(100);
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(widths.content, route).toBeLessThanOrEqual(widths.viewport);
  }
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="hero"]')).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });
  await page.screenshot({ path: resolve(output, "mobile-home.png"), fullPage: false, animations: "disabled" });
});
