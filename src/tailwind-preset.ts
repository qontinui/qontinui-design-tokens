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
      // Includes the attention layer (attention / waiting / running / testing /
      // landing / done / inert), so `bg-attention-bg`, `text-waiting-fg`,
      // `border-l-attention-accent` etc. are available to preset consumers with
      // no extra wiring. THE RULE: colour encodes WHO MUST ACT, not how
      // alarming the word sounds — see colors.ts. Keep this spread whole; a
      // narrowed pick here would silently half-define the layer, exactly as an
      // edit to only one of tokens.css's two blocks would.
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
