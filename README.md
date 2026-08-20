# @qontinui/design-tokens

Shared design tokens for Qontinui applications. Provides a consistent color palette across qontinui-web and qontinui-runner.

## Installation

### Production (from npm)

```bash
npm install @qontinui/design-tokens
```

### Local Development

```bash
# From the design-tokens directory
cd qontinui-design-tokens
npm install
npm run build

# Link to consuming projects
npm link

# From qontinui-web/frontend
cd ../qontinui-web/frontend
npm link @qontinui/design-tokens

# From qontinui-runner
cd ../qontinui-runner
npm link @qontinui/design-tokens
```

## Usage

### CSS Custom Properties

Import the CSS file to get all tokens as CSS custom properties:

```css
/* In your CSS file */
@import "@qontinui/design-tokens/css";

/* Then use the variables */
.my-element {
  background: var(--qontinui-surface-raised);
  color: var(--qontinui-text-primary);
  border-color: var(--qontinui-border-default);
}
```

### Tailwind CSS v3 (qontinui-runner)

```js
// tailwind.config.js
import { tailwindColors } from "@qontinui/design-tokens/tailwind";

export default {
  theme: {
    extend: {
      colors: {
        ...tailwindColors,
      },
    },
  },
};
```

Then in your CSS, import the tokens:

```css
@import "@qontinui/design-tokens/css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind CSS v4 (qontinui-web)

```css
/* globals.css */
@import "tailwindcss";
@import "@qontinui/design-tokens/css";

@theme inline {
  --color-brand-primary: var(--qontinui-brand-primary);
  --color-brand-secondary: var(--qontinui-brand-secondary);
  --color-brand-success: var(--qontinui-brand-success);
  --color-surface-canvas: var(--qontinui-surface-canvas);
  --color-surface-raised: var(--qontinui-surface-raised);

  /* Attention layer — a CSS custom property alone mints NO utility in v4;
     it must be mapped here before `bg-attention-bg` etc. exist. */
  --color-attention-bg: var(--qontinui-attention-bg);
  --color-attention-fg: var(--qontinui-attention-fg);
  --color-attention-border: var(--qontinui-attention-border);
  --color-attention-accent: var(--qontinui-attention-accent);
  /* ... and the same for waiting / running / testing / landing / done / inert */

  /* ... map other tokens as needed */
}
```

### TypeScript/JavaScript

```ts
import { colors, brand, surface, border, text } from "@qontinui/design-tokens";

// Access individual tokens
console.log(brand.primary); // "#4A90D9"
console.log(surface.canvas); // "#111115"
```

## Color Palette

### Brand Colors

| Token             | Value     | Usage                                |
| ----------------- | --------- | ------------------------------------ |
| `brand-primary`   | `#4A90D9` | Primary actions, links, focus states |
| `brand-secondary` | `#8B6BB5` | Secondary actions, build mode        |
| `brand-success`   | `#4DB89D` | Success states, positive actions     |

### Surface Colors

| Token            | Value     | Usage                            |
| ---------------- | --------- | -------------------------------- |
| `surface-canvas` | `#111115` | Main background                  |
| `surface-raised` | `#1E1E22` | Cards, panels, elevated surfaces |
| `surface-hover`  | `#252529` | Hover state                      |
| `surface-active` | `#2C2C32` | Active/pressed state             |

### Border Colors

| Token                | Value     | Usage             |
| -------------------- | --------- | ----------------- |
| `border-subtle`      | `#2A2A30` | Subtle separation |
| `border-default`     | `#3A3A42` | Standard borders  |
| `border-strong`      | `#4A4A54` | Emphasis, focus   |
| `border-interactive` | `#5A5A66` | Hover states      |

### Text Colors

| Token            | Value     | Usage                       |
| ---------------- | --------- | --------------------------- |
| `text-primary`   | `#FFFFFF` | Headings, important content |
| `text-secondary` | `#B4B4B4` | Body content                |
| `text-muted`     | `#8A8A8A` | Labels, hints, disabled     |

