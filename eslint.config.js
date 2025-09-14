import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Enforce standardized Tabs styling by preventing per-usage overrides on TabsTrigger
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXOpeningElement[name.name='TabsTrigger'] JSXAttribute[name.name='className']",
          message: "Do not set className on TabsTrigger; use the shared Tabs styles (tokens).",
        }
      ]
    },
  }
);
