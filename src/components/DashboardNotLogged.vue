<template>
  <div
    class="items-center flex gap-4 flex-col h-full justify-center text-center"
  >
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
    </div>
  </div>
</template>
<script setup lang="ts">
// constants
import { HOME_PAGE } from "@/constants";

const emit = defineEmits<{
  (e: "on-login"): void;
}>();
</script>
