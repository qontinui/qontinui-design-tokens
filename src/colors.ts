/**
 * Qontinui Design Tokens - Color Palette
 *
 * Professional palette optimized for dark interfaces.
 * These are the source of truth for all Qontinui applications.
 */

// =============================================================================
// Brand Colors
// =============================================================================

export const brand = {
  /** Slate Blue - Primary actions, links, focus states */
  primary: "#4A90D9",
  /** Muted Violet - Secondary actions, build mode */
  secondary: "#8B6BB5",
  /** Soft Teal - Success states, positive actions */
  success: "#4DB89D",
} as const;

// =============================================================================
// Surface Colors (Backgrounds)
// =============================================================================

export const surface = {
  /** Deep Gray - Main canvas background */
  canvas: "#111115",
  /** Card Gray - Elevated surfaces, cards, panels */
  raised: "#1E1E22",
  /** Hover state for interactive surfaces */
  hover: "#252529",
  /** Active/pressed state */
  active: "#2C2C32",
} as const;

// =============================================================================
// Border Colors
// =============================================================================

export const border = {
  /** Subtle borders - barely visible separation */
  subtle: "#2A2A30",
  /** Default borders - standard separation */
  default: "#3A3A42",
  /** Strong borders - emphasis, focus */
  strong: "#4A4A54",
  /** Interactive borders - hover states */
  interactive: "#5A5A66",
} as const;

// =============================================================================
// Text Colors
// =============================================================================

export const text = {
  /** Primary text - headings, important content */
  primary: "#FFFFFF",
  /** Secondary text - body content */
  secondary: "#B4B4B4",
  /** Muted text - labels, hints, disabled */
  muted: "#8A8A8A",
  /** Inverse text - on light backgrounds */
  inverse: "#111115",
} as const;

// =============================================================================
// Semantic Colors
// =============================================================================

export const semantic = {
  success: "#4DB89D",
  successMuted: "rgba(77, 184, 157, 0.15)",
  warning: "#E5A853",
  warningMuted: "rgba(229, 168, 83, 0.15)",
  error: "#E5534B",
  errorMuted: "rgba(229, 83, 75, 0.15)",
  info: "#4A90D9",
  infoMuted: "rgba(74, 144, 217, 0.15)",
} as const;

// =============================================================================
// Glow Effects (for subtle emphasis)
// =============================================================================

export const glow = {
  primary: "rgba(74, 144, 217, 0.2)",
  secondary: "rgba(139, 107, 181, 0.2)",
  success: "rgba(77, 184, 157, 0.2)",
} as const;

// =============================================================================
// Combined Export
// =============================================================================

export const colors = {
  brand,
  surface,
  border,
  text,
  semantic,
  glow,
} as const;

export type Colors = typeof colors;
export type BrandColors = typeof brand;
export type SurfaceColors = typeof surface;
export type BorderColors = typeof border;
export type TextColors = typeof text;
export type SemanticColors = typeof semantic;
export type GlowColors = typeof glow;
