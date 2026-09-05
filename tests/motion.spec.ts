import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 });
test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

const routes = ["/", "/about", "/observe", "/question", "/make", "/make-postcard", "/notes", "/unfinished"];

const closeTo = (actual: number, expected: number, tolerance = 1) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
};

test("global Jinghan wordmark is real text and fake email UI is absent", async ({ page }) => {
  for (const route of routes) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
    const logo = page.locator(".site-logo").first();
    await expect(logo, route).toHaveText("jinghan");
    await expect(logo.locator("img"), route).toHaveCount(0);
    await expect(page.locator('a[href^="mailto:"]'), route).toHaveCount(0);
    await expect(page.locator('img[src*="email"]'), route).toHaveCount(0);
    expect((await page.locator("body").innerText()).toLowerCase(), route).not.toContain("hello@example.com");
  }
});

test("hero seeds JH first, scatters six fragments, and replays after upward re-arm", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  const hero = page.locator('[data-motion="hero"]');
  const cards = page.locator('[data-motion="hero-fragment"]');

  await expect(page.locator('[data-motion="hero-center"]')).toHaveAttribute("data-center-mode", "logo");
  await expect(page.locator(".hero-center__mark")).toHaveText("JH");
  await expect(cards).toHaveCount(6);
  expect(await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-fragment-id")))).toEqual([
    "guitar", "piano", "photography", "editing", "film", "aesthetic",
  ]);
  expect(await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")))).toEqual([
    null, null, "/observe", "/make", "/observe", "/notes",
  ]);

  await expect(hero).toHaveAttribute("data-hero-state", "entering");
  expect(await cards.evaluateAll((elements) => elements.every((element) => (element as HTMLElement).style.transform !== ""))).toBe(true);
  expect(await cards.evaluateAll((elements) => elements.every((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.2))).toBe(true);
  await expect(hero).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });

  const play = async () => {
    await page.evaluate(() => window.scrollTo(0, 110));
    await expect(hero).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });
    expect(await cards.evaluateAll((elements) => elements.every((element) => (element as HTMLElement).dataset.motionReady === "true"))).toBe(true);
  };
  const rearm = async () => {
    await page.evaluate(() => window.scrollTo(0, 1_050));
    await page.waitForTimeout(80);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(hero).toHaveAttribute("data-hero-state", "rearmed", { timeout: 1_500 });
    expect(await cards.evaluateAll((elements) => elements.every((element) => (element as HTMLElement).dataset.motionReady === "false"))).toBe(true);
  };

  await rearm();
  await play();
  await rearm();
  await play();
});

test("hero pointer response is local and restores exact geometry", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="hero"]')).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });

  const cards = page.locator('[data-motion="hero-fragment"]');
  const surfaces = page.locator('[data-motion="hero-fragment-surface"]');
  const rest = await cards.nth(2).boundingBox();
  const surface = surfaces.nth(2);
  const box = await surface.boundingBox();
  await page.mouse.move(box!.x + box!.width * 0.78, box!.y + box!.height * 0.28);
  await expect(surface).toHaveAttribute("data-hovered", "true");
  expect(await surface.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe("");
  expect(await surfaces.evaluateAll((elements) => elements.slice(0, 2).concat(elements.slice(3)).every((element) => !(element as HTMLElement).style.transform))).toBe(true);

  await page.mouse.move(820, 120);
  await page.waitForTimeout(420);
  const reset = await cards.nth(2).boundingBox();
  closeTo(reset!.x, rest!.x, 1.5);
  closeTo(reset!.y, rest!.y, 1.5);
});

test("cards use one scrubbed heading and finish at the authored 1672 layout", async ({ page }) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const heading = page.locator('[data-motion="cards-heading"]');
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText("What do I make of things?");

  const backgrounds = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".home-hero")!;
    const cards = document.querySelector<HTMLElement>(".cards-stage")!;
    return {
      heroColor: getComputedStyle(hero).backgroundColor,
      cardsColor: getComputedStyle(cards).backgroundColor,
      heroImage: getComputedStyle(hero).backgroundImage,
      cardsImage: getComputedStyle(cards).backgroundImage,
    };
  });
  expect(backgrounds.cardsColor).toBe(backgrounds.heroColor);
  expect(backgrounds.cardsImage).toBe(backgrounds.heroImage);

  await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 0.52)));
  await page.waitForTimeout(1_000);
  const middleScale = await heading.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);
  expect(middleScale).toBeGreaterThan(1.1);
  expect(middleScale).toBeLessThan(2.3);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(1_250);
  const finalHeading = await heading.boundingBox();
  closeTo(finalHeading!.x, 338, 1);
  closeTo(finalHeading!.y, 145, 1);
  const expected = [[128, 271, 264, 412], [434, 279, 255, 408], [727, 279, 255, 409], [1028, 279, 258, 414], [1325, 280, 259, 415]];
  const boxes = await page.locator('[data-motion="playing-card"]').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return [rect.x, rect.y, rect.width, rect.height];
  }));
  boxes.forEach((box, index) => box.forEach((value, axis) => closeTo(value, expected[index][axis], 1)));
});

