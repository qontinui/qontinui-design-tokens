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
