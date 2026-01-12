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
        :routes="menuRoutes"
        @on-logout="handleLogout"
        @on-login="handleLogin"
      />
      <v-main>
        <v-container fluid class="p-0! h-[calc(100%-56px)]">
          <router-view />
        </v-container>
        <AppFooter />
      </v-main>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// constants
import { ROUTES, LOADING_CONFIG } from "@/constants";

const { isLoading, user, error, logout, loginWithRedirect } = useAuth0();

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
