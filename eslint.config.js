import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // 브라우저 코드
  {
    files: [
      "api/**/*.js",
      "component/**/*.js",
      "js/**/*.js",
      "utils/**/*.js",
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Node.js 서버 코드
  {
    files: ["app.js"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // 사용하지 않는 변수는 우선 warning 처리
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
]);