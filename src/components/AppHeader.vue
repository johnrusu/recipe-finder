<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import { useDisplay } from "vuetify";

// utils
import { isNilOrEmpty, isArrayNotEmpty } from "@/utils";

// constants
import { APP, LABELS } from "@/constants";

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
}>();

const emit = defineEmits<{
  (e: "on-logout"): void;
  (e: "on-login"): void;
}>();

// hooks
const { xs } = useDisplay();

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
      <router-link to="/">
        <img
          src="/favicons/favicon-32x32.png"
          :alt="APP.TITLE"
          width="32"
          height="32"
          loading="lazy"
        />
      </router-link>
      <span class="text-lg font-semibold ml-3" data-test="header-app-title">{{
        APP.TITLE
      }}</span>
    </template>
    <v-container
      v-if="!xs && isArrayNotEmpty(routes as Array<any>)"
      class="flex justify-center gap-2"
    >
      <v-btn
        v-for="(route, indexRoute) in routes"
        :key="`router-link-${indexRoute}`"
        :to="route.path"
        variant="text"
        :prepend-icon="route.icon"
      >
        {{ route.name }}
      </v-btn>
    </v-container>

    <template v-if="xs && isArrayNotEmpty(routes as Array<any>)">
      <!-- Mobile menu -->
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
          >
            <v-list-item-title>
              {{ route.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template #append>
      <v-btn
        v-if="isNilOrEmpty(user)"
        prepend-icon="mdi-login"
        @click="handleLogin"
      >
        {{ LABELS.LOGIN }}
      </v-btn>
      <v-menu v-else location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            :disabled="isDisabled"
            prepend-icon="mdi-account-circle"
          >
            {{ user?.name || user?.email }}
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
