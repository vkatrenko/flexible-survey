import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"), // ✅ Стандартні Next.js + TS правила
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      "simple-import-sort": require("eslint-plugin-simple-import-sort"),
      react: require("eslint-plugin-react")
    },
    rules: {
      "prettier/prettier": "error", // ✅ Примусовий Prettier через ESLint
      "simple-import-sort/imports": "warn", // ✅ Автоматичне сортування імпортів
      "simple-import-sort/exports": "warn", // ✅ Автоматичне сортування експорту
      "react/jsx-sort-props": ["warn", { "ignoreCase": true }] // ✅ Автосортування пропсів у JSX
    }
  }
];
