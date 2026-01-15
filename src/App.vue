<template>
  <v-app class="flex">
    <v-container
      v-if="isLoading"
      class="justify-center flex h-full items-center"
    >
      <AppLoading :config="LOADING_CONFIG" />
    </v-container>
    <AppError :error="error" v-else-if="error" />
    <template v-else>
      <AppHeader
        :user="user"
        :isAuthenticated="isAuthenticated"
        :routes="menuRoutes"
        @on-logout="handleLogout"
        @on-login="handleLogin"
      />
      <v-main>
        <v-container fluid class="h-[calc(100%-56px)] px-0! pb-0!">
          <router-view />
        </v-container>
        <AppFooter />
      </v-main>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// state
import { useAppStore } from "@/stores";

// state
const appState = useAppStore();

// utils
import { isNilOrEmpty } from "./utils";

// constants
import { ROUTES, LOADING_CONFIG } from "@/constants";

const { isLoading, user, error, logout, loginWithRedirect, isAuthenticated } =
  useAuth0();

// components
const AppHeader = defineAsyncComponent(
  () => import("@/components/AppHeader.vue")
);
const AppLoading = defineAsyncComponent(
  () => import("@/components/AppLoading.vue")
);

const AppFooter = defineAsyncComponent(
  () => import("@/components/AppFooter.vue")
);

const AppError = defineAsyncComponent(
  () => import("@/components/AppError.vue")
);

// computed
const menuRoutes = computed(() => ROUTES.filter((route) => route.isForMenu));

// watch
watch([isLoading, error, user], () => {
  appState.setLoading(isLoading.value || false);
  appState.setError(error.value || null);
  if (!isNilOrEmpty(user.value) && user.value !== undefined) {
    appState.setUser(user.value);
  } else {
    appState.setUser(null);
  }
});

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
    },
  });
};

const handleLogin = () => {
  loginWithRedirect();
};
</script>
