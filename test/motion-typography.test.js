/**
 * Motion and typography token tests.
 *
 * Each of these tokens is stated twice — as a TypeScript constant in
 * motion.ts / typography.ts and as a custom property in tokens.css's
 * motion-and-typography `:root` block — and the durations a third time, in the
 * reduced-motion `@media` block. Nothing relates the copies, so these tests do.
 *
 * Like tokens.test.js they read `dist/`, which is what consumers install.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  motion,
  durations,
  easings,
  cssEasings,
  reducedMotion,
  typography,
  fontFamilies,
  typeScaleReference,
  typeScale,
  fontWeights,
  lineHeights,
  letterSpacings,
} from "../dist/index.js";

const css = readFileSync(new URL("../dist/tokens.css", import.meta.url), "utf8");

const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");
const kebab = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Every rule block in the stylesheet that declares custom properties, as
 * `{ context, declarations }`, where `context` is the selector path
 * (e.g. `@media (prefers-reduced-motion: reduce) > :root`). Comments are
 * stripped first so a brace in prose cannot unbalance the walk.
 */
function blocks(source) {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const found = [];
  const stack = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      stack.push({ selector: normalize(text.slice(start, i)), body: i + 1 });
      start = i + 1;
    } else if (ch === "}") {
      const open = stack.pop();
      assert.ok(open, "unbalanced `}` in tokens.css");
      const declarations = new Map();
      const counts = new Map();
      // A block's own declarations only: drop nested blocks (`@media { :root
      // { ... } }`), which are recorded on their own when they close.
      let own = text.slice(open.body, i);
      while (/\{[^{}]*\}/.test(own)) own = own.replace(/\{[^{}]*\}/g, "");
      for (const part of own.split(";")) {
        const match = /^\s*(--[a-z0-9-]+)\s*:\s*([\s\S]+?)\s*$/.exec(part);
        if (!match) continue;
        declarations.set(match[1], normalize(match[2]));
        counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
      }
      if (declarations.size) {
        const context = [...stack.map((s) => s.selector), open.selector].join(" > ");
        found.push({ context, declarations, counts, offset: open.body });
      }
      start = i + 1;
    }
  }
  assert.equal(stack.length, 0, "unterminated block in tokens.css");
  return found;
}

const all = blocks(css);
const MOTION_TYPE = /^--qontinui-(duration|ease|font|type|line-height|letter-spacing)-/;

/** The one `:root` block (outside any at-rule) that declares these tokens. */
const roots = all.filter(
  (b) => b.context === ":root" && [...b.declarations.keys()].some((n) => MOTION_TYPE.test(n)),
);
const reducedContext = `@media ${normalize(reducedMotion.mediaQuery)} > :root`;
const reducedBlocks = all.filter((b) => b.context === reducedContext);

test("motion and typography live in exactly one :root block of their own", () => {
  assert.equal(roots.length, 1, "expected one motion/typography :root block");
  for (const name of roots[0].declarations.keys()) {
    assert.match(name, MOTION_TYPE, `${name} does not belong in the motion/typography block`);
  }
  for (const block of all) {
    if (block === roots[0] || block.context === reducedContext) continue;
    for (const name of block.declarations.keys()) {
      assert.doesNotMatch(name, MOTION_TYPE, `${name} is declared in ${block.context} too`);
    }
  }
});

test("no motion or typography property is declared twice within a block", () => {
  for (const block of [...roots, ...reducedBlocks]) {
    for (const [name, count] of block.counts) {
      assert.equal(count, 1, `${name} declared ${count} times in ${block.context}`);
    }
  }
});

const declared = () => roots[0].declarations;

/**
 * Assert `group` maps one-to-one onto `--qontinui-<prefix><key>` properties.
 * `exclude` names longer prefixes that belong to another group (`font-size-`
 * under `font-`).
 */
function assertGroup(group, prefix, render, exclude = []) {
  const expected = new Map(
    Object.entries(group).map(([key, value]) => [`--qontinui-${prefix}${kebab(key)}`, normalize(render(value))]),
  );
  for (const [name, value] of expected) {
    assert.equal(declared().get(name), value, `${name} disagrees with the TypeScript token`);
  }
  const inCss = [...declared().keys()].filter(
    (n) => n.startsWith(`--qontinui-${prefix}`) && !exclude.some((p) => n.startsWith(`--qontinui-${p}`)),
  );
  assert.deepEqual(inCss.sort(), [...expected.keys()].sort(), `--qontinui-${prefix}* is not one-to-one`);
}

