<template>
  <v-container class="py-12">
    <div class="w-full">
      <!-- Error Icon & Title -->
      <div class="text-center mb-6">
        <v-icon size="56" color="error" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>
        <h1 class="text-3xl font-bold text-error mb-2">
          {{ LABELS.ERROR_TITLE }}
        </h1>
      </div>

      <!-- Error Message -->
      <v-card class="mb-6" color="error-light">
        <v-card-text class="text-center">
          <p class="text-base font-semibold mb-2">
            {{ LABELS.ERROR_MESSAGE }}
          </p>
          <p class="text-sm opacity-75">
            {{ error?.message || "Unknown error occurred" }}
          </p>
        </v-card-text>
      </v-card>

      <!-- Error Details (Collapsible) -->
      <v-expansion-panels class="mb-6">
        <v-expansion-panel title="Technical Details">
          <template #text>
            <div
              v-for="err in arrEror"
              :key="`err-${err[0]}`"
              class="flex mb-4 flex-col gap-2"
            >
              <div class="text-lg text-error">
                <strong class="uppercase">{{ err[0] }}:</strong>
              </div>
              <div>
                <p>{{ err[1] || "No data available" }}</p>
              </div>
            </div>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Info Alert -->
      <v-alert
        icon="mdi-information-outline"
        :title="LABELS.FIX_AUTH_ISSUE"
        :text="`${LABELS.REMOVE_STORAGE}\n${LABELS.RELOGIN}`"
        type="info"
        class="mb-6"
      />

      <!-- Action Button -->
      <v-btn block size="large" color="error" @click="handleClearStorage">
        {{ LABELS.CLEAR_STORAGE_AND_RELOGIN }}
      </v-btn>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// constants
import { LABELS } from "@/constants";
const props = defineProps<{
  error: Error | null;
}>();

const arrEror = props.error ? Object.entries(props.error) : [];

function handleClearStorage() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  window.location.reload();
}
</script>
