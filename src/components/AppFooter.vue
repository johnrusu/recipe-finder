<template>
  <v-container class="footer-container" fluid>
    <div v-html="footerContent" class="text-center text-subtitle-2"></div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { APP, LABELS, ABOUT_PAGE } from "@/constants";

const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;
const footerContent = `&copy; ${fullYear} ${developer} -  <strong>${APP.TITLE}</strong> <div>${LABELS.ALL_RIGHTS_RESERVED}</div>`;
</script>
