<template>
  <div
    class="items-center flex gap-4 flex-col h-full justify-center text-center"
  >
    <div>
      <NotLoggedUserAnimation />
      <p class="text-base sm:text-xl">
        {{ HOME_PAGE.DESCRIPTION }}
      </p>
      <p class="text-base sm:text-xl mt-2">
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
import { defineAsyncComponent } from "vue";
// constants
import { HOME_PAGE } from "@/constants";

// components
const NotLoggedUserAnimation = defineAsyncComponent(
  () => import("@/components/NotLoggedUserAnimation.vue")
);

const emit = defineEmits<{
  (e: "on-login"): void;
}>();
</script>
