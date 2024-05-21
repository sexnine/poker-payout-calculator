module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["svelte", "@typescript-eslint", "prettier"],
  // ignorePatterns: [],
  overrides: [
    {
      files: ["*.mjs", "*.cjs", "*.mts", "*.cts"],
      parser: "@typescript-eslint/parser",
    },
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {},
      {
        usePrettierrc: true,
      },
    ],
  },
};
