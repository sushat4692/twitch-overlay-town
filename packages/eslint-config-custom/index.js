module.exports = {
  extends: [
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  rules: {
    "react/jsx-key": "off",
  },
};
