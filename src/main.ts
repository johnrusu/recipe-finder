import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Styles
import "@/styles/main.css";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