test("Observe keeps its hidden counter gate, then becomes interactive", async ({ page }) => {
  await page.goto("http://localhost:3000/observe", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".observe-carousel canvas")).toBeVisible({ timeout: 6_000 });
  await expect(page.locator('ul[aria-label="Projects"] > li')).toHaveCount(18);
  const hiddenLoader = page.locator('[data-viscose-loader]');
  await expect(hiddenLoader).toBeHidden();
  await expect(hiddenLoader).toHaveText("100", { timeout: 8_000 });
  await expect(page.locator(".observe-carousel > div").first()).toHaveAttribute("data-viscose-state", "interactive", { timeout: 15_000 });
  await expect(page.locator('[aria-live="polite"]')).not.toHaveText("");

  const before = await page.screenshot();
  await page.mouse.move(820, 470);
  await page.mouse.wheel(0, 520);
  await page.waitForTimeout(700);
  const after = await page.screenshot();
  expect(after.equals(before)).toBe(false);
});

test("mobile keeps the compact unfold, re-arm logic, and no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const hero = page.locator('[data-motion="hero"]');
  const cards = page.locator('[data-motion="hero-fragment"]');
  await expect(hero).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });

  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);
  expect(await cards.evaluateAll((elements) => elements.every((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left >= -1 && rect.right <= window.innerWidth + 1 && rect.width >= 135;
  }))).toBe(true);

  await page.evaluate(() => window.scrollTo(0, 1_050));
  await page.waitForTimeout(80);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hero).toHaveAttribute("data-hero-state", "rearmed", { timeout: 1_500 });
  await page.evaluate(() => window.scrollTo(0, 70));
  await expect(hero).toHaveAttribute("data-hero-state", "expanded", { timeout: 3_000 });
});

test("unrelated Question, Make, Notes, and About motion remains healthy", async ({ browser, page }) => {
  await page.goto("http://localhost:3000/question", { waitUntil: "networkidle" });
  await expect(page.locator('[data-motion="question-item"]')).toHaveCount(23);
  await expect(page.locator(".question-scroll")).toHaveCount(0);

  await page.goto("http://localhost:3000/make", { waitUntil: "domcontentloaded" });
  const newspaper = page.locator('[data-motion="make-newspaper"]');
  const leftFold = page.locator('[data-motion="make-newspaper-left"]');
  const rightFold = page.locator('[data-motion="make-newspaper-right"]');
  await expect(leftFold).toBeVisible();
  await expect(rightFold).toBeVisible();
  expect(await leftFold.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  expect(await rightFold.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await expect(newspaper).toHaveAttribute("data-motion-ready", "true", { timeout: 3_000 });
  expect(await newspaper.boundingBox()).toEqual({ x: 248, y: 107, width: 1139, height: 780 });
  await expect(page.locator('[data-motion="make-newspaper-left"]')).toBeHidden();
  await expect(page.locator('[data-motion="make-newspaper-right"]')).toBeHidden();
  await expect(page.locator(".make-hotspots")).toHaveCount(0);

  await page.goto("http://localhost:3000/notes", { waitUntil: "networkidle" });
  const frames = page.locator('[data-motion="note-frame"]');
  await expect(frames).toHaveCount(4);
  await expect(frames.first()).toHaveAttribute("data-motion-ready", "true", { timeout: 4_000 });

  const context = await browser.newContext({ viewport: { width: 1672, height: 941 }, reducedMotion: "reduce" });
  const reducedPage = await context.newPage();
  await reducedPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await expect(reducedPage.locator('[data-motion="hero"]')).toHaveAttribute("data-hero-state", "expanded");
  expect(await reducedPage.locator('[data-motion="hero-fragment"]').evaluateAll((elements) => elements.every((element) => !(element as HTMLElement).style.transform))).toBe(true);
  await context.close();
});

test("1440 desktop fallback has no horizontal document overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);
});
