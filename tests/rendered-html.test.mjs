import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the production export contains the complete floor calculator", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Portable Floor Calculator/);
  assert.match(html, /PORTABLE-FLOORS\.CO\.UK/);
  assert.match(html, /Room length/);
  assert.match(html, /Room width/);
  assert.match(html, /15(?:<!-- -->)? total panels/);
  assert.match(html, /3000(?:<!-- -->)? × (?:<!-- -->)?3600(?:<!-- -->)? mm/);
  assert.match(html, /For all dance, anywhere/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
  assert.equal(html.match(/data-panel-piece=/g)?.length, 15);
});
