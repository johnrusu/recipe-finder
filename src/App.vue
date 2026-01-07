<template>
  <v-app>
    <div class="flex items-center justify-center h-full" v-if="error">
      <div class="text-center max-w-md p-6">
        <div class="text-3xl font-bold mb-2">
          {{ LABELS.ERROR_TITLE }}
        </div>
        <div class="text-lg mb-2">
          {{ LABELS.ERROR_MESSAGE }}
        </div>
        <div class="text-sm">{{ error?.message }}</div>
        <v-alert
          icon="mdi-information-outline"
          :title="LABELS.FIX_AUTH_ISSUE"
          :text="`${LABELS.REMOVE_STORAGE}
                  ${LABELS.RELOGIN}`"
          type="info"
          class="text-left mt-4"
        ></v-alert>
      </div>
    </div>
    <v-main class="flex" v-else>
      <AppHeader
        :user="user"
        @logout="handleLogout"
        @onLogin="handleLogin"
        :routes="menuRoutes"
      />
      <v-container
        fluid
        class="flex flex-col flex-1 h-full wrapper-v-container"
      >
        <Loading v-if="isLoading" :config="LOADING_CONFIG" />
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// constants
import { ROUTES, LOADING_CONFIG, LABELS } from "@/constants";

const { isLoading, user, error, logout, loginWithRedirect } = useAuth0();

// components
const AppHeader = defineAsyncComponent(() => import("@/components/Header.vue"));
const Loading = defineAsyncComponent(() => import("@/components/Loading.vue"));

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
