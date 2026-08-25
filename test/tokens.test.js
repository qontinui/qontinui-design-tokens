/**
 * Token consistency tests.
 *
 * Every token in this package is stated FOUR times — as a TypeScript constant
 * in colors.ts, as a custom property in the `:root` block of tokens.css, again
 * in the `.dark` block, and as a `var()` reference in tailwind.ts — plus a
 * fifth, generated time in the v4 theme layer. Nothing in the type system
 * relates any of those to any other, so the whole set is held together by
 * whoever last edited it remembering all five places.
 *
 * That is the failure the attention layer's own source comments warn about:
 * "a narrowed pick here would silently half-define the layer, exactly as an
 * edit to only one of the two blocks in tokens.css would". A half-defined token
 * does not throw — `bg-testing-bg` just renders nothing, in dark mode only, on
 * one page. These tests turn each of those invariants into a build failure.
 *
 * They run against `dist/`, not `src/`, so what is asserted is what consumers
 * actually install.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

import {
  colors,
  brand,
  surface,
  border,
  text,
  semantic,
  glow,
  attentionPalette,
  attentionLevels,
  tailwindColors,
  attentionClassNames,
  attentionAccentClassNames,
  doneSubtleClassName,
  qontinuiPreset,
} from "../dist/index.js";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const read = (name) =>
  readFileSync(new URL(`../dist/${name}`, import.meta.url), "utf8");

/** Custom properties declared inside the first `<selector> { ... }` block. */
function declarationsIn(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `no \`${selector}\` block`);
  const end = css.indexOf("\n}", start);
  assert.notEqual(end, -1, `\`${selector}\` block is unterminated`);

  const declarations = new Map();
  for (const line of css.slice(start, end).split("\n")) {
    const match = /^\s*(--[a-z0-9-]+)\s*:\s*(.+?);\s*$/.exec(line);
    if (match) declarations.set(match[1], normalize(match[2]));
  }
  return declarations;
}

/** Hex case and inter-token spacing are not meaningful; content is. */
const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

/** `subtleBg` -> `subtle-bg` */
const kebab = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** Every entry of the Tailwind map, flattened to `utility name -> var(...)`. */
function tailwindVarReferences() {
  const refs = new Map();
  for (const [group, value] of Object.entries(tailwindColors)) {
    if (typeof value === "string") {
      refs.set(group, value);
      continue;
    }
    for (const [name, v] of Object.entries(value)) {
      refs.set(`${group}-${name}`, v);
    }
  }
  return refs;
}

const varName = (reference) => {
  const match = /^var\((--[a-z0-9-]+)\)$/.exec(reference);
  assert.ok(match, `not a bare var() reference: ${reference}`);
  return match[1];
};

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const tokensCss = read("tokens.css");
const themeCss = read("theme.css");
const root = declarationsIn(tokensCss, ":root");
const dark = declarationsIn(tokensCss, ".dark");
const references = tailwindVarReferences();

// ---------------------------------------------------------------------------
// tokens.css: the two blocks must stay in lockstep
// ---------------------------------------------------------------------------

test(":root and .dark declare exactly the same custom properties", () => {
  assert.deepEqual([...dark.keys()].sort(), [...root.keys()].sort());
});

test(":root and .dark agree on every value", () => {
  // The palette is dark-optimized already, so the two blocks are deliberately
  // identical. If a token ever genuinely needs to differ per theme, this test
  // is the right place to record that the difference is intentional.
  for (const [name, value] of root) {
    assert.equal(dark.get(name), value, `${name} differs between :root and .dark`);
  }
});

test("no custom property is declared twice within a block", () => {
  const declared = tokensCss.match(/^\s*--qontinui-[a-z0-9-]+\s*:/gm) ?? [];
  assert.equal(declared.length, root.size + dark.size);
});

// ---------------------------------------------------------------------------
// tailwind.ts <-> tokens.css: no dangling reference, no orphan token
// ---------------------------------------------------------------------------

