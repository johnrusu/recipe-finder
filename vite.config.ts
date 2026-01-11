import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";

const appMetadata = {
  title: "Receipe Finder",
  author: "Rusu Ionut",
  description:
    "A user-friendly recipe finder application that helps you discover delicious recipes based on the ingredients you have at home. Built with Vue.js, Vite, Vuetify, Pinia, and Tailwind CSS.",
  keywords:
    "recipe, finder, cooking, ingredients, vue, vite, vuetify, pinia, tailwindcss",
};

// https://vite.dev/config/
export default defineConfig({
  base: "/recipe-finder/",
  plugins: [
    vue(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: appMetadata,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
