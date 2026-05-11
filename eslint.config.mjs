import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // React Hooks
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Prettier — disable conflicting rules, report formatting issues
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "warn",
    },
  },

  // Custom rules — add yours here
  {
    rules: {
      // "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  // Ignored paths
  {
    ignores: [
      ".next/",
      "node_modules/",
      "cypress/",
      "scripts/",
      "*.config.ts",
      "*.config.js",
      "*.config.mjs",
    ],
  },
);
