<template>
  <v-container class="footer-container" fluid>
    <div class="text-center text-subtitle-2 footer-content">
      <div>
        <span class="opacity-60"
          >&copy; {{ fullYear }}
          <a
            href="https://rusu-ionut.ro"
            target="_blank"
            class="developer-link"
            >{{ developer }}</a
          >. {{ LABELS.ALL_RIGHTS_RESERVED }} - {{ APP.TITLE }}</span
        >
      </div>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { APP, ABOUT_PAGE, LABELS } from "@/constants";
const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;
</script>

<style scoped>
.developer-link {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
}

.developer-link:hover {
  opacity: 1;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>
