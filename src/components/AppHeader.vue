<script setup lang="ts">
// vue
import { computed, type ComputedRef, defineAsyncComponent } from "vue";

// vuetify
import { useDisplay } from "vuetify";

// utils
import { isArrayNotEmpty } from "@/utils";

// constants
import { LABELS, APP } from "@/constants";

// state
import { useAppStore } from "@/stores";

// composables
import { useUserAvatar } from "@/composables/useUserAvatar";

// components
const LogoAnimated = defineAsyncComponent(() => import("./LogoAnimated.vue"));

// types
import type { TUser } from "@/types";

// state
const appStore = useAppStore();
const isDisabled = computed(() => appStore.loading);

const props = defineProps<{
  isScrolled?: boolean;
  user?: TUser;
  routes?: Array<{ name: string; path: string; icon?: string }>;
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  (e: "on-logout"): void;
  (e: "on-login"): void;
}>();

// hooks
const { xs, lg } = useDisplay();

// computed
const user: ComputedRef<TUser | undefined> = computed(() => props.user);

// composables
const { imageSrc } = useUserAvatar(user);

const handleLogout = () => {
  emit("on-logout");
};

const handleLogin = () => {
  emit("on-login");
};
</script>
<template>
  <div class="app-header" :class="{ scrolled: props.isScrolled }">
    <router-link to="/" class="flex items-center justify-center gap-4">
      <LogoAnimated class="w-12 h-12" />
      <span class="text-uppercase font-bold sm:block hidden">{{
        APP.TITLE
      }}</span>
    </router-link>
    <div
      v-if="!xs && isArrayNotEmpty(routes as Array<any>)"
      class="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2 h-full"
    >
      <router-link
        v-for="(route, indexRoute) in routes"
        :key="`router-link-${indexRoute}`"
        :to="route.path"
        :class="`flex justify-center items-center h-full px-4! relative min-w-20 text-xl font-bold ${$route.path === route.path ? 'nav-active' : ''}`"
      >
        {{ route.name }}
      </router-link>
    </div>
    <template v-if="xs && isArrayNotEmpty(routes as Array<any>)">
      <!-- Mobile menu -->
      <div>
        <v-btn icon="mdi-menu" variant="text" />
        <v-menu activator="parent" location="bottom start">
          <v-list class="pa-2" min-width="200">
            <v-list-item
              v-for="(route, indexRoute) in routes"
              :key="`router-link-mobile-${indexRoute}`"
              :to="route.path"
              rounded="lg"
              class="mb-1"
              :class="{ 'router-link-active': $route.path === route.path }"
            >
              <v-list-item-title>
                {{ route.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
    <div class="header-user-settings">
      <v-btn
        v-if="!isAuthenticated"
        variant="text"
        @click="handleLogin"
        icon="mdi-login"
      />
      <v-menu v-else location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            v-if="!lg"
            variant="text"
            icon="mdi-account-circle"
            :disabled="isDisabled"
          >
          </v-btn>
          <v-btn v-bind="props" v-else :disabled="isDisabled">
            <v-icon start>mdi-account-circle</v-icon>
            <span class="text-truncate d-inline-block user-name-text">{{
              user?.name || user?.email
            }}</span>
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-card-text>
            <router-link to="/dashboard">
              <span class="justify-end w-auto h-auto flex">
                <v-btn icon="mdi-cog-outline" variant="text" />
              </span>
            </router-link>
            <div class="flex flex-col gap-4 items-center text-center">
              <v-avatar size="64" :image="imageSrc" />
              <div>
                <p class="font-semibold">
                  {{ user?.name }}
                </p>
                <p class="text-small">
                  {{ user?.email }}
                </p>
              </div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn
              block
              variant="text"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              {{ LABELS.LOGOUT }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0) 0px 8px 24px;
  display: flex;
  height: 80px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 24px;
}

.app-header.scrolled {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}

.nav-active {
  font-weight: bold;
}
.nav-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--color-primary);
}

.user-name-text {
  max-width: 100px;
}

@media (min-width: 960px) {
  .user-name-text {
    max-width: 150px;
  }
}
</style>
