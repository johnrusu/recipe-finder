<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import { useDisplay } from "vuetify";

// utils
import { isArrayNotEmpty } from "@/utils";

// constants
import { LABELS } from "@/constants";

// state
import { useAppStore } from "@/stores";

// composables
import { useUserAvatar } from "@/composables/useUserAvatar";

// types
import type { TUser } from "@/types";

// state
const appStore = useAppStore();
const isDisabled = computed(() => appStore.loading);

const props = defineProps<{
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
  <v-app-bar class="px-4">
    <template #prepend>
      <v-btn icon to="/" variant="plain" class="opacity-100">
        <img
          src="/favicons/favicon-32x32.png"
          width="32"
          height="32"
          alt="Home"
          loading="lazy"
        />
      </v-btn>
    </template>
    <v-container
      v-if="!xs && isArrayNotEmpty(routes as Array<any>)"
      class="flex justify-center gap-2 absolute left-1/2 transform -translate-x-1/2"
    >
      <v-btn
        v-for="(route, indexRoute) in routes"
        :key="`router-link-${indexRoute}`"
        :to="route.path"
        variant="text"
        :prepend-icon="route.icon"
        :class="{ 'router-link-active': $route.path === route.path }"
      >
        {{ route.name }}
      </v-btn>
    </v-container>

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
              :prepend-icon="route.icon"
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
    <template #append>
      <v-btn v-if="!isAuthenticated" @click="handleLogin" icon="mdi-login" />
      <v-menu v-else location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            v-if="!lg"
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
    </template>
  </v-app-bar>
</template>

<style scoped>
.router-link-active {
  color: var(--color-primary) !important;
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