test("every var() the Tailwind map references is declared in tokens.css", () => {
  for (const [utility, reference] of references) {
    const name = varName(reference);
    assert.ok(root.has(name), `${utility} references undeclared ${name}`);
  }
});

test("every declared token is reachable as a Tailwind utility", () => {
  // An orphan token is not a rendering bug, but it is a token nobody can use
  // without editing this package — which is how a layer ends up half-adopted.
  const referenced = new Set([...references.values()].map(varName));
  for (const name of root.keys()) {
    assert.ok(referenced.has(name), `${name} is declared but no utility exposes it`);
  }
});

// ---------------------------------------------------------------------------
// colors.ts <-> tokens.css: the TypeScript and CSS statements of one value
// ---------------------------------------------------------------------------

test("every colors.ts constant matches its custom property", () => {
  const groups = [
    [brand, "brand-"],
    [surface, "surface-"],
    [border, "border-"],
    [text, "text-"],
    [glow, "glow-"],
    [semantic, ""], // `--qontinui-success`, not `--qontinui-semantic-success`
  ];

  for (const [group, prefix] of groups) {
    for (const [key, value] of Object.entries(group)) {
      const name = `--qontinui-${prefix}${kebab(key)}`;
      assert.equal(root.get(name), normalize(value), `${name} disagrees with colors.ts`);
    }
  }

  for (const [level, triple] of Object.entries(attentionPalette)) {
    for (const [key, value] of Object.entries(triple)) {
      const name = `--qontinui-${level}-${kebab(key)}`;
      assert.equal(root.get(name), normalize(value), `${name} disagrees with colors.ts`);
    }
  }
});

test("colors aggregates every group by reference", () => {
  assert.equal(colors.brand, brand);
  assert.equal(colors.surface, surface);
  assert.equal(colors.border, border);
  assert.equal(colors.text, text);
  assert.equal(colors.semantic, semantic);
  assert.equal(colors.attention, attentionPalette);
  assert.equal(colors.glow, glow);
});

// ---------------------------------------------------------------------------
// The attention layer
// ---------------------------------------------------------------------------

test("attentionLevels lists every level, and only real levels", () => {
  // The type system checks that no entry here is a non-level; only a runtime
  // check can catch a level added to the palette and forgotten here.
  assert.deepEqual([...attentionLevels], Object.keys(attentionPalette));
});

test("every level defines the full bg/fg/border triple", () => {
  for (const level of attentionLevels) {
    for (const slot of ["bg", "fg", "border"]) {
      assert.ok(attentionPalette[level][slot], `${level} is missing ${slot}`);
      assert.ok(root.has(`--qontinui-${level}-${slot}`), `--qontinui-${level}-${slot} missing`);
    }
  }
});

test("inert tracks the muted family it is documented to equal", () => {
  assert.equal(attentionPalette.inert.bg, surface.active);
  assert.equal(attentionPalette.inert.fg, text.muted);
  assert.equal(attentionPalette.inert.border, border.subtle);

  // colors.ts references those constants; tokens.css restates them, because a
  // stylesheet cannot import. This is the check that keeps the restatement true.
  assert.equal(root.get("--qontinui-inert-bg"), root.get("--qontinui-surface-active"));
  assert.equal(root.get("--qontinui-inert-fg"), root.get("--qontinui-text-muted"));
  assert.equal(root.get("--qontinui-inert-border"), root.get("--qontinui-border-subtle"));
});

test("attentionClassNames names utilities the token layer actually mints", () => {
  for (const level of attentionLevels) {
    assert.equal(
      attentionClassNames[level],
      `bg-${level}-bg text-${level}-fg border-${level}-border`,
    );
    for (const slot of ["bg", "fg", "border"]) {
      assert.ok(references.has(`${level}-${slot}`), `no utility for ${level}-${slot}`);
    }
  }
});

