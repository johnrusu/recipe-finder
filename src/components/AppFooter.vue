<template>
  <v-container class="footer-container" fluid>
    <div class="text-center text-subtitle-2 footer-content">
      <div>
        <span class="opacity-60"
          >&copy; {{ fullYear }} {{ developer }} - {{ APP.TITLE }}</span
        >
      </div>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { APP, ABOUT_PAGE } from "@/constants";
const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;
</script>
