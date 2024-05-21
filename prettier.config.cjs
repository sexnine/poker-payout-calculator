module.exports = {
  useTabs: false,
  singleQuote: false,
  semi: true,
  endOfLine: "crlf",
  bracketSameLine: false,
  trailingComma: "all",
  printWidth: 100,
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
