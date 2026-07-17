import assert from "node:assert/strict";
import test from "node:test";

import { calculateFloor } from "./floor-calculator.ts";

test("chooses 15 primary panels for the 3000 × 4000 mm example", () => {
  const result = calculateFloor(3000, 4000);

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.usableLength, 3000);
  assert.equal(result.usableWidth, 3600);
  assert.equal(result.orientation, "B");
  assert.equal(result.primaryPanels, 15);
  assert.equal(result.fillerPanels, 0);
  assert.equal(result.totalPanels, 15);
  assert.equal(result.panels.length, 15);
});

test("rounds down to the 600 mm grid and chooses Orientation A", () => {
  const result = calculateFloor(2500, 1900);

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.usableLength, 2400);
  assert.equal(result.usableWidth, 1800);
  assert.equal(result.unusedLength, 100);
  assert.equal(result.unusedWidth, 100);
  assert.equal(result.areaSquareMetres, 4.32);
  assert.equal(result.orientation, "A");
  assert.equal(result.totalPanels, 6);
  assert.equal(result.comparison.A.totalPanels, 6);
  assert.equal(result.comparison.B.totalPanels, 8);
});

test("uses Orientation A as the stable tie-breaker", () => {
  const result = calculateFloor(1800, 1800);

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.comparison.A.totalPanels, 6);
  assert.equal(result.comparison.B.totalPanels, 6);
  assert.equal(result.orientation, "A");
});

test("places square fillers in the remainder strip", () => {
  const result = calculateFloor(1800, 3000);

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.orientation, "B");
  assert.equal(result.primaryPanels, 6);
  assert.equal(result.fillerPanels, 3);
  assert.equal(result.totalPanels, 9);
  assert.equal(
    result.panels.filter((panel) => panel.type === "filler").length,
    3,
  );
  assert.deepEqual(
    result.panels.filter((panel) => panel.type === "filler").map((panel) => panel.y),
    [2400, 2400, 2400],
  );
});

test("rejects dimensions that cannot fit one 600 mm square", () => {
  for (const dimensions of [
    [0, 1200],
    [-1, 1200],
    [599, 1200],
    [Number.NaN, 1200],
  ]) {
    const result = calculateFloor(dimensions[0], dimensions[1]);
    assert.deepEqual(result, {
      valid: false,
      message: "Enter room dimensions of at least 600 mm.",
    });
  }
});
