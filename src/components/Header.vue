<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { useDisplay } from "vuetify";

// utils
import { isNilOrEmpty, loadAsyncImage } from "@/utils";

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
}>();
const { xs } = useDisplay();
const user: ComputedRef<TUser | undefined> = computed(() => props.user);
const imageSrc: Ref<string> = ref(PLACEHOLDER_IMAGE);

onMounted(() => {
  if (!isNilOrEmpty(user.value?.picture)) {
    const picture = user.value?.picture as string;
    loadAsyncImage(picture).then((validImage) => {
      imageSrc.value =
        !isNilOrEmpty(picture) && validImage
          ? (validImage?.src as string)
          : PLACEHOLDER_IMAGE;
    });
  }
});

const handleLogout = () => {
  emit("onLogout");
};
</script>
<template>
  <v-app-bar v-if="!isNilOrEmpty(user)" elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
        <router-link
          to="/"
          class="text-white no-underline cursor-pointer"
          :disabled="isDisabled"
        >
          <img
            src="/favicons/favicon-32x32.png"
            :alt="APP.TITLE"
            width="32"
            height="32"
            loading="lazy"
          />
        </router-link>
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ APP.TITLE }}</v-app-bar-title>
      <div class="flex gap-2 ml-2" v-if="!xs">
        <router-link
          v-for="(route, indexRoute) in routes"
          :key="`router-link-${indexRoute}`"
          :to="route.path"
          component="v-btn"
          variant="text"
          :icon="route.icon"
          :disabled="isDisabled"
        ></router-link>
      </div>
      <v-btn v-if="xs">
        <v-icon>mdi-dots-vertical</v-icon>
        <v-menu class="hidden-md-and-up" activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <router-link
                  v-for="(route, indexRoute) in routes"
                  :key="`router-link-mobile-${indexRoute}`"
                  :to="route.path"
                  class="text-decoration-none"
                >
                  {{ route.name }}
                </router-link>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>

    <template #append>
      <v-menu location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            prepend-icon="mdi-account-circle"
            :disabled="isDisabled"
          >
            {{ user?.name || user?.email || LABELS.ACCOUNT }}
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
