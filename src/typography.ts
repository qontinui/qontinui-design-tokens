/**
 * Qontinui Design Tokens - Typography (families, the type scale, weights,
 * line heights, letter spacing).
 *
 * `tokens.css` states every value again as a `--qontinui-font-*`,
 * `--qontinui-line-height-*` or `--qontinui-letter-spacing-*` property;
 * test/motion-typography.test.js holds the two together.
 */

/**
 * Font families. Inter is the face the studio renders every scene with. Each
 * stack ends in a generic family. Nothing here loads a font: a consumer that
 * wants Inter must serve it. A consumer that bundles its own copy under its
 * own `@font-face` name (the studio registers "Studio Inter", so text
 * rasterises the same on every machine) keeps that name in its own stack.
 */
export const fontFamilies = {
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

/**
 * The reference short edge the type scale is drawn at, in pixels. A 1920x1080
 * or 1080x1920 frame renders the scale as written.
 */
export const typeScaleReference = 1080;

/**
 * The type scale, by role, in reference pixels (see `typeScaleReference`).
 * Multiply by a unit to size it for a surface: a scene uses
 * `shortEdge / typeScaleReference`; in CSS, set `--qontinui-type-unit`, which
 * every `--qontinui-font-size-*` multiplies.
 */
export const typeScale = {
  caption: 22,
  label: 24,
  body: 28,
  title: 44,
  counter: 56,
  display: 64,
} as const;

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
} as const;

/** Unitless line heights, tightest first. */
export const lineHeights = {
  none: 1,
  tight: 1.1,
  snug: 1.15,
  normal: 1.25,
  relaxed: 1.3,
  loose: 1.35,
} as const;

/** Tracking for uppercase labels and figures. */
export const letterSpacings = {
  normal: "0em",
  wide: "0.04em",
  wider: "0.08em",
  widest: "0.12em",
} as const;

export type FontFamilyName = keyof typeof fontFamilies;
export type TypeScaleRole = keyof typeof typeScale;
export type FontWeightName = keyof typeof fontWeights;
export type LineHeightName = keyof typeof lineHeights;
export type LetterSpacingName = keyof typeof letterSpacings;

/** Every typography token, by group. */
export const typography = {
  fontFamilies,
  typeScaleReference,
  typeScale,
  fontWeights,
  lineHeights,
  letterSpacings,
} as const;
