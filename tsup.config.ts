import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tailwind: "src/tailwind.ts",
    "tailwind-preset": "src/tailwind-preset.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  onSuccess: async () => {
    const fs = await import("fs");
    const path = await import("path");
    const { pathToFileURL } = await import("url");

    const dist = path.join(process.cwd(), "dist");

    // Copy CSS to dist
    fs.copyFileSync(
      path.join(process.cwd(), "src", "tokens.css"),
      path.join(dist, "tokens.css"),
    );

    // Generate the Tailwind v4 `@theme` layer from the v3 PRESET.
    //
    // A CSS custom property alone mints NO utility in v4 — it has to be mapped
    // under `@theme` first. That mapping is 50-odd mechanical lines, and a
    // hand-written copy is exactly where a half-adopted layer comes from: map
    // four of the seven attention levels and `bg-testing-bg` silently produces
    // nothing at all. So it is DERIVED, which makes v3/v4 utility-name parity
    // structural rather than a thing to remember. `inline` keeps each utility
    // pointing at `var(--qontinui-*)`, so `.dark` still re-themes at runtime.
    //
    // It is derived from the whole `qontinuiPreset`, not from `tailwindColors`
    // alone, because colors were never the only thing the preset mints. The
    // first version of this generator read `tailwindColors`, and the three
    // non-color families it therefore skipped did not fail loudly — they failed
    // in the way this package exists to prevent, one class name at a time:
    //
    //   - `animate-pulse-glow` simply did not exist under v4.
    //   - `shadow-glow-primary` existed under BOTH and painted something
    //     different in each. v3 painted the box-shadow; v4, seeing only a
    //     `--color-glow-*` entry, read the same class as a shadow COLOUR
    //     (`--tw-shadow-color: ...`) and painted nothing at all. A shared
    //     component glowed in qontinui-runner and rendered flat in
    //     qontinui-web, with no error on either side.
    //   - `darkMode: ["class"]` had no v4 counterpart at all, so `dark:`
    //     utilities followed the OS setting under v4 while `tokens.css`'s own
    //     `.dark` block followed the class. Toggling the class re-themed the
    //     tokens and left every `dark:` utility behind.
    //
    // `test/tailwind-parity.test.js` now compiles both engines and asserts they
    // agree, so a fourth family cannot repeat this quietly. `expectKeys` below
    // is the same guard at build time: adding a key anywhere in the preset
    // fails the build until the v4 side knows how to translate it.
    const { qontinuiPreset } = await import(
      pathToFileURL(path.join(dist, "tailwind-preset.js")).href
    );

    // Every key the generator knows how to translate, checked in BOTH
    // directions and at all three levels of the preset. An unknown key means v3
    // consumers get utilities v4 consumers silently do not — the failure this
    // whole file exists to prevent — and a MISSING key would otherwise surface
    // as a bare `Object.entries(undefined)` TypeError further down.
    const expectKeys = (label: string, actual: object, expected: string[]) => {
      const found = Object.keys(actual).sort();
      const wanted = [...expected].sort();
      if (found.join() !== wanted.join()) {
        throw new Error(
          `tsup.config.ts cannot translate ${label} to a Tailwind v4 @theme ` +
            `layer: expected exactly [${wanted.join(", ")}], found ` +
            `[${found.join(", ")}]. Teach the generator the new key, or v3 ` +
            `consumers get utilities v4 consumers silently do not.`,
        );
      }
    };

    expectKeys("the preset", qontinuiPreset, ["darkMode", "theme"]);
    expectKeys("preset.theme", qontinuiPreset.theme, ["extend"]);

    const extend = qontinuiPreset.theme.extend as Record<string, unknown>;
    expectKeys("preset.theme.extend", extend, [
      "colors",
      "boxShadow",
      "animation",
      "keyframes",
    ]);

    /** `boxShadow` -> `box-shadow`, for keyframe declaration properties. */
    const kebab = (key: string) =>
      key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

    // One blank-line-separated section per group; a run of flat entries (the
    // semantic colors) shares a section.
    const sections: string[][] = [];
    let flat: string[] | null = null;
    for (const [group, value] of Object.entries(
      extend.colors as Record<string, unknown>,
    )) {
      if (typeof value === "string") {
        if (!flat) sections.push((flat = []));
        flat.push(`  --color-${group}: ${value};`);
        continue;
      }
      flat = null;
      sections.push(
        Object.entries(value as Record<string, string>).map(
          ([name, v]) => `  --color-${group}-${name}: ${v};`,
        ),
      );
    }

    // `shadow-glow-primary` — the box-shadow itself, so the class means under
    // v4 what it means under v3. Without this entry v4 still mints the name off
    // `--color-glow-primary`, as a shadow colour; see the note above.
    //
    // Note the name is claimed TWICE on purpose: `glow` is in `colors` as well,
    // so each engine reaches the shadow through its own chain of private
    // variables. They land on the same paint today, and the parity test
    // resolves both chains rather than trusting that they still do.
    sections.push(
      Object.entries(extend.boxShadow as Record<string, string>).map(
        ([name, value]) => `  --shadow-${name}: ${value};`,
      ),
    );

    // `animate-pulse-glow`, plus the keyframes it names. v4 emits a `@keyframes`
    // block declared inside `@theme` only when a utility references it, which is
    // why the two belong in the same generated layer.
    sections.push(
      Object.entries(extend.animation as Record<string, string>).map(
        ([name, value]) => `  --animate-${name}: ${value};`,
      ),
    );

    for (const [name, steps] of Object.entries(
      extend.keyframes as Record<string, Record<string, Record<string, string>>>,
    )) {
      const block = [`  @keyframes ${name} {`];
      for (const [offset, declarations] of Object.entries(steps)) {
        block.push(`    ${offset} {`);
        for (const [property, value] of Object.entries(declarations)) {
          block.push(`      ${kebab(property)}: ${value};`);
        }
        block.push("    }");
      }
      block.push("  }");
      sections.push(block);
    }

    // The v4 counterpart of the preset's `darkMode: ["class"]`. v4 defaults
    // `dark:` to `prefers-color-scheme`, so without this a component shared
    // between the two apps reads the class in one and the OS setting in the
    // other. The selector is v3's own — `.dark\:x:is(.dark *)` — so the two
    // engines emit the same rule, not merely a similar one.
    //
    // v3 spells this THREE ways and all of them are legal: `"class"`,
    // `["class"]`, and `["class", "<selector>"]` for a class other than
    // `.dark`. Reading `darkMode[0]` handles exactly one of them — it indexes
    // the bare string to `"c"` and rejects it, and it accepts the two-element
    // form while ignoring the selector it carries, which would generate a v4
    // variant keyed on `.dark` while v3 keyed on something else.
    const darkMode = qontinuiPreset.darkMode as string | readonly string[];
    const [strategy, darkSelector = ".dark"] = Array.isArray(darkMode)
      ? darkMode
      : [darkMode];
    // `selector` is v3.4's rename of `class`; both mean the same thing.
    if (strategy !== "class" && strategy !== "selector") {
      throw new Error(
        `preset darkMode is ${JSON.stringify(darkMode)}; the generated ` +
          `@custom-variant below only matches the "class" strategy.`,
      );
    }

    const header = [
      "/**",
      " * Qontinui Design Tokens - Tailwind v4 theme layer",
      " *",
      " * GENERATED by tsup.config.ts from `qontinuiPreset` (src/tailwind-preset.ts)",
      " * — do not edit. The utility names here, and what each one emits, are the",
      " * same as under the v3 preset; test/tailwind-parity.test.js compiles both",
      " * engines and asserts it.",
      " *",
      ' * Usage (Tailwind v4), AFTER `@import "tailwindcss"`:',
      " *   @import '@qontinui/design-tokens/theme';",
      " *",
      " * It pulls in tokens.css itself, so it is the only import a v4 app needs.",
      " */",
      '@import "./tokens.css";',
      "",
      "/* The preset's `darkMode: [\"class\"]`, in v4 form. Override it by declaring",
      "   your own `@custom-variant dark` after this import. */",
      `@custom-variant dark (&:is(${darkSelector} *));`,
      "",
      "@theme inline {",
    ].join("\n");

    const body = sections.map((lines) => lines.join("\n")).join("\n\n");
    fs.writeFileSync(path.join(dist, "theme.css"), header + "\n" + body + "\n}\n");
  },
});
