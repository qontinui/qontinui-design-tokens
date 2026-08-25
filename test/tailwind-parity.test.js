/**
 * v3 / v4 parity, asserted by compiling both engines.
 *
 * This package exists so that one component can be shared between qontinui-web
 * (Tailwind v4) and qontinui-runner (Tailwind v3). That promise is about what
 * Tailwind EMITS, and until now nothing here had ever fed the generated theme
 * layer to Tailwind at all: `tokens.test.js` asserts the text of `theme.css`,
 * which is a statement about a file, not about a stylesheet.
 *
 * The gap was not theoretical. When the v4 layer was generated from
 * `tailwindColors` rather than from the preset, three families of utility
 * diverged and every text-level assertion still passed:
 *
 *   - `animate-pulse-glow` did not exist under v4.
 *   - `shadow-glow-primary` existed under both and painted different things.
 *     v3 painted the box-shadow; v4, seeing only a `--color-glow-*` entry, read
 *     the same class as a shadow COLOUR and painted nothing at all. A shared
 *     component glowed in one app and rendered flat in the other, with no error
 *     on either side.
 *   - `dark:` followed the OS setting under v4 and the `.dark` class under v3,
 *     while `tokens.css`'s own `.dark` block is class-based in both.
 *
 * A wrong-but-present utility is the worst of the three, because every check
 * that asks "does this class exist?" answers yes. So these tests compare what
 * the two engines actually emit for the same class.
 *
 * The two engines are not textually comparable — v3 writes `--tw-shadow` and a
 * `--tw-shadow-colored` companion, v4 composes `box-shadow` from ring/inset
 * layers — so each assertion states the property that has to agree, not the
 * whole rule, and the shadow case resolves each engine's private-variable
 * chain before comparing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import postcss from "postcss";
import tailwindV4 from "@tailwindcss/postcss";
import tailwindV3 from "tailwindcss-v3";

import {
  attentionClassNames,
  attentionAccentClassNames,
  attentionLevels,
  doneSubtleClassName,
  qontinuiPreset,
} from "../dist/index.js";

const require = createRequire(import.meta.url);

// The fixture lives inside the package: both engines resolve `tailwindcss` and
// scan sources relative to the file that names them, so a system temp dir would
// resolve neither.
const root = fileURLToPath(new URL("..", import.meta.url));
const slash = (p) => p.split(path.sep).join("/");

/** The classes the package tells consumers to use, plus the preset's own. */
const CLASSES = [
  ...attentionLevels.flatMap((level) => attentionClassNames[level].split(" ")),
  ...Object.values(attentionAccentClassNames),
  ...doneSubtleClassName.split(" "),
  ...Object.keys(qontinuiPreset.theme.extend.boxShadow).map((n) => `shadow-${n}`),
  ...Object.keys(qontinuiPreset.theme.extend.animation).map((n) => `animate-${n}`),
  // One from each of the non-attention colour groups the README names as
  // parity-guaranteed. They exercise the shapes the flattening can get wrong:
  // a nested group, a group whose name repeats in the utility (`text-text-*`),
  // and the `border-ds` rename.
  "bg-brand-primary",
  "text-text-muted",
  "border-border-ds-subtle",
  "bg-bg-secondary",
  "dark:bg-brand-primary",
];

/** Compile CLASSES with one engine; returns the emitted CSS. */
async function compile(engine) {
  const dir = mkdtempSync(path.join(root, ".tw-fixture-"));
  try {
    const html = path.join(dir, "fixture.html");
    writeFileSync(html, `<div class="${CLASSES.join(" ")}"></div>`);

    if (engine === "v3") {
      const config = { presets: [qontinuiPreset], content: [html] };
      const input = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
      const result = await postcss([tailwindV3(config)]).process(input, {
        from: undefined,
      });
      return result.css;
    }

    // v4 takes its whole configuration from CSS. `@source` is what stands in
    // for v3's `content`, and it is the same mechanism a consumer needs in
    // order to scan this package — see "Scanning this package" in the README.
    //
    // `source(none)` switches OFF v4's automatic source detection, which would
    // otherwise scan the whole package on top of the fixture. That is not a
    // tidiness point: it scrapes class names out of README.md code fences and
    // the comments in src/*.ts, so `bg-attention-bg` and `shadow-glow-primary`
    // get minted whether or not the fixture names them, and the comparison
    // stops being between the two engines and starts being between v3 and
    // "whatever prose this repo happens to contain". Verified: with automatic
    // detection on, the v4 output carried ~30 utilities the fixture never
    // mentions, and every class here still appeared with the fixture EMPTY.
    const input = path.join(dir, "input.css");
    const css = [
      '@import "tailwindcss" source(none);',
      `@import "${slash(path.join(root, "dist", "theme.css"))}";`,
      `@source "${slash(html)}";`,
      "",
    ].join("\n");
    writeFileSync(input, css);
    const result = await postcss([tailwindV4()]).process(css, { from: input });
    return result.css;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** The text between the brace at `open` and its match, nesting included. */
function balanced(css, open) {
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}" && --depth === 0) return css.slice(open + 1, index);
  }
  throw new Error(`unterminated rule at offset ${open}`);
}

