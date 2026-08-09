import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("shows a strong visible focus indicator for keyboard users", () => {
  assert.match(css, /:focus-visible\s*\{[^}]*outline:[^}]*\}/s);
  assert.doesNotMatch(css, /:focus-visible\s*\{[^}]*outline\s*:\s*none/s);
});

test("removes transitions and smooth scrolling when motion is reduced", () => {
  const reducedMotion = css.match(
    /@media\s*\(prefers-reduced-motion:reduce\)\s*\{.*?\}\s*\}/s,
  )?.[0];

  assert.ok(reducedMotion);
  assert.match(reducedMotion, /scroll-behavior:auto/);
  assert.match(reducedMotion, /transition:none/);
});
