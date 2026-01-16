<template>
  <v-container class="footer-container" fluid>
    <div class="text-center text-subtitle-2 footer-content">
      <span class="opacity-60">&copy; {{ fullYear }} {{ developer }}</span>
      <span class="mx-3 opacity-30">•</span>
      <router-link to="/" class="footer-link">
        {{ APP.TITLE }}
      </router-link>
      <span class="mx-3 opacity-30">•</span>
      <router-link to="/about" class="footer-link"> About </router-link>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { APP, ABOUT_PAGE } from "@/constants";

const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;
</script>

<style scoped>
.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  transition: color 0.2s ease;
  position: relative;
}

.footer-link:hover {
  color: var(--color-primary);
}
</style>
