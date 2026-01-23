/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from "vue";
import router from "../router";
import pinia from "../stores";
import { createAuth0 } from "@auth0/auth0-vue";

// Plugins
import vuetify from "./vuetify";

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(
      createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: `${window.location.origin}${import.meta.env.BASE_URL}`,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email offline_access",
        },
        cacheLocation: "localstorage",
        useRefreshTokens: true,
      })
    );
}