test("every attention class name survives into the shipped output verbatim", () => {
  // Tailwind emits a utility only when it finds the whole class string in a
  // scanned file. Assembling these names at runtime — `bg-${level}-bg` — would
  // leave nothing for the scanner to find, and every badge using them would
  // render unstyled while the tokens themselves stayed perfectly correct. This
  // asserts the strings are literals in dist/, which is the only form a
  // consumer scanning this package can act on.
  const shipped = readdirSync(new URL("../dist/", import.meta.url))
    .filter((name) => name.endsWith(".js") || name.endsWith(".cjs"))
    .map((name) => read(name))
    .join("\n");

  for (const className of [
    ...Object.values(attentionClassNames),
    ...Object.values(attentionAccentClassNames),
    doneSubtleClassName,
  ]) {
    assert.ok(shipped.includes(className), `not a literal in dist/: ${className}`);
  }
});

test("an -accent class exists for exactly the levels that define one", () => {
  const withAccent = attentionLevels.filter((level) => "accent" in attentionPalette[level]);
  assert.deepEqual(Object.keys(attentionAccentClassNames).sort(), [...withAccent].sort());
  for (const level of withAccent) {
    assert.equal(attentionAccentClassNames[level], `border-l-${level}-accent`);
    assert.ok(references.has(`${level}-accent`));
  }
});

test("the done -subtle variant is fully defined", () => {
  assert.equal(
    doneSubtleClassName,
    "bg-done-subtle-bg text-done-subtle-fg border-done-subtle-border",
  );
  for (const slot of ["subtle-bg", "subtle-fg", "subtle-border"]) {
    assert.ok(references.has(`done-${slot}`), `no utility for done-${slot}`);
  }
});

// ---------------------------------------------------------------------------
// The two Tailwind consumption paths must mint the same utility names
// ---------------------------------------------------------------------------

test("the preset carries the whole color map, not a narrowed pick", () => {
  assert.equal(qontinuiPreset.theme.extend.colors, tailwindColors);
});

const themeLayer = declarationsIn(themeCss, "@theme inline");

/** The `@theme` entries in one v4 namespace, keyed without the prefix. */
const namespace = (prefix) =>
  new Map(
    [...themeLayer]
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, value]) => [name.slice(prefix.length), value]),
  );

test("the v4 theme layer maps every utility the v3 map defines", () => {
  const mapped = namespace("--color-");
  for (const [utility, reference] of references) {
    assert.equal(
      mapped.get(utility),
      normalize(reference),
      `v4 theme layer is missing or wrong for --color-${utility}`,
    );
  }
  assert.equal(mapped.size, references.size, "v4 theme layer has extra colors");
});

test("the v4 theme layer carries the preset's non-color extensions too", () => {
  // Colors were never the only thing the preset mints, and the three families
  // below are where a v4-by-hand layer quietly diverges: `animate-pulse-glow`
  // does not exist at all without `--animate-*`, and `shadow-glow-primary`
  // resolves off `--color-glow-primary` as a shadow COLOUR — a real class name
  // emitting the wrong property, which is worse than a missing one.
  const { boxShadow, animation, keyframes } = qontinuiPreset.theme.extend;

  const shadows = namespace("--shadow-");
  for (const [name, value] of Object.entries(boxShadow)) {
    assert.equal(shadows.get(name), normalize(value), `--shadow-${name}`);
  }
  assert.equal(shadows.size, Object.keys(boxShadow).length);

  const animations = namespace("--animate-");
  for (const [name, value] of Object.entries(animation)) {
    assert.equal(animations.get(name), normalize(value), `--animate-${name}`);
  }
  assert.equal(animations.size, Object.keys(animation).length);

  // An `--animate-*` naming keyframes the layer does not define animates
  // nothing, silently.
  for (const name of Object.keys(keyframes)) {
    assert.match(themeCss, new RegExp(`@keyframes\\s+${name}\\s*\\{`));
  }
  for (const value of Object.values(animation)) {
    const named = value.split(/\s+/)[0];
    assert.ok(named in keyframes, `animation references unknown keyframes ${named}`);
  }
});

