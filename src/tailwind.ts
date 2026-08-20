/**
 * Qontinui Design Tokens - Tailwind Color Configuration
 *
 * Use this to extend your Tailwind config with Qontinui colors.
 *
 * Usage (Tailwind v3):
 *   const { tailwindColors } = require('@qontinui/design-tokens/tailwind');
 *   module.exports = {
 *     theme: {
 *       extend: {
 *         colors: tailwindColors,
 *       },
 *     },
 *   };
 *
 * Usage (Tailwind v4):
 *   Import the CSS tokens directly in your CSS file.
 */

import {
  brand,
  surface,
  border,
  text,
  semantic,
  attentionPalette,
  glow,
} from "./colors";
import type { AttentionLevel } from "./colors";

/**
 * Tailwind-compatible color configuration
 * Uses CSS custom properties for runtime theming support
 */
export const tailwindColors = {
  // Brand colors
  brand: {
    primary: "var(--qontinui-brand-primary)",
    secondary: "var(--qontinui-brand-secondary)",
    success: "var(--qontinui-brand-success)",
  },

  // Surface colors
  surface: {
    canvas: "var(--qontinui-surface-canvas)",
    raised: "var(--qontinui-surface-raised)",
    hover: "var(--qontinui-surface-hover)",
    active: "var(--qontinui-surface-active)",
  },

  // Background aliases (shared workflow-ui components use bg-bg-*)
  bg: {
    primary: "var(--qontinui-surface-canvas)",
    secondary: "var(--qontinui-surface-raised)",
    tertiary: "var(--qontinui-surface-hover)",
  },

  // Border colors (using 'border-' prefix causes conflicts, use 'border-ds')
  "border-ds": {
    subtle: "var(--qontinui-border-subtle)",
    default: "var(--qontinui-border-default)",
    strong: "var(--qontinui-border-strong)",
    interactive: "var(--qontinui-border-interactive)",
  },

  // Text colors
  text: {
    primary: "var(--qontinui-text-primary)",
    secondary: "var(--qontinui-text-secondary)",
    muted: "var(--qontinui-text-muted)",
    inverse: "var(--qontinui-text-inverse)",
  },

  // Semantic colors
  success: "var(--qontinui-success)",
  "success-muted": "var(--qontinui-success-muted)",
  warning: "var(--qontinui-warning)",
  "warning-muted": "var(--qontinui-warning-muted)",
  error: "var(--qontinui-error)",
  "error-muted": "var(--qontinui-error-muted)",
  info: "var(--qontinui-info)",
  "info-muted": "var(--qontinui-info-muted)",

  // Attention colors — colour encodes WHO MUST ACT, not how alarming the word
  // sounds. Yields bg-attention-bg / text-attention-fg / border-attention-border
  // (and the same shape for waiting / running / testing / landing / done /
  // inert). See colors.ts for the rule and the Tailwind-literal derivation.
  attention: {
    bg: "var(--qontinui-attention-bg)",
    fg: "var(--qontinui-attention-fg)",
    border: "var(--qontinui-attention-border)",
    accent: "var(--qontinui-attention-accent)",
  },
  waiting: {
    bg: "var(--qontinui-waiting-bg)",
    fg: "var(--qontinui-waiting-fg)",
    border: "var(--qontinui-waiting-border)",
    accent: "var(--qontinui-waiting-accent)",
  },
  running: {
    bg: "var(--qontinui-running-bg)",
    fg: "var(--qontinui-running-fg)",
    border: "var(--qontinui-running-border)",
  },
  testing: {
    bg: "var(--qontinui-testing-bg)",
    fg: "var(--qontinui-testing-fg)",
    border: "var(--qontinui-testing-border)",
  },
  landing: {
    bg: "var(--qontinui-landing-bg)",
    fg: "var(--qontinui-landing-fg)",
    border: "var(--qontinui-landing-border)",
  },
  done: {
    bg: "var(--qontinui-done-bg)",
    fg: "var(--qontinui-done-fg)",
    border: "var(--qontinui-done-border)",
    "subtle-bg": "var(--qontinui-done-subtle-bg)",
    "subtle-fg": "var(--qontinui-done-subtle-fg)",
    "subtle-border": "var(--qontinui-done-subtle-border)",
  },
  inert: {
    bg: "var(--qontinui-inert-bg)",
    fg: "var(--qontinui-inert-fg)",
    border: "var(--qontinui-inert-border)",
  },

  // Glow colors (for box-shadow utilities)
  glow: {
    primary: "var(--qontinui-glow-primary)",
    secondary: "var(--qontinui-glow-secondary)",
    success: "var(--qontinui-glow-success)",
  },
} as const;

/**
 * Static color values (for tools that don't support CSS variables)
 * Use tailwindColors for better theming support.
 */
export const staticColors = {
  brand,
  surface,
  border,
  text,
  semantic,
  attention: attentionPalette,
  glow,
} as const;

export type TailwindColors = typeof tailwindColors;

// =============================================================================
// Attention class names
//
// The utility names the attention layer mints, pre-composed into the triple a
// badge, chip or row actually applies. Exported because the alternative is what
// the layer was built to end: every consuming surface hand-writing
// `bg-red-500/15 text-red-200 border-red-500/35` and getting the WHO-MUST-ACT
// mapping subtly wrong (see colors.ts for the rule).
//
// These names are identical under Tailwind v3 (via `tailwindColors` or the
// preset) and v4 (via the generated `@qontinui/design-tokens/theme`) — that
// parity is the reason a component can be shared between qontinui-web and
// qontinui-runner at all, and the token test asserts it.
//
// Spelled out as whole literals rather than built from `attentionLevels`,
// because Tailwind generates a utility only when it finds the complete class
// string in a scanned file. A name assembled at runtime — `bg-${level}-bg` —
// appears nowhere in the shipped output, so the CSS would never be emitted and
// the badge would render unstyled. For the same reason a consumer has to scan
// this package; see the README.
//
// The `Record<AttentionLevel, ...>` annotation is what keeps the list honest:
// adding a level to the palette without adding it here is a compile error.
// =============================================================================

/** `bg-*`/`text-*`/`border-*` triple for each level. */
export const attentionClassNames: Record<AttentionLevel, string> = {
  attention: "bg-attention-bg text-attention-fg border-attention-border",
  waiting: "bg-waiting-bg text-waiting-fg border-waiting-border",
  running: "bg-running-bg text-running-fg border-running-border",
  testing: "bg-testing-bg text-testing-fg border-testing-border",
  landing: "bg-landing-bg text-landing-fg border-landing-border",
  done: "bg-done-bg text-done-fg border-done-border",
  inert: "bg-inert-bg text-inert-fg border-inert-border",
};

/**
 * Left-edge row accent, for the two levels that carry one. A row accent is a
 * whole-record claim ("this line is the one you must look at"), so only
 * `attention` and `waiting` define it — a third would dilute the signal.
 */
export const attentionAccentClassNames = {
  attention: "border-l-attention-accent",
  waiting: "border-l-waiting-accent",
} as const satisfies Partial<Record<AttentionLevel, string>>;

/** The quieter "ready, not yet merged" variant of `done`. */
export const doneSubtleClassName =
  "bg-done-subtle-bg text-done-subtle-fg border-done-subtle-border";

export type AttentionClassNames = typeof attentionClassNames;
export type AttentionAccentLevel = keyof typeof attentionAccentClassNames;
