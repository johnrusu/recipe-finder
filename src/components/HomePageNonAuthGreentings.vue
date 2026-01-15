<template>
  <v-row justify="center" class="text-center">
    <v-col
      cols="12"
      sm="10"
      md="8"
      lg="6"
      class="items-center flex gap-4 flex-col h-full justify-center px-4"
    >
      <img
        src="/favicons/apple-icon-120x120.png"
        alt="App Logo"
        class="mb-2 sm:mb-4"
        :width="$vuetify.display.xs ? 80 : 120"
        :height="$vuetify.display.xs ? 80 : 120"
      />
      <h1 class="hero-title text-h3 font-bold mb-2">{{ HOME_PAGE.TITLE }}</h1>
      <div class="px-4 sm:px-0 mb-4">
        <p class="text-body-1 sm:text-subtitle-1">
          {{ HOME_PAGE.DESCRIPTION }}
        </p>
        <p class="text-body-1 sm:text-subtitle-1 mt-2">
          {{ HOME_PAGE.AUTH_DESCRIPTION }}
        </p>
      </div>
      <div
        class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0"
      >
        <v-btn
          color="primary"
          size="large"
          @click="emit('on-login')"
          class="w-full sm:w-auto"
          prepend-icon="mdi-login"
        >
          {{ HOME_PAGE.BUTTON_LOGIN }}
        </v-btn>
        <v-btn
          variant="outlined"
          size="large"
          @click="emit('on-browse')"
          prepend-icon="mdi-open-in-app"
          class="w-full sm:w-auto"
        >
          {{ HOME_PAGE.BUTTON_GUEST }}
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { HOME_PAGE } from "@/constants";

const emit = defineEmits<{
  (e: "on-login"): void;
  (e: "on-browse"): void;
}>();
</script>
