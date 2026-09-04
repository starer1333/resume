import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });

const rects = async (locator: import("@playwright/test").Locator) => locator.evaluateAll((elements) =>
  elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)];
  }),
);

test("explicit motion changes preserve all settled artboard geometry", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="collage-item"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  expect(await rects(page.locator('[data-motion="collage-anchor"]'))).toEqual([[676, 282, 326, 308]]);
  expect(await rects(page.locator(".home-title"))).toEqual([[705, 593, 430, 97]]);
  await expect(page.locator(".site-logo")).toHaveCount(1);

  await page.evaluate(() => window.scrollTo(0, 941));
  await expect(page.locator('[data-motion="playing-card"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 5_000 });
  expect(await rects(page.locator('[data-motion="playing-card"]'))).toEqual([
    [128, 271, 264, 412], [434, 279, 255, 408], [727, 279, 255, 409], [1028, 279, 258, 414], [1325, 280, 259, 415],
  ]);
  expect(await rects(page.locator(".cards-title"))).toEqual([[338, 145, 1040, 75]]);

  await page.goto("http://localhost:3000/question", { waitUntil: "networkidle" });
  expect((await rects(page.locator('[data-motion="question-item"]'))).slice(0, 3)).toEqual([
    [106, 114, 213, 242], [318, 138, 154, 165], [36, 290, 154, 171],
  ]);
  await expect(page.locator(".question-heading")).toHaveCount(1);
  await expect(page.locator(".question-scroll")).toHaveCount(0);

  await page.goto("http://localhost:3000/make", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="make-newspaper"]')).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  expect(await rects(page.locator('[data-motion="make-newspaper"]'))).toEqual([[248, 107, 1139, 780]]);

  await page.goto("http://localhost:3000/notes", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="note-caption"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  expect(await rects(page.locator('[data-motion="note-frame"]'))).toEqual([
    [90, 221, 368, 435], [454, 224, 346, 433], [830, 222, 304, 398], [1182, 226, 400, 437],
  ]);
  expect(await rects(page.locator('[data-motion="note-caption"]'))).toEqual([
    [142, 681, 232, 150], [516, 691, 226, 148], [882, 637, 242, 154], [1238, 688, 286, 151],
  ]);
});

test("About remains unchanged by the route-scoped additions", async ({ page }) => {
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  expect(await rects(page.locator('[data-motion="passport"]'))).toEqual([[865, 0, 807, 941]]);
  expect(await rects(page.locator('[data-motion="role-badge"]'))).toEqual([
    [103, 629, 216, 170], [381, 631, 200, 190], [628, 598, 191, 210],
  ]);
});