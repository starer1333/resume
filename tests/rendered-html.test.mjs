import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";


async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("all public portfolio routes server-render", async () => {
  for (const path of ["/", "/about", "/observe", "/question", "/make", "/make-postcard", "/notes", "/unfinished"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
  }
});

test("production assets and attribution exist without raw references", async () => {
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../vendor/viscose/LICENSE", import.meta.url));
  await assert.rejects(access(new URL("../public/__references", import.meta.url)));
  const pkg = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(pkg, /react-loading-skeleton/);
});