### Semantic Colors

| Token     | Value     | Usage          |
| --------- | --------- | -------------- |
| `success` | `#4DB89D` | Success states |
| `warning` | `#E5A853` | Warning states |
| `error`   | `#E5534B` | Error states   |
| `info`    | `#4A90D9` | Info states    |

### Attention Colors

**The rule: colour encodes WHO MUST ACT, not how alarming the word sounds.**

Semantic colors above answer _"what kind of thing is this?"_. The attention
layer answers a different and, on an operator console, more important question:
_"does someone have to do something about this row, right now?"_

Getting this backwards is the bug the layer exists to prevent. A red badge on
"CI hasn't finished yet" trains the eye to ignore red — and then a genuinely
failed check, the one state that needs a human push, sits in calm amber right
next to it. So red is reserved for `attention`, amber for `waiting`, and every
other in-flight state gets a hue that carries no urgency at all.

| Level       | Means                                                | Hue    |
| ----------- | ---------------------------------------------------- | ------ |
| `attention` | Someone must act now                                 | red    |
| `waiting`   | Waiting on something else; it will clear itself       | amber  |
| `running`   | Work in flight, nobody is blocked                    | yellow |
| `testing`   | In motion — rebasing, re-running, verifying          | purple |
| `landing`   | In motion, on its way to done                        | blue   |
| `done`      | Finished                                             | green  |
| `inert`     | Nothing is happening and nothing is wrong            | muted  |

Each level is a `-bg` / `-fg` / `-border` triple, so one level dresses a whole
badge, chip or row. `attention` and `waiting` add an `-accent` for the
left-edge row rule (the only two levels that earn one — the accent _is_ the
"you must act" / "you are waiting" signal). `done` adds a quieter
`-subtle-*` triple for "ready, not yet finished".

| Token                    | Value                                 | Tailwind equivalent |
| ------------------------ | ------------------------------------- | ------------------- |
| `attention-bg`           | `oklch(63.7% 0.237 25.331 / 0.15)`    | `bg-red-500/15`     |
| `attention-fg`           | `oklch(88.5% 0.062 18.334)`           | `text-red-200`      |
| `attention-border`       | `oklch(63.7% 0.237 25.331 / 0.35)`    | `border-red-500/35` |
| `attention-accent`       | `oklch(63.7% 0.237 25.331 / 0.8)`     | `border-l-red-500/80` |
| `waiting-bg`             | `oklch(76.9% 0.188 70.08 / 0.15)`     | `bg-amber-500/15`   |
| `waiting-fg`             | `oklch(92.4% 0.12 95.746)`            | `text-amber-200`    |
| `waiting-border`         | `oklch(76.9% 0.188 70.08 / 0.3)`      | `border-amber-500/30` |
| `waiting-accent`         | `oklch(76.9% 0.188 70.08 / 0.8)`      | `border-l-amber-500/80` |
| `running-bg`             | `oklch(79.5% 0.184 86.047 / 0.15)`    | `bg-yellow-500/15`  |
| `running-fg`             | `oklch(94.5% 0.129 101.54)`           | `text-yellow-200`   |
| `running-border`         | `oklch(79.5% 0.184 86.047 / 0.3)`     | `border-yellow-500/30` |
| `testing-bg`             | `oklch(62.7% 0.265 303.9 / 0.15)`     | `bg-purple-500/15`  |
| `testing-fg`             | `oklch(90.2% 0.063 306.703)`          | `text-purple-200`   |
| `testing-border`         | `oklch(62.7% 0.265 303.9 / 0.3)`      | `border-purple-500/30` |
| `landing-bg`             | `oklch(62.3% 0.214 259.815 / 0.15)`   | `bg-blue-500/15`    |
| `landing-fg`             | `oklch(88.2% 0.059 254.128)`          | `text-blue-200`     |
| `landing-border`         | `oklch(62.3% 0.214 259.815 / 0.3)`    | `border-blue-500/30` |
| `done-bg`                | `oklch(72.3% 0.219 149.579 / 0.15)`   | `bg-green-500/15`   |
| `done-fg`                | `oklch(92.5% 0.084 155.995)`          | `text-green-200`    |
| `done-border`            | `oklch(72.3% 0.219 149.579 / 0.3)`    | `border-green-500/30` |
| `done-subtle-bg`         | `oklch(72.3% 0.219 149.579 / 0.05)`   | `bg-green-500/5`    |
| `done-subtle-fg`         | `oklch(87.1% 0.15 154.449)`           | `text-green-300`    |
| `done-subtle-border`     | `oklch(72.3% 0.219 149.579 / 0.25)`   | `border-green-500/25` |
| `inert-bg`               | `#2C2C32`                             | `bg-muted`          |
| `inert-fg`               | `#8A8A8A`                             | `text-muted-foreground` |
| `inert-border`           | `#2A2A30`                             | `border-border`     |

