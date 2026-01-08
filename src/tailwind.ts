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

import { brand, surface, border, text, semantic, glow } from "./colors";

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
  glow,
} as const;

export type TailwindColors = typeof tailwindColors;
