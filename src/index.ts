/**
 * @qontinui/design-tokens
 *
 * Shared design tokens for Qontinui applications.
 * Provides the color palette, motion and typography tokens, CSS variables,
 * and Tailwind configuration.
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
 * // Motion and typography (durations in ms, cubic-bezier control points,
 * // the reduced-motion contract, the type scale)
 * import { durations, easings, reducedMotion, typeScale } from '@qontinui/design-tokens';
 *
 * // Import CSS (in your CSS file)
 * // @import '@qontinui/design-tokens/css';
 */

export * from "./colors";
export * from "./motion";
export * from "./typography";
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
