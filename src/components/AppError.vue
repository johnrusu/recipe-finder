<template>
  <div v-if="error" class="flex items-center justify-center h-full">
    <div class="text-center max-w-md p-6">
      <div class="text-3xl font-bold mb-2">
        {{ LABELS.ERROR_TITLE }}
      </div>
      <div class="text-lg mb-2">
        {{ LABELS.ERROR_MESSAGE }}
      </div>
      <div class="text-sm">
        {{ error?.message }}
      </div>
      <div class="text-sm mt-2 text-center">
        <v-code block>
          {{ JSON.stringify(error) }}
        </v-code>
      </div>
      <v-alert
        icon="mdi-information-outline"
        :title="LABELS.FIX_AUTH_ISSUE"
        :text="`${LABELS.REMOVE_STORAGE}
                  ${LABELS.RELOGIN}`"
        type="info"
        class="text-left mt-4"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
// constants
import { LABELS } from "@/constants";
defineProps<{
  error: Error | null;
}>();
</script>
