import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tailwind: "src/tailwind.ts",
    "tailwind-preset": "src/tailwind-preset.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Copy CSS to dist
  onSuccess: async () => {
    const fs = await import("fs");
    const path = await import("path");
    const src = path.join(process.cwd(), "src", "tokens.css");
    const dest = path.join(process.cwd(), "dist", "tokens.css");
    fs.copyFileSync(src, dest);
  },
});
