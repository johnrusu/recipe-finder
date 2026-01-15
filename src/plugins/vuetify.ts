/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Styles
import "@mdi/font/css/materialdesignicons.css";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          primary: "#ff6b35",
          secondary: "#f7931e",
          accent: "#fdc830",
        },
      },
      light: {
        colors: {
          primary: "#ff6b35",
          secondary: "#f7931e",
          accent: "#fdc830",
        },
      },
    },
  },
});
