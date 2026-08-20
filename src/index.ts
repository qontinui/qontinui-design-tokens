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
 * // Apply the attention layer (WHO MUST ACT) without hand-writing utilities
 * import { attentionClassNames } from '@qontinui/design-tokens';
 * <span className={attentionClassNames[level]} />
 *
 * // Import CSS (in your CSS file)
 * // @import '@qontinui/design-tokens/css';
 */

export * from "./colors";
export {
  tailwindColors,
  staticColors,
  attentionClassNames,
  attentionAccentClassNames,
  doneSubtleClassName,
} from "./tailwind";
export type {
  TailwindColors,
  AttentionClassNames,
  AttentionAccentLevel,
} from "./tailwind";
export { qontinuiPreset } from "./tailwind-preset";
