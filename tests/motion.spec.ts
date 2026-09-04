import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });
test.describe.configure({ mode: "serial" });

const closeTo = (actual: number, expected: number, tolerance = 1) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
};

test("Home and Cards form one surface; sloth holds, exits, and returns", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  await expect(page.locator(".site-logo")).toHaveCount(1);
  await expect(page.locator(".site-nav")).toHaveCount(1);
  const backgrounds = await page.locator(".home-stage, .cards-stage").evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).backgroundColor),
  );
  expect(backgrounds).toEqual(["rgb(249, 249, 249)", "rgb(249, 249, 249)"]);

  const anchor = page.locator('[data-motion="collage-anchor"]');
  const firstItem = page.locator('[data-motion="collage-item"]').first();
  await expect(firstItem).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  expect(await anchor.evaluate((element) => (element as HTMLElement).style.transform)).toBe("");

  const restingItem = await firstItem.boundingBox();
  await firstItem.hover();
  await page.waitForTimeout(110);
  expect(await firstItem.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe("");
  await page.mouse.move(900, 650);
  await page.waitForTimeout(450);
  const settledItem = await firstItem.boundingBox();
  closeTo(settledItem!.x, restingItem!.x);
  closeTo(settledItem!.y, restingItem!.y);

  const sloth = page.locator('[data-motion="scroll-sloth"]');
  await expect(sloth).toHaveAttribute("src", "/assets/shared/sloth.jpg");
  const rest = await sloth.boundingBox();
  await page.evaluate(() => window.scrollTo(0, 330));
  await page.waitForTimeout(950);
  const early = await sloth.boundingBox();
  closeTo(early!.x, rest!.x, 3);

  await page.evaluate(() => window.scrollTo(0, 850));
  await page.waitForTimeout(950);
  const late = await sloth.boundingBox();
  expect(late!.x).toBeLessThan(rest!.x - 120);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(950);
  const returned = await sloth.boundingBox();
  closeTo(returned!.x, rest!.x, 3);
});

test("Cards stage from center, reveal in phases, preserve routes, and reset hover", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const cards = page.locator('[data-motion="playing-card"]');
  await expect(cards).toHaveCount(5);
  expect(await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")))).toEqual([
    "/observe", "/question", "/make", "/notes", "/unfinished",
  ]);

  const compactCenters = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return rect.x + rect.width / 2;
  }));
  expect(Math.max(...compactCenters) - Math.min(...compactCenters)).toBeLessThan(3);

  await page.evaluate(() => window.scrollTo(0, 941));
  await expect(cards.first()).toHaveAttribute("data-motion-ready", "true", { timeout: 5_000 });
  const resting = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, transform: (element as HTMLElement).style.transform };
  }));
  expect(resting.map((item) => Math.round(item.x))).toEqual([128, 434, 727, 1028, 1325]);
  expect(resting.every((item) => item.transform === "")).toBe(true);
  expect(await page.locator('[data-motion="card-content"]').evaluateAll((elements) =>
    elements.every((element) => !(element as HTMLElement).style.transform && !(element as HTMLElement).style.clipPath),
  )).toBe(true);

  await cards.nth(2).hover();
  await page.waitForTimeout(120);
  const active = await cards.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
  expect(active[2]).not.toBe("none");
  expect(active.filter((transform, index) => index !== 2 && transform !== "none")).toHaveLength(0);
  await page.mouse.move(50, 500);
  await page.waitForTimeout(450);
  const reset = await cards.nth(2).boundingBox();
  closeTo(reset!.x, resting[2].x);
  closeTo(reset!.y, resting[2].y);
});

