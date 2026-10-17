/**
 * Qontinui Design Tokens - Motion: durations, easings, reduced-motion contract.
 * tokens.css restates every value (--qontinui-duration-*, --qontinui-ease-*);
 * test/motion-typography.test.js holds the two together.
 */

/** Durations in milliseconds. `instant` is a step, not a transition. */
export const durations = {
  instant: 0,
  fast: 150,
  base: 300,
  slow: 600,
  deliberate: 900,
} as const;

/**
 * Easings as CSS `cubic-bezier(x1, y1, x2, y2)` control points, so CSS and
 * frame-driven code (which solves the curve itself) use the same numbers.
 * Material 3: standard; emphasized decelerate (enter); emphasized accelerate (exit).
 */
export const easings = {
  linear: [0, 0, 1, 1],
  standard: [0.2, 0, 0, 1],
  enter: [0.05, 0.7, 0.1, 1],
  exit: [0.3, 0, 0.8, 0.15],
} as const satisfies Record<string, CubicBezier>;

/**
 * Reduced-motion contract (`prefers-reduced-motion: reduce`): durations are
 * `instant` in frame code and 0.01ms in CSS (so `transitionend` still fires);
 * an embed never autoplays, shows its poster frame with a play control.
 */
export const reducedMotion = {
  mediaQuery: "(prefers-reduced-motion: reduce)",
  duration: durations.instant,
  cssDuration: "0.01ms",
  autoplay: false,
  showPosterFrame: true,
  playControl: true,
} as const;

export type DurationName = keyof typeof durations;
export type EasingName = keyof typeof easings;
export type CubicBezier = readonly [number, number, number, number];

/** `cubic-bezier(...)` strings, the CSS form of `easings`. */
export const cssEasings = Object.fromEntries(
  Object.entries(easings).map(([name, [x1, y1, x2, y2]]) => [
    name,
    `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
  ]),
) as Record<EasingName, string>;

/** Every motion token, by group. */
export const motion = {
  durations,
  easings,
  cssEasings,
  reducedMotion,
} as const;