**Why oklch and not hex.** These values are carried over verbatim from the
Tailwind v4 palette the surfaces already render, so adopting the tokens is a
_provable visual no-op_. Tailwind v4 compiles `bg-red-500/15` to
`color-mix(in oklab, var(--color-red-500) 15%, transparent)`; because
`transparent` contributes nothing under premultiplied interpolation, that is
exactly `--color-red-500` at alpha `0.15`. Several of these colors are outside
the sRGB gamut, so a hex would not round-trip and the swap would no longer be a
no-op. The `inert` values are hex because they are the existing Qontinui
`surface-active` / `text-muted` / `border-subtle` values, which is what
`bg-muted` / `text-muted-foreground` / `border-border` already resolve to.

Usage — CSS, Tailwind v3 (via the preset or `tailwindColors`), and TypeScript:

```css
.row-badge {
  background: var(--qontinui-waiting-bg);
  color: var(--qontinui-waiting-fg);
  border-color: var(--qontinui-waiting-border);
}
```

```jsx
<span className="bg-attention-bg text-attention-fg border-attention-border" />
<div className="border-l-2 border-l-attention-accent" />
```

```ts
import { attentionPalette } from "@qontinui/design-tokens";

attentionPalette.attention.bg; // "oklch(63.7% 0.237 25.331 / 0.15)"
```

In Tailwind v4 (qontinui-web) the custom properties must additionally be mapped
inside `@theme inline` before any `bg-attention-*` utility exists — see the
Tailwind CSS v4 section above.

## Development Workflow

### Making Changes to Tokens

1. Edit the source files in `src/`
2. Build: `npm run build`
3. Test locally with linked projects
4. Publish: `npm run release`

### Publishing a New Version

```bash
# Bump version
npm version patch  # or minor, major

# Build and publish
npm run release
```

### Updating Consuming Projects

After publishing a new version:

```bash
# In qontinui-web/frontend
npm update @qontinui/design-tokens

# In qontinui-runner
npm update @qontinui/design-tokens
```

## File Structure

```
qontinui-design-tokens/
├── src/
│   ├── colors.ts         # Color primitives as TypeScript constants
│   ├── tokens.css        # CSS custom properties
│   ├── tailwind.ts       # Tailwind color configuration
│   ├── tailwind-preset.ts # Full Tailwind preset
│   └── index.ts          # Main exports
├── dist/                  # Built output (published to npm)
├── package.json
└── README.md
```

## Exports

| Export                                    | Description                  |
| ----------------------------------------- | ---------------------------- |
| `@qontinui/design-tokens`                 | Main entry - color constants |
| `@qontinui/design-tokens/css`             | CSS custom properties        |
| `@qontinui/design-tokens/tailwind`        | Tailwind color config        |
| `@qontinui/design-tokens/tailwind-preset` | Full Tailwind preset         |

## License

Licensed under the GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later). See [LICENSE](LICENSE) for full terms.