test("Question removes the dog and gives each scrap independent pointer follow", async ({ page }) => {
  await page.goto("http://localhost:3000/question", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="question-item"]')).toHaveCount(23);
  await expect(page.locator(".question-scroll")).toHaveCount(0);
  await expect(page.locator('img[src="/assets/shared/scroll.webp"]')).toHaveCount(0);

  const items = page.locator('[data-motion="question-item"]');
  const first = items.first();
  await expect(first).toHaveAttribute("data-motion-ready", "true");
  const rest = await first.boundingBox();
  await page.mouse.move(rest!.x + rest!.width * 0.8, rest!.y + rest!.height * 0.25);
  await page.waitForTimeout(180);
  expect(await first.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe("");
  const transforms = await items.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).style.transform));
  expect(transforms.slice(1).every((transform) => transform === "")).toBe(true);

  await page.mouse.move(840, 180);
  await page.waitForTimeout(420);
  const reset = await first.boundingBox();
  closeTo(reset!.x, rest!.x, 1.5);
  closeTo(reset!.y, rest!.y, 1.5);
  expect(await first.evaluate((element) => (element as HTMLElement).style.transform)).toBe("");
});

test("Make opens the existing single-raster newspaper and settles exactly", async ({ page }) => {
  await page.goto("http://localhost:3000/make", { waitUntil: "domcontentloaded" });
  const newspaper = page.locator('[data-motion="make-newspaper"]');
  await expect(newspaper).toBeVisible();
  await expect(newspaper).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  const final = await newspaper.boundingBox();
  expect(final).toEqual({ x: 248, y: 107, width: 1139, height: 780 });
  expect(await newspaper.evaluate((element) => ({
    transform: (element as HTMLElement).style.transform,
    clipPath: (element as HTMLElement).style.clipPath,
  }))).toEqual({ transform: "", clipPath: "" });
  const image = page.locator(".make-newspaper");
  const imageBox = await image.boundingBox();
  expect(imageBox).toEqual(final);
  await expect(page.locator(".make-hotspots .art-link")).toHaveCount(4);
});

test("Notes assemble center-out, reveal captions, and hover independently", async ({ page }) => {
  await page.goto("http://localhost:3000/notes", { waitUntil: "networkidle" });
  const frames = page.locator('[data-motion="note-frame"]');
  const captions = page.locator('[data-motion="note-caption"]');
  await expect(frames).toHaveCount(4);
  await expect(captions).toHaveCount(4);
  await expect(frames.first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  expect(await frames.evaluateAll((elements) => elements
    .map((element) => ({ index: Number(element.getAttribute("data-motion-index")), order: Number((element as HTMLElement).dataset.motionOrder) }))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.index),
  )).toEqual([2, 1, 3, 0]);
  await expect(captions.first()).toHaveAttribute("data-motion-ready", "true", { timeout: 2_000 });
  expect(await captions.evaluateAll((elements) => elements.every((element) => !(element as HTMLElement).style.transform))).toBe(true);

  const rest = await frames.nth(1).boundingBox();
  await frames.nth(1).hover();
  await page.waitForTimeout(140);
  const transforms = await frames.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
  expect(transforms[1]).not.toBe("none");
  expect(transforms.filter((transform, index) => index !== 1 && transform !== "none")).toHaveLength(0);
  await page.mouse.move(820, 850);
  await page.waitForTimeout(430);
  const reset = await frames.nth(1).boundingBox();
  closeTo(reset!.x, rest!.x, 1.5);
  closeTo(reset!.y, rest!.y, 1.5);
});

test("About motion remains isolated and reduced motion preserves final layouts", async ({ browser, page }) => {
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  const passport = page.locator('[data-motion="passport"]');
  const passportRest = await passport.boundingBox();
  await page.mouse.move(passportRest!.x + passportRest!.width * 0.75, passportRest!.y + passportRest!.height * 0.35);
  await page.waitForTimeout(180);
  expect(await passport.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe("");

  const context = await browser.newContext({ viewport: { width: 1672, height: 941 }, reducedMotion: "reduce" });
  const reducedPage = await context.newPage();
  for (const route of ["/", "/question", "/make", "/notes"]) {
    await reducedPage.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    const transforms = await reducedPage.locator('[data-motion="collage-item"], [data-motion="playing-card"], [data-motion="scroll-sloth"], [data-motion="question-item"], [data-motion="make-newspaper"], [data-motion="note-frame"]').evaluateAll(
      (elements) => elements.map((element) => (element as HTMLElement).style.transform),
    );
    expect(transforms.every((transform) => transform === ""), route).toBe(true);
  }
  await context.close();
});