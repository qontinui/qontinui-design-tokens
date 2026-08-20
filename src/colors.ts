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
// Attention Colors
//
// THE RULE: colour encodes WHO MUST ACT, not how alarming the word sounds.
//
//   attention (red)    someone must act now
//   waiting   (amber)  waiting on something else; it will clear itself
//   running   (yellow) work in flight, nobody is blocked
//   testing   (purple) in motion (rebasing, re-running, verifying)
//   landing   (blue)   in motion, on its way to done
//   done      (green)  finished
//   inert     (muted)  nothing is happening and nothing is wrong
//
// Getting this backwards is the bug the layer exists to prevent: a red badge
// on "CI hasn't finished" trains the eye to ignore red, while a failed check —
// the one state that genuinely needs a push — sits in amber beside it.
//
// Values are carried over VERBATIM from the Tailwind v4 palette literals these
// tokens replace, so adopting them is a rendered no-op. Tailwind v4 compiles
// `bg-red-500/15` to `color-mix(in oklab, var(--color-red-500) 15%,
// transparent)`; `transparent` contributes nothing under premultiplied
// interpolation, so that is exactly red-500 at alpha 0.15. Hence oklch with an
// alpha channel rather than a lossy sRGB hex — several of these are outside
// the sRGB gamut and a hex would NOT round-trip.
// =============================================================================

export const attentionPalette = {
  /** Someone must act now. Tailwind: red-500/15, red-200, red-500/35, red-500/80. */
  attention: {
    bg: "oklch(63.7% 0.237 25.331 / 0.15)",
    fg: "oklch(88.5% 0.062 18.334)",
    border: "oklch(63.7% 0.237 25.331 / 0.35)",
    /** Left-edge row accent. */
    accent: "oklch(63.7% 0.237 25.331 / 0.8)",
  },
  /** Waiting on something else; it will clear itself. Tailwind: amber-500/15, amber-200, amber-500/30, amber-500/80. */
  waiting: {
    bg: "oklch(76.9% 0.188 70.08 / 0.15)",
    fg: "oklch(92.4% 0.12 95.746)",
    border: "oklch(76.9% 0.188 70.08 / 0.3)",
    /** Left-edge row accent. */
    accent: "oklch(76.9% 0.188 70.08 / 0.8)",
  },
  /** Work in flight, nobody is blocked. Tailwind: yellow-500/15, yellow-200, yellow-500/30. */
  running: {
    bg: "oklch(79.5% 0.184 86.047 / 0.15)",
    fg: "oklch(94.5% 0.129 101.54)",
    border: "oklch(79.5% 0.184 86.047 / 0.3)",
  },
  /** In motion — rebasing, re-running, verifying. Tailwind: purple-500/15, purple-200, purple-500/30. */
  testing: {
    bg: "oklch(62.7% 0.265 303.9 / 0.15)",
    fg: "oklch(90.2% 0.063 306.703)",
    border: "oklch(62.7% 0.265 303.9 / 0.3)",
  },
  /** In motion, on its way to done. Tailwind: blue-500/15, blue-200, blue-500/30. */
  landing: {
    bg: "oklch(62.3% 0.214 259.815 / 0.15)",
    fg: "oklch(88.2% 0.059 254.128)",
    border: "oklch(62.3% 0.214 259.815 / 0.3)",
  },
  /**
   * Finished. Tailwind: green-500/15, green-200, green-500/30.
   * `subtle*` is the quieter "ready, not yet merged" variant:
   * green-500/5, green-300, green-500/25.
   */
  done: {
    bg: "oklch(72.3% 0.219 149.579 / 0.15)",
    fg: "oklch(92.5% 0.084 155.995)",
    border: "oklch(72.3% 0.219 149.579 / 0.3)",
    subtleBg: "oklch(72.3% 0.219 149.579 / 0.05)",
    subtleFg: "oklch(87.1% 0.15 154.449)",
    subtleBorder: "oklch(72.3% 0.219 149.579 / 0.25)",
  },
  /**
   * Nothing is happening and nothing is wrong. These are the values
   * qontinui-web's `bg-muted` / `text-muted-foreground` / `border-border`
   * already resolve to — i.e. surface.active / text.muted / border.subtle.
   */
  inert: {
    bg: "#2C2C32",
    fg: "#8A8A8A",
    border: "#2A2A30",
  },
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
  attention: attentionPalette,
  glow,
} as const;

export type Colors = typeof colors;
export type BrandColors = typeof brand;
export type SurfaceColors = typeof surface;
export type BorderColors = typeof border;
export type TextColors = typeof text;
export type SemanticColors = typeof semantic;
export type AttentionPalette = typeof attentionPalette;
export type AttentionLevel = keyof AttentionPalette;
export type GlowColors = typeof glow;