/**
 * The rule for exactly `className`, or null.
 *
 * Three things here are load-bearing, and the first two were wrong in the
 * version of this file that shipped in the first draft of this PR:
 *
 *  - ALL matching rules are merged, in document order, and `declared` below
 *    takes the LAST value. A rule can state a property more than once, and it
 *    is the last one that renders. v3 does exactly that for `shadow-glow-*`:
 *    because `glow` is in the preset's `colors` AND `glow-primary` is in its
 *    `boxShadow`, the rule ends `--tw-shadow: 0 0 12px var(--qontinui-glow-
 *    primary); … --tw-shadow-color: …; --tw-shadow: var(--tw-shadow-colored)`.
 *    Reading the first `--tw-shadow` reports a value the cascade discards.
 *  - The body is brace-AWARE. v4 wraps colour-mixing declarations in a nested
 *    `@supports`, and a `[^}]*` body stops dead at that block's closing brace,
 *    hiding whatever it re-declares.
 *  - `(?![\w-])` after the class, so `.bg-done-bg` cannot match
 *    `.bg-done-bg-strong`. No such collision exists today; the guard is here so
 *    that adding a longer name sharing a prefix does not silently retarget an
 *    assertion.
 */
function ruleFor(css, className) {
  // Both engines CSS-escape `:` and `/` in a class selector, so `dark:bg-x` is
  // emitted as `.dark\:bg-x`. Escape for CSS first, then for the regex — doing
  // only the second matches `.dark:bg-x`, which nothing emits.
  const selector = "." + className.replace(/[:/.]/g, (character) => `\\${character}`);
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escaped}(?![\\w-])([^{]*)\\{`, "g");

  const rules = [];
  for (let match; (match = pattern.exec(css)); ) {
    rules.push({
      suffix: match[1].trim(),
      body: balanced(css, pattern.lastIndex - 1),
    });
  }
  if (rules.length === 0) return null;

  return {
    suffixes: rules.map((rule) => rule.suffix),
    suffix: rules[rules.length - 1].suffix,
    body: rules
      .map((rule) => rule.body)
      .join(";")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

/** The LAST value `body` gives `property` — the one that renders. */
const declared = (body, property) => {
  const pattern = new RegExp(`(?:^|[;{])\\s*${property}\\s*:\\s*([^;}]+)`, "g");
  let value = null;
  for (let match; (match = pattern.exec(body)); ) value = match[1].trim();
  return value;
};

/** `--name, fallback` split at the top-level comma. */
function splitVarArgs(inner) {
  let depth = 0;
  for (let index = 0; index < inner.length; index += 1) {
    if (inner[index] === "(") depth += 1;
    else if (inner[index] === ")") depth -= 1;
    else if (inner[index] === "," && depth === 0) {
      return [inner.slice(0, index).trim(), inner.slice(index + 1).trim()];
    }
  }
  return [inner.trim(), null];
}

/**
 * Collapse a value to what the browser paints, by substituting every
 * `var(--tw-*)` the same rule declares (falling back to the `var()` fallback
 * when it declares none).
 *
 * Both engines reach the same shadow through a different chain of private
 * variables — v3 via `--tw-shadow-colored` / `--tw-shadow-color`, v4 via a
 * `var(--tw-shadow-color, <literal>)` fallback — so comparing any single
 * declaration compares plumbing. This compares the result.
 */
function resolveTailwindVars(value, body, depth = 0) {
  if (value === null || depth > 12) return value;

  const start = value.indexOf("var(--tw-");
  if (start === -1) return value;

  let nesting = 0;
  let end = -1;
  for (let index = start + 3; index < value.length; index += 1) {
    if (value[index] === "(") nesting += 1;
    else if (value[index] === ")" && --nesting === 0) {
      end = index;
      break;
    }
  }
  if (end === -1) return value;

  const [name, fallback] = splitVarArgs(value.slice(start + 4, end));
  const replacement = declared(body, name) ?? fallback ?? value.slice(start, end + 1);
  return resolveTailwindVars(
    value.slice(0, start) + replacement + value.slice(end + 1),
    body,
    depth + 1,
  );
}

const v3 = await compile("v3");
const v4 = await compile("v4");

// ---------------------------------------------------------------------------

test("both engines mint every class the package tells consumers to use", () => {
  for (const className of CLASSES) {
    assert.ok(ruleFor(v3, className), `v3 does not mint ${className}`);
    assert.ok(ruleFor(v4, className), `v4 does not mint ${className}`);
  }
});

test("the attention triples resolve to the same custom properties in both", () => {
  const properties = {
    bg: "background-color",
    fg: "color",
    border: "border-color",
  };

  for (const level of attentionLevels) {
    for (const [slot, property] of Object.entries(properties)) {
      const className = `${slot === "fg" ? "text" : slot === "bg" ? "bg" : "border"}-${level}-${slot}`;
      const expected = `var(--qontinui-${level}-${slot})`;
      assert.equal(declared(ruleFor(v3, className).body, property), expected, `v3 ${className}`);
      assert.equal(declared(ruleFor(v4, className).body, property), expected, `v4 ${className}`);
    }
  }
});

test("the row accents resolve to the same custom property in both", () => {
  for (const [level, className] of Object.entries(attentionAccentClassNames)) {
    const expected = `var(--qontinui-${level}-accent)`;
    assert.equal(declared(ruleFor(v3, className).body, "border-left-color"), expected);
    assert.equal(declared(ruleFor(v4, className).body, "border-left-color"), expected);
  }
});

test("`shadow-glow-*` paints the same box-shadow in both, not a colour in one", () => {
  // The regression this test was written for: with only `--color-glow-*`
  // mapped, v4 mints `shadow-glow-primary` as `--tw-shadow-color`, which tints
  // a shadow that is not there. Both engines must set the shadow ITSELF.
  //
  // These class names are doubly claimed — `glow` is in the preset's `colors`
  // as well as its `boxShadow` — so each engine reaches the shadow through its
  // own chain of private variables and lands on the same paint. Resolving the
  // chain is what makes the two comparable, and what makes a divergence
  // between the two declarations visible instead of averaged away.
  for (const [name, value] of Object.entries(qontinuiPreset.theme.extend.boxShadow)) {
    const className = `shadow-${name}`;

    const v3Body = ruleFor(v3, className).body;
    const v4Body = ruleFor(v4, className).body;

    assert.equal(
      declared(v4Body, "--tw-shadow-color"),
      null,
      `${className} is a shadow COLOUR under v4, not the shadow — the v4 theme ` +
        `layer is missing --shadow-${name}`,
    );

    const paintedByV3 = resolveTailwindVars(declared(v3Body, "--tw-shadow"), v3Body);
    const paintedByV4 = resolveTailwindVars(declared(v4Body, "--tw-shadow"), v4Body);

    assert.equal(paintedByV3, value, `v3 ${className} does not paint the preset value`);
    assert.equal(paintedByV4, value, `v4 ${className} does not paint the preset value`);
    assert.equal(paintedByV4, paintedByV3, `the engines disagree on ${className}`);

    assert.ok(declared(v3Body, "box-shadow"), `v3 ${className} emits no box-shadow`);
    assert.ok(declared(v4Body, "box-shadow"), `v4 ${className} emits no box-shadow`);
  }
});

test("`animate-*` names the same animation, and its keyframes are emitted", () => {
  for (const [name, value] of Object.entries(qontinuiPreset.theme.extend.animation)) {
    const className = `animate-${name}`;
    assert.equal(declared(ruleFor(v3, className).body, "animation"), value, `v3 ${className}`);
    assert.equal(declared(ruleFor(v4, className).body, "animation"), value, `v4 ${className}`);

    const keyframes = value.split(/\s+/)[0];
    const emitted = new RegExp(`@keyframes\\s+${keyframes}\\s*\\{`);
    assert.match(v3, emitted, `v3 does not emit @keyframes ${keyframes}`);
    assert.match(v4, emitted, `v4 does not emit @keyframes ${keyframes}`);
  }
});

test("`dark:` selects on the same thing in both engines", () => {
  // Not merely "both support dark" — the same SELECTOR. tokens.css re-themes on
  // `.dark`, so a v4 app left on the default `prefers-color-scheme` would move
  // its tokens and its `dark:` utilities on different signals.
  //
  // The expected selector comes from the preset rather than being spelled
  // `.dark` here: v3 takes a custom class as `darkMode: ["class", "<selector>"]`
  // and a hardcoded expectation would fail on the one preset change this test
  // most needs to keep verifying.
  const [, selector = ".dark"] = Array.isArray(qontinuiPreset.darkMode)
    ? qontinuiPreset.darkMode
    : [qontinuiPreset.darkMode];

  const fromV3 = ruleFor(v3, "dark:bg-brand-primary");
  const fromV4 = ruleFor(v4, "dark:bg-brand-primary");
  assert.equal(fromV3.suffix, `:is(${selector} *)`);
  assert.equal(fromV4.suffix, fromV3.suffix);
  assert.equal(fromV4.body, fromV3.body);
});

test("the two engines under test are the majors the package supports", () => {
  // A devDependency drifting to a different major would make this file assert
  // parity between two things that are not the pair consumers install.
  assert.match(require("tailwindcss/package.json").version, /^4\./);
  assert.match(require("tailwindcss-v3/package.json").version, /^3\./);
  assert.match(require("../package.json").peerDependencies.tailwindcss, /^>=3/);
});
