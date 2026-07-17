import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the page composes the branded live calculator", async () => {
  const [page, calculator, plan] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/floor-calculator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/floor-plan.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /PORTABLE-FLOORS\.CO\.UK/);
  assert.match(page, /For all dance, anywhere/);
  assert.match(calculator, /onChange/);
  assert.match(calculator, /Room length/);
  assert.match(calculator, /Room width/);
  assert.match(calculator, /aria-live="polite"/);
  assert.match(plan, /data-panel-piece/);
});
