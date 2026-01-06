<template>
  <v-app>
    <v-main class="flex">
      <AppHeader
        :user="user"
        @logout="handleLogout"
        v-if="isAuthenticated && user"
      />
      <v-container
        fluid
        class="flex flex-col flex-1 h-full wrapper-v-container"
      >
        <div
          class="w-50 flex items-center justify-center mx-auto h-full"
          v-if="isLoading"
        >
          <Loading :config="LOADING_CONFIG" />
        </div>

        <div class="flex items-center justify-center h-full" v-else-if="error">
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

        <div
          v-else-if="!isAuthenticated"
          class="flex items-center justify-center h-full"
        >
          <v-card class="pa-10 w-full max-w-4xl">
            <v-card-text class="text-center p-0!">
              <v-avatar size="120">
                <v-img src="/favicons/apple-icon.png" alt="App Icon" />
              </v-avatar>
              <v-card-title class="text-h4 font-weight-bold px-0">
                {{ LABELS.WELCOME_TITLE }}
              </v-card-title>
              <v-card-subtitle class="text-h6 mb-6 px-0">
                {{ APP.DESCRIPTION }}
              </v-card-subtitle>
            </v-card-text>
            <v-card-actions class="justify-center p-0!">
              <v-btn
                @click="handleLogin"
                color="primary"
                size="large"
                prepend-icon="mdi-login"
                variant="elevated"
              >
                {{ LABELS.BUTTON_LOGIN_TITLE }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <router-view v-else />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// constants
import { APP, LABELS } from "@/constants";

const { isAuthenticated, isLoading, error, user, logout, loginWithRedirect } =
  useAuth0();

// components
const AppHeader = defineAsyncComponent(() => import("@/components/Header.vue"));
const Loading = defineAsyncComponent(() => import("@/components/Loading.vue"));

// loading config
const LOADING_CONFIG = {
  items: [
    { color: "blue", delay: 0 },
    { color: "green", delay: -0.9 },
    { color: "orange", delay: -0.8 },
    { color: "red", delay: -0.7 },
    { color: "purple", delay: -0.6 },
  ],
};

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
