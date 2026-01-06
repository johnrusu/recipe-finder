<template>
  <v-container
    class="not-found-container h-full flex items-center justify-center"
  >
    <div class="max-w-6xl mx-auto w-full">
      <v-card class="text-center pa-8 w-full">
        <v-card-text>
          <v-icon size="120" color="error" class="mb-4">
            mdi-alert-circle-outline
          </v-icon>

          <h1 class="text-h3 font-weight-bold mb-4">
            {{ LABELS.NOT_FOUND_TITLE }}
          </h1>
          <h2 class="text-h5 mb-4">{{ LABELS.NOT_FOUND_HEADING }}</h2>

          <p class="text-body-1 text-grey mb-6">
            {{ LABELS.NOT_FOUND_MESSAGE }}
          </p>

          <div class="flex justify-center gap-4 flex-wrap">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-home"
              class="w-full md:w-auto"
              @click="goHome"
            >
              {{ LABELS.GO_HOME }}
            </v-btn>

            <v-btn
              variant="outlined"
              size="large"
              prepend-icon="mdi-arrow-left"
              class="w-full md:w-auto"
              @click="goBack"
            >
              {{ LABELS.GO_BACK }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// constants
import { LABELS } from "@/constants";

// router
const router = useRouter();

// methods
const goHome = () => {
  router.push({ path: "/" });
};

const goBack = () => {
  router.back();
};
</script>
