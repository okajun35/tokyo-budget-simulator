import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const ruleFor = (selector, { inside } = {}) => {
  const source = inside
    ? css.match(new RegExp(`@media \\(max-width:${inside}px\\)[^\\n]*`))?.[0] ?? ""
    : css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
  const rule = source.match(new RegExp(`\\${selector}\\s*\\{([^{}]*)\\}`))?.[1];

  assert.ok(rule, `${selector} の宣言が見つからない${inside ? `（${inside}px）` : ""}`);
  return rule;
};

/**
 * 「この変更の意味を見る」はパネルへ飛ぶアンカーである。
 * 広い画面ではパネルが行の隣に固定表示されているため、飛ぶ先が既に見えており
 * 何も起こらない。段組みが縦に積まれてパネルが9行の下へ回る帯でだけ意味を持つ。
 */
test("offers the jump to the panel only where the panel is out of view", () => {
  assert.match(ruleFor(".selectedDetailLink"), /display:none/);
  assert.match(ruleFor(".selectedDetailLink", { inside: 950 }), /display:flex/);
  assert.match(ruleFor(".simulatorWorkspace", { inside: 950 }), /grid-template-columns:1fr/);
  assert.match(css.match(/@media \(max-width:620px\)[^\n]*/)[0], /\.selectedDetailLink[^{]*\{[^}]*display:none/);
});
