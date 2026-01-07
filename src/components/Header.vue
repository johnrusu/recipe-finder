<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { useDisplay } from "vuetify";
import { pathOr } from "ramda";

// utils
import { isNilOrEmpty, loadAsyncImage, isArrayNotEmpty } from "@/utils";

// constants
import { APP, LABELS, PLACEHOLDER_IMAGE } from "@/constants";

// state
import { useAppStore } from "@/stores";

// types
import type { TUser } from "@/types";

// state
const appStore = useAppStore();
const isDisabled = computed(() => appStore.loading);

const props = defineProps<{
  user?: TUser;
  routes?: Array<{ name: string; path: string; [key: string]: any }>;
}>();

const emit = defineEmits<{
  (e: "onLogout"): void;
  (e: "onLogin"): void;
}>();

// hooks
const { xs } = useDisplay();

// computed
const user: ComputedRef<TUser | undefined> = computed(() => props.user);

// ref
const imageSrc: Ref<string> = ref(PLACEHOLDER_IMAGE);

onMounted(() => {
  if (!isNilOrEmpty(user)) {
    const picture: string = pathOr("", ["value"], user);
    if (!isNilOrEmpty(picture)) {
      loadAsyncImage(picture).then((validImage) => {
        imageSrc.value =
          !isNilOrEmpty(picture) && validImage
            ? (validImage?.src as string)
            : PLACEHOLDER_IMAGE;
      });
    }
  }
});

const handleLogout = () => {
  emit("onLogout");
};

const handleLogin = () => {
  emit("onLogin");
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
      <span class="text-lg font-semibold ml-3">{{ APP.TITLE }}</span>
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
      <v-btn icon="mdi-menu" variant="text"></v-btn>
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
    <template #append v-if="isNilOrEmpty(user)">
      <v-btn
        v-if="isNilOrEmpty(user)"
        @click="handleLogin"
        prepend-icon="mdi-login"
        >{{ LABELS.LOGIN }}</v-btn
      >
      <v-menu location="bottom" v-else>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-account-circle"
            :disabled="isDisabled"
          >
            {{ user?.name || user?.email }}
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-card-text>
            <div class="flex flex-col gap-4 items-center text-center">
              <v-avatar size="64" :image="imageSrc"></v-avatar>
              <div>
                <p class="font-semibold">{{ user?.name }}</p>
                <p class="text-small">{{ user?.email }}</p>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

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
