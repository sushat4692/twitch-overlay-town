module.exports = {
  extends: [
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/jsx-key": "off",
  },
};
