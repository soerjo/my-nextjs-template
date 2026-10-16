import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Rules ported from the legacy `.eslintrc.json` (flat-config equivalent).
// Rules already supplied by core-web-vitals + typescript are omitted:
// - react/prop-types, react/react-in-jsx-scope, no-unused-vars (already "off")
// Superseded rules are dropped:
// - prettier/prettier (Prettier now runs via lint-staged, not as a lint rule)
// - unused-imports/* (@typescript-eslint/no-unused-vars covers unused imports;
//   the `unused-imports` plugin is not installed)
//
// Chatty, purely stylistic rules from the legacy config are intentionally OFF.
// They produced ~240 auto-fixable warnings (import/order, jsx-sort-props,
// padding-line-between-statements) with no correctness value, so we keep only
// meaningful correctness/a11y rules instead.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: "custom/legacy-rules",
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      "no-console": "warn",
      "react/jsx-uses-react": "off",
      "react-hooks/exhaustive-deps": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "import/order": "off",
      "react/self-closing-comp": "off",
      "react/jsx-sort-props": "off",
      "padding-line-between-statements": "off",
    },
  },
  {
    name: "custom/legacy-rules-typescript",
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
        },
      ],
    },
  },
  {
    name: "custom/ss-blocks-img",
    files: ["src/components/shadcn-studio/blocks/**/*.{ts,tsx}"],
    rules: {
      // ss-blocks ship external dynamic images with arbitrary URLs
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Migrated from the removed legacy .eslintignore (unsupported by ESLint 9):
    ".now/**",
    "**/*.css",
    ".changeset/**",
    "dist/**",
    "esm/**",
    "public/**",
    "tests/**",
    "scripts/**",
    "coverage/**",
    ".DS_Store",
  ]),
]);

export default eslintConfig;
