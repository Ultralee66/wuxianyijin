const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");

const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
});

const eslintConfig = [
  {
    ignores: [".next/", "node_modules/"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = eslintConfig;
