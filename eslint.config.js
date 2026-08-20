import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // The token tests are plain ESM run by `node --test`; they read dist/ and
    // print through the Node globals, which this flat config does not otherwise
    // declare.
    files: ["test/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", "*.config.js"],
  },
];
