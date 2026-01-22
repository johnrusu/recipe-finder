<template>
  <div
    class="items-center flex gap-4 flex-col h-full justify-center text-center"
  >
    <LogoAnimated class="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80" />
    <h1 class="hero-title text-h3 font-bold mb-2" data-test="hero-title">
      {{ HOME_PAGE.TITLE }}
    </h1>
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
import { defineAsyncComponent } from "vue";
// constants
import { HOME_PAGE } from "@/constants";

// components
const LogoAnimated = defineAsyncComponent(() => import("./LogoAnimated.vue"));

const emit = defineEmits<{
  (e: "on-login"): void;
  (e: "on-browse"): void;
}>();
</script>
