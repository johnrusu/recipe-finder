import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import typescript from "@vue/eslint-config-typescript";
import prettier from "@vue/eslint-config-prettier";
import vitest from "@vitest/eslint-plugin";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/coverage/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  ...typescript(),
  prettier,
  {
    name: "app/test-setup",
    files: ["**/*.spec.ts", "**/*.test.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  {
    name: "app/custom-rules",
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
    },
  },
];
