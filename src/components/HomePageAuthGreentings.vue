<template>
  <div class="items-center flex flex-col h-full justify-center text-center">
    <LogoAnimated class="w-64 h-64 sm:w-72 sm:h-72 md:w-60 md:h-60" />
    <h1 class="hero-title text-h3 font-bold mb-4">{{ HOME_PAGE.TITLE }}</h1>
    <div>
      <p class="text-body-1 sm:text-subtitle-1">
        {{ HOME_PAGE.DESCRIPTION }}
      </p>
      <p class="text-body-1 sm:text-subtitle-1 mt-2">
        {{ HOME_PAGE.AUTH_BENEFITS }}
      </p>
    </div>
    <div class="flex flex-col sm:flex-row w-full sm:w-auto px-4 sm:px-0 mt-6">
      <v-btn
        variant="outlined"
        size="large"
        @click="emit('on-start-journey')"
        class="gemini-live-border"
      >
        <span class="text-wrap">{{ HOME_PAGE.START_YOUR_JOURNEY }}</span>
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
  (e: "on-start-journey"): void;
}>();
</script>
