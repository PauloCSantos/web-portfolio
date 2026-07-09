import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

const deepSliceImportPatterns = [
  {
    group: [
      "@widgets/*/ui/**",
      "@widgets/*/model/**",
      "@widgets/*/lib/**",
      "@widgets/*/i18n/**",
      "@features/*/ui/**",
      "@features/*/model/**",
      "@features/*/lib/**",
      "@features/*/i18n/**",
      "@entities/*/ui/**",
      "@entities/*/model/**",
      "@entities/*/lib/**",
      "@entities/*/i18n/**",
    ],
    message: "Import another slice through its public index.ts barrel.",
  },
];

const restrictedImports = (...groups) => [
  "error",
  {
    patterns: [...deepSliceImportPatterns, ...groups],
  },
];

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-restricted-imports": restrictedImports(),
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports({
        group: ["@entities/**", "@features/**", "@widgets/**", "@pages/**", "@app/**"],
        message: "shared must not depend on higher layers.",
      }),
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports({
        group: ["@features/**", "@widgets/**", "@pages/**", "@app/**"],
        message: "entities may depend only on shared and local code.",
      }),
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports({
        group: ["@widgets/**", "@pages/**", "@app/**"],
        message: "features may depend only on entities, shared, and local code.",
      }),
    },
  },
  {
    files: ["src/widgets/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports({
        group: ["@pages/**", "@app/**"],
        message: "widgets must not depend on pages or app.",
      }),
    },
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports({
        group: ["@app/**"],
        message: "pages must not depend on app.",
      }),
    },
  },
]);
