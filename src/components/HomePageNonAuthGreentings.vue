<template>
  <div
    class="items-center flex gap-4 flex-col h-full justify-center text-center"
  >
    <img
      src="/favicons/apple-icon-120x120.png"
      alt="App Logo"
      class="mb-2 sm:mb-4"
      :width="$vuetify.display.xs ? 80 : 120"
      :height="$vuetify.display.xs ? 80 : 120"
    />
    <h1 class="hero-title text-h3 font-bold mb-2">{{ HOME_PAGE.TITLE }}</h1>
    <div>
      <p class="text-body-1 sm:text-subtitle-1">
        {{ HOME_PAGE.DESCRIPTION }}
      </p>
      <p class="text-body-1 sm:text-subtitle-1 mt-2">
        {{ HOME_PAGE.AUTH_DESCRIPTION }}
      </p>
    </div>
    <div class="flex flex-col gap-4 px-4 w-full sm:w-auto mt-6">
      <v-btn
        @click="emit('on-login')"
        class="w-full gemini-live-border"
        prepend-icon="mdi-login"
        size="large"
        variant="outlined"
      >
        <span class="text-wrap"> {{ HOME_PAGE.BUTTON_LOGIN }}</span>
      </v-btn>
      <v-btn
        variant="plain"
        class="w-full"
        size="large"
        @click="emit('on-browse')"
      >
        <span class="text-wrap"> {{ HOME_PAGE.BUTTON_GUEST }}</span>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import { HOME_PAGE } from "@/constants";

const emit = defineEmits<{
  (e: "on-login"): void;
  (e: "on-browse"): void;
}>();
</script>
