import { createApp } from "vue";

// utils
import { checkEnvVariables, isNilOrEmpty } from "./utils";

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Styles
import "@/styles/main.css";

const statusEnvVariables = checkEnvVariables([
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_API_RECIPE_KEY",
]);
if (!statusEnvVariables) {
  const app = document.querySelector("#app");
  if (!isNilOrEmpty(app) && app instanceof HTMLElement)
    app.innerHTML =
      "<h1 style='color:red;'>Missing required environment variables. Please check the configuration.</h1>";
  throw new Error("Missing required environment variables");
}

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
