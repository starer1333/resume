import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });
test.describe.configure({ mode: "serial" });

const closeTo = (actual: number, expected: number, tolerance = 1) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
};

test("home collage settles, wiggles without drift, and dog exits with scroll", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const anchor = page.locator('[data-motion="collage-anchor"]');
  const firstItem = page.locator('[data-motion="collage-item"]').first();
  await expect(firstItem).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });

  const anchorTransform = await anchor.evaluate((element) => element.style.transform);
  const restingItem = await firstItem.boundingBox();
  expect(anchorTransform).toBe("");
  expect(restingItem).not.toBeNull();

  await firstItem.hover();
  await page.waitForTimeout(110);
  expect(await firstItem.evaluate((element) => element.style.transform)).not.toBe("");
  await page.mouse.move(900, 650);
  await page.waitForTimeout(450);

  const settledItem = await firstItem.boundingBox();
  expect(settledItem).not.toBeNull();
  closeTo(settledItem!.x, restingItem!.x);
  closeTo(settledItem!.y, restingItem!.y);
  expect(await firstItem.evaluate((element) => element.style.transform)).toBe("");

  const dog = page.locator('[data-motion="scroll-dog"]');
  const dogRest = await dog.boundingBox();
  await page.evaluate(() => window.scrollTo(0, 330));
  await page.waitForTimeout(900);
  const dogExit = await dog.boundingBox();
  expect(dogExit!.x).toBeLessThan(dogRest!.x - 100);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  const dogReturn = await dog.boundingBox();
  closeTo(dogReturn!.x, dogRest!.x, 2);
});

test("cards spread into the approved row and each card resets after hover", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const cards = page.locator('[data-motion="playing-card"]');
  await expect(cards).toHaveCount(5);
  const stackedCenters = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return rect.x + rect.width / 2;
  }));
  expect(Math.max(...stackedCenters) - Math.min(...stackedCenters)).toBeLessThan(3);

  await page.evaluate(() => window.scrollTo(0, 941));
  await expect(cards.first()).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  const resting = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, transform: (element as HTMLElement).style.transform };
  }));
  expect(resting.map((item) => Math.round(item.x))).toEqual([128, 434, 727, 1028, 1325]);
  expect(resting.every((item) => item.transform === "")).toBe(true);

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
  expect(await cards.nth(2).evaluate((element) => (element as HTMLElement).style.transform)).toBe("");

  for (let replay = 0; replay < 3; replay += 1) {
    await cards.nth(2).hover();
    await page.waitForTimeout(80);
    await page.mouse.move(50, 500);
    await page.waitForTimeout(300);
  }
  const repeatedReset = await cards.nth(2).boundingBox();
  closeTo(repeatedReset!.x, resting[2].x);
  closeTo(repeatedReset!.y, resting[2].y);
});

test("about passport and role badges respond independently and return to rest", async ({ page }) => {
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  const passport = page.locator('[data-motion="passport"]');
  const badges = page.locator('[data-motion="role-badge"]');
  await expect(badges).toHaveCount(3);

  const passportRest = await passport.boundingBox();
  await page.mouse.move(passportRest!.x + passportRest!.width * 0.75, passportRest!.y + passportRest!.height * 0.35);
  await page.waitForTimeout(180);
  expect(await passport.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe("");
  await page.mouse.move(400, 500);
  await page.waitForTimeout(500);
  const passportReset = await passport.boundingBox();
  closeTo(passportReset!.x, passportRest!.x, 1.5);
  closeTo(passportReset!.y, passportRest!.y, 1.5);
  expect(await passport.evaluate((element) => (element as HTMLElement).style.transform)).toBe("");

  const badgeRest = await badges.first().boundingBox();
  await badges.first().hover();
  await page.waitForTimeout(120);
  const transforms = await badges.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
  expect(transforms[0]).not.toBe("none");
  expect(transforms.slice(1)).toEqual(["none", "none"]);
  await page.mouse.move(400, 500);
  await page.waitForTimeout(450);
  const badgeReset = await badges.first().boundingBox();
  closeTo(badgeReset!.x, badgeRest!.x);
  closeTo(badgeReset!.y, badgeRest!.y);
});

test("reduced motion preserves final layouts without motion transforms", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1672, height: 941 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="collage-item"]').first()).toHaveAttribute("data-motion-ready", "true");
  const transforms = await page.locator('[data-motion="collage-item"], [data-motion="playing-card"], [data-motion="scroll-dog"]').evaluateAll(
    (elements) => elements.map((element) => (element as HTMLElement).style.transform),
  );
  expect(transforms.every((transform) => transform === "")).toBe(true);
  await context.close();
});

test("navigation remounts motion cleanly", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="collage-item"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="collage-item"]').first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });
  await expect(page.locator('[data-motion="playing-card"]')).toHaveCount(5);
});