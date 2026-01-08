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
@import '@qontinui/design-tokens/css';

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
import { tailwindColors } from '@qontinui/design-tokens/tailwind';

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
@import '@qontinui/design-tokens/css';

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
  /* ... map other tokens as needed */
}
```

### TypeScript/JavaScript

```ts
import { colors, brand, surface, border, text } from '@qontinui/design-tokens';

// Access individual tokens
console.log(brand.primary); // "#4A90D9"
console.log(surface.canvas); // "#111115"
```

## Color Palette

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#4A90D9` | Primary actions, links, focus states |
| `brand-secondary` | `#8B6BB5` | Secondary actions, build mode |
| `brand-success` | `#4DB89D` | Success states, positive actions |

### Surface Colors
| Token | Value | Usage |
|-------|-------|-------|
| `surface-canvas` | `#111115` | Main background |
| `surface-raised` | `#1E1E22` | Cards, panels, elevated surfaces |
| `surface-hover` | `#252529` | Hover state |
| `surface-active` | `#2C2C32` | Active/pressed state |

### Border Colors
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `#2A2A30` | Subtle separation |
| `border-default` | `#3A3A42` | Standard borders |
| `border-strong` | `#4A4A54` | Emphasis, focus |
| `border-interactive` | `#5A5A66` | Hover states |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#FFFFFF` | Headings, important content |
| `text-secondary` | `#B4B4B4` | Body content |
| `text-muted` | `#8A8A8A` | Labels, hints, disabled |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#4DB89D` | Success states |
| `warning` | `#E5A853` | Warning states |
| `error` | `#E5534B` | Error states |
| `info` | `#4A90D9` | Info states |

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

| Export | Description |
|--------|-------------|
| `@qontinui/design-tokens` | Main entry - color constants |
| `@qontinui/design-tokens/css` | CSS custom properties |
| `@qontinui/design-tokens/tailwind` | Tailwind color config |
| `@qontinui/design-tokens/tailwind-preset` | Full Tailwind preset |

## License

MIT
