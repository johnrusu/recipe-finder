<template>
  <v-app>
    <div v-if="error" class="flex items-center justify-center h-full">
      <div class="text-center max-w-md p-6">
        <div class="text-3xl font-bold mb-2">
          {{ LABELS.ERROR_TITLE }}
        </div>
        <div class="text-lg mb-2">
          {{ LABELS.ERROR_MESSAGE }}
        </div>
        <div class="text-sm">
          {{ error?.message }}
        </div>
        <v-alert
          icon="mdi-information-outline"
          :title="LABELS.FIX_AUTH_ISSUE"
          :text="`${LABELS.REMOVE_STORAGE}
                  ${LABELS.RELOGIN}`"
          type="info"
          class="text-left mt-4"
        />
      </div>
    </div>
    <v-main v-else class="flex">
      <AppHeader
        :user="user"
        :routes="menuRoutes"
        @on-logout="handleLogout"
        @on-login="handleLogin"
      />
      <v-container fluid class="h-full">
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
const AppHeader = defineAsyncComponent(
  () => import("@/components/AppHeader.vue")
);
const Loading = defineAsyncComponent(
  () => import("@/components/AppLoading.vue")
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
