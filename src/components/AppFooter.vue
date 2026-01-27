<template>
  <v-container class="footer-container" fluid>
    <div class="text-center text-subtitle-2 footer-content">
      <div>
        <span
          >&copy; {{ fullYear }}
          <a
            href="https://rusu-ionut.ro"
            target="_blank"
            class="developer-link"
            >{{ developer }}</a
          >. {{ LABELS.ALL_RIGHTS_RESERVED }}</span
        >
      </div>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { ABOUT_PAGE, LABELS } from "@/constants";
const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;
</script>

<style scoped>
.developer-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
</style>