test("every duration matches its custom property", () => {
  assertGroup(durations, "duration-", (ms) => `${ms}ms`);
});

test("every easing matches its custom property and its CSS string", () => {
  assertGroup(easings, "ease-", (points) => `cubic-bezier(${points.join(", ")})`);
  assert.deepEqual(Object.keys(cssEasings).sort(), Object.keys(easings).sort());
  for (const [name, points] of Object.entries(easings)) {
    assert.equal(cssEasings[name], `cubic-bezier(${points.join(", ")})`);
  }
});

test("every easing is a valid CSS cubic-bezier", () => {
  for (const [name, points] of Object.entries(easings)) {
    assert.equal(points.length, 4, `${name} needs four control points`);
    const [x1, , x2] = points;
    assert.ok(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1, `${name}: x1 and x2 must be within [0, 1]`);
  }
});

test("durations are whole, non-negative and ordered", () => {
  const values = Object.values(durations);
  for (const ms of values) assert.ok(Number.isInteger(ms) && ms >= 0, `${ms}`);
  assert.deepEqual([...values], [...values].sort((a, b) => a - b));
  assert.equal(durations.instant, 0);
});

test("the reduced-motion block collapses every duration to the contract's", () => {
  // A duration the block forgets keeps animating for exactly the viewers who
  // asked it not to.
  // CSS uses 0.01ms, not the contract's 0: a 0ms transition never runs, so
  // `transitionend` never fires and anything waiting on it hangs.
  assert.equal(reducedBlocks.length, 1, `expected one ${reducedContext} block`);
  assert.ok(
    reducedBlocks[0].offset > roots[0].offset,
    "the reduced-motion block must come after the :root block it overrides (same selector, so order wins)",
  );
  const reduced = reducedBlocks[0].declarations;
  for (const key of Object.keys(durations)) {
    const name = `--qontinui-duration-${kebab(key)}`;
    if (declared().get(name) === `${reducedMotion.duration}ms`) continue;
    assert.equal(reduced.get(name), reducedMotion.cssDuration, `${name} is not collapsed under reduced motion`);
  }
  for (const name of reduced.keys()) {
    assert.match(name, /^--qontinui-duration-/, `${name} does not belong in the reduced-motion block`);
  }
});

test("the reduced-motion contract never autoplays and always offers a poster and a play control", () => {
  assert.equal(reducedMotion.mediaQuery, "(prefers-reduced-motion: reduce)");
  assert.equal(reducedMotion.duration, durations.instant);
  assert.ok(parseFloat(reducedMotion.cssDuration) > 0 && parseFloat(reducedMotion.cssDuration) <= 1);
  assert.equal(reducedMotion.autoplay, false);
  assert.equal(reducedMotion.showPosterFrame, true);
  assert.equal(reducedMotion.playControl, true);
});

test("every font family matches its custom property and ends in a generic family", () => {
  assertGroup(fontFamilies, "font-", (stack) => stack, ["font-size-", "font-weight-"]);
  for (const [name, stack] of Object.entries(fontFamilies)) {
    assert.match(stack, /(sans-serif|serif|monospace)$/, `${name} has no generic fallback`);
  }
});

test("every type-scale size is reference pixels times --qontinui-type-unit", () => {
  assertGroup(typeScale, "font-size-", (px) => `calc(${px} * var(--qontinui-type-unit))`);
  assert.equal(declared().get("--qontinui-type-unit"), "1px");
  const typeProps = [...declared().keys()].filter((n) => n.startsWith("--qontinui-type-"));
  assert.deepEqual(typeProps, ["--qontinui-type-unit"]);
  assert.equal(typeScaleReference, 1080);
});

test("every weight, line height and letter spacing matches its custom property", () => {
  assertGroup(fontWeights, "font-weight-", String);
  assertGroup(lineHeights, "line-height-", String);
  assertGroup(letterSpacings, "letter-spacing-", (v) => v);
});

test("motion and typography aggregate every group by reference", () => {
  assert.equal(motion.durations, durations);
  assert.equal(motion.easings, easings);
  assert.equal(motion.cssEasings, cssEasings);
  assert.equal(motion.reducedMotion, reducedMotion);
  assert.equal(typography.fontFamilies, fontFamilies);
  assert.equal(typography.typeScaleReference, typeScaleReference);
  assert.equal(typography.typeScale, typeScale);
  assert.equal(typography.fontWeights, fontWeights);
  assert.equal(typography.lineHeights, lineHeights);
  assert.equal(typography.letterSpacings, letterSpacings);
});
