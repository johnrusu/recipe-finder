import { createApp } from "vue";

// utils
import { checkEnvVariables, isNilOrEmpty } from "./utils";

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Styles
import "@/styles/main.css";

// constants
import { LABELS } from "@/constants";

const statusEnvVariables = checkEnvVariables([
  "VITE_AUTH0_DOMAIN",
  "VITE_AUTH0_CLIENT_ID",
  "VITE_AUTH0_AUDIENCE",
  "VITE_API_BASE_URL",
]);
if (!statusEnvVariables) {
  const app = document.querySelector("#app");
  if (!isNilOrEmpty(app) && app instanceof HTMLElement)
    app.innerHTML = `<h1 style='color:red;'>${LABELS.MISSING_ENV_VARS}</h1>`;
  throw new Error(LABELS.MISSSING_ENV_VARS_ERROR);
}

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
