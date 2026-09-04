import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });

const rects = async (locator: import("@playwright/test").Locator) => locator.evaluateAll((elements) =>
  elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)];
  }),
);

test("new homepage composition settles inside the viewport without obscuring its identity", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 110));
  await expect(page.locator('[data-motion="hero"]')).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });

  const center = await page.locator('[data-motion="hero-center"]').boundingBox();
  expect(center).not.toBeNull();
  const fragments = await page.locator('[data-motion="hero-fragment"]').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
  }));
  expect(fragments).toHaveLength(6);
  expect(fragments.every((rect) => rect.left >= 0 && rect.right <= 1672 && rect.top >= -110 && rect.bottom <= 941)).toBe(true);
  expect(await page.locator(".site-logo").count()).toBe(1);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await expect(page.locator('[data-motion="playing-card"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 5_000 });
  expect(await rects(page.locator('[data-motion="playing-card"]'))).toEqual([
    [128, 271, 264, 412], [434, 279, 255, 408], [727, 279, 255, 409], [1028, 279, 258, 414], [1325, 280, 259, 415],
  ]);
});

test("unrelated artboard geometry remains stable", async ({ page }) => {
  await page.goto("http://localhost:3000/question", { waitUntil: "networkidle" });
  expect((await rects(page.locator('[data-motion="question-item"]'))).slice(0, 3)).toEqual([
    [106, 114, 213, 242], [318, 138, 154, 165], [36, 290, 154, 171],
  ]);
  await expect(page.locator(".question-heading")).toHaveCount(1);

  await page.goto("http://localhost:3000/make", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="make-newspaper"]')).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  expect(await rects(page.locator('[data-motion="make-newspaper"]'))).toEqual([[248, 107, 1139, 780]]);

  await page.goto("http://localhost:3000/notes", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="note-caption"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  expect(await rects(page.locator('[data-motion="note-frame"]'))).toEqual([
    [90, 221, 368, 435], [454, 224, 346, 433], [830, 222, 304, 398], [1182, 226, 400, 437],
  ]);

  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  expect(await rects(page.locator('[data-motion="passport"]'))).toEqual([[865, 0, 807, 941]]);
  expect(await rects(page.locator('[data-motion="role-badge"]'))).toEqual([
    [103, 629, 216, 170], [381, 631, 200, 190], [628, 598, 191, 210],
  ]);
});