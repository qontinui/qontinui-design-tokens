/**
 * @qontinui/design-tokens
 *
 * Shared design tokens for Qontinui applications.
 * Provides color palette, CSS variables, and Tailwind configuration.
 *
 * @example
 * // Import color constants
 * import { colors, brand, surface } from '@qontinui/design-tokens';
 *
 * // Import Tailwind config
 * import { tailwindColors } from '@qontinui/design-tokens/tailwind';
 *
 * // Import CSS (in your CSS file)
 * // @import '@qontinui/design-tokens/css';
 */

export * from "./colors";
export { tailwindColors, staticColors } from "./tailwind";
export { qontinuiPreset } from "./tailwind-preset";