test("every preset theme.extend key reaches the v4 layer", () => {
  // The generator translates one v4 `@theme` namespace per key. A key it does
  // not know about is not an error anywhere in v3 — it just means v4 consumers
  // are missing utilities v3 consumers have, which is how this layer diverged
  // in the first place. tsup.config.ts throws on an unhandled key; this is the
  // same guard stated where a reader of the tests will see it.
  assert.deepEqual(Object.keys(qontinuiPreset.theme.extend).sort(), [
    "animation",
    "boxShadow",
    "colors",
    "keyframes",
  ]);
});

test("the v4 theme layer declares the preset's dark-mode strategy", () => {
  // v4 defaults `dark:` to `prefers-color-scheme`, while the preset — and
  // tokens.css's own `.dark` block — are class-based. Left unstated, toggling
  // the class re-themes the tokens and leaves every `dark:` utility behind.
  // The selector is v3's own, so both engines emit the same rule.
  //
  // Normalised rather than indexed: v3 accepts `"class"`, `["class"]` and
  // `["class", "<selector>"]`, and `darkMode[0]` reads the first of those as
  // the letter `"c"` while silently discarding the selector in the third.
  const [strategy, selector = ".dark"] = Array.isArray(qontinuiPreset.darkMode)
    ? qontinuiPreset.darkMode
    : [qontinuiPreset.darkMode];

  assert.ok(["class", "selector"].includes(strategy), `darkMode: ${strategy}`);
  assert.ok(
    themeCss.includes(`@custom-variant dark (&:is(${selector} *));`),
    `the generated variant does not key on the preset's ${selector}`,
  );
});

test("the v4 theme layer pulls in the custom properties it maps", () => {
  // `@theme inline` emits `var(--qontinui-*)` into every utility, so a v4 app
  // importing only the theme layer would otherwise resolve all of them to
  // nothing.
  assert.match(themeCss, /@import\s+"\.\/tokens\.css";/);
});

// ---------------------------------------------------------------------------
// The published surface
// ---------------------------------------------------------------------------

/** `./dist/index.js` -> the file it names, relative to the package root. */
const packageFile = (target) =>
  new URL(`../${target.replace(/^\.\//, "")}`, import.meta.url);

test("every declared export subpath resolves to a file that was built", () => {
  // `exports` is the only thing standing between a consumer and a bare
  // `ERR_MODULE_NOT_FOUND`, and every target here is produced by a DIFFERENT
  // mechanism — tsup entries, tsup's dts pass, the copy step and the generator
  // in onSuccess. Dropping any one of them leaves the map pointing at nothing,
  // and nothing else in this repo reads the map at all.
  const targets = new Set();
  const collect = (value) => {
    if (typeof value === "string") targets.add(value);
    else for (const nested of Object.values(value)) collect(nested);
  };
  collect(packageJson.exports);

  assert.ok(targets.size > 0, "package.json declares no exports");
  for (const target of targets) {
    assert.match(target, /^\.\/dist\//, `${target} is not published from dist/`);
    assert.ok(
      existsSync(packageFile(target)),
      `exports target does not exist after a build: ${target}`,
    );
  }
});

test("the entry points package.json advertises outside `exports` exist too", () => {
  // `main` / `module` / `types` are what older resolvers and editors read.
  for (const field of ["main", "module", "types"]) {
    const target = packageJson[field];
    assert.ok(target, `package.json has no ${field}`);
    assert.ok(
      existsSync(packageFile(target)),
      `${field} points at a file that does not exist: ${target}`,
    );
  }
});

test("`files` publishes everything `exports` points at", () => {
  // A target that exists locally but is not in the published tarball fails only
  // for the consumer, and only after a release.
  assert.deepEqual(packageJson.files, ["dist"]);
});
