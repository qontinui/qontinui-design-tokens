/**
 * Qontinui Design Tokens - Tailwind Preset
 *
 * A complete Tailwind preset with Qontinui colors and custom utilities.
 *
 * Usage (Tailwind v3):
 *   const qontinuiPreset = require('@qontinui/design-tokens/tailwind-preset');
 *   module.exports = {
 *     presets: [qontinuiPreset],
 *     // your config...
 *   };
 */

import { tailwindColors } from "./tailwind";

/**
 * Tailwind preset for Qontinui applications
 */
export const qontinuiPreset = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: tailwindColors,
      boxShadow: {
        "glow-primary": "0 0 12px var(--qontinui-glow-primary)",
        "glow-secondary": "0 0 12px var(--qontinui-glow-secondary)",
        "glow-success": "0 0 12px var(--qontinui-glow-success)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 12px var(--qontinui-glow-primary)",
          },
          "50%": {
            boxShadow: "0 0 20px var(--qontinui-glow-primary)",
          },
        },
      },
    },
  },
} as const;

export default qontinuiPreset;
