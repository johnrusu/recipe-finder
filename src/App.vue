<template>
  <v-app class="flex main-app-container">
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
        v-if="isAuthenticated || skipWelcome"
        :isScrolled="isScrolled"
      />
      <v-main
        class="flex! justify-between flex-col"
        :class="isAuthenticated || skipWelcome ? 'pt-20!' : ''"
      >
        <div class="flex-1">
          <router-view />
        </div>
        <AppFooter class="flex-0" />
      </v-main>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  computed,
  watch,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
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

// ref
const isScrolled = ref(false);

// computed
const menuRoutes = computed(() => ROUTES.filter((route) => route.isForMenu));
const skipWelcome = computed(() => appState.skipWelcome);

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

const handleScroll = () => {
  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  isScrolled.value = scrollTop > 0;
};

onMounted(() => {
  const body = document.body;
  body.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  const body = document.body;
  body.removeEventListener("scroll", handleScroll);
});
</script>
