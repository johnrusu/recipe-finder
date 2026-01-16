<template>
  <v-container class="home-page">
    <HomePageNonAuthGreentings
      v-if="statusIsVisibleNonAuthGreentings && appState.skipWelcome === false"
      @on-login="handleLogin"
      @on-browse="handleBrowse"
    />
    <HomePageAuthGreentings
      v-if="
        isAuthenticated &&
        !isVisibleRecipeFinderForm &&
        appState.skipWelcome === false
      "
      @on-start-journey="handleStartJourney"
    />
    <RecipeFinderForm
      v-if="isVisibleRecipeFinderForm || appState.skipWelcome"
    />

    <!-- Guest Confirmation Dialog -->
    <v-dialog
      v-model="showGuestDialog"
      max-width="500"
      opacity=".8"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="text-h5 font-weight-bold py-4">
          <v-icon icon="mdi-account-alert" color="warning" class="mr-2" />
          {{ LABELS.GUEST_CONFIRM_TITLE }}
        </v-card-title>

        <v-card-text class="pb-2">
          <p class="text-body-1 mb-4">{{ LABELS.GUEST_CONFIRM_MESSAGE }}</p>

          <v-list density="compact" class="bg-transparent">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <span class="text-body-2">{{ LABELS.GUEST_BENEFIT_1 }}</span>
              </template>
            </v-list-item>
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <span class="text-body-2">{{ LABELS.GUEST_BENEFIT_2 }}</span>
              </template>
            </v-list-item>
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <span class="text-body-2">{{ LABELS.GUEST_BENEFIT_3 }}</span>
              </template>
            </v-list-item>
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <span class="text-body-2">{{ LABELS.GUEST_BENEFIT_4 }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions
          class="px-6 pb-6 d-flex flex-column flex-sm-row justify-between gap-4!"
        >
          <v-btn
            variant="plain"
            @click="confirmGuestBrowse"
            size="large"
            class="w-full sm:flex-1"
          >
            <span class="text-wrap">{{ LABELS.GUEST_CONTINUE }} </span>
          </v-btn>
          <v-btn
            @click="handleLogin"
            size="large"
            class="gemini-live-border w-full sm:flex-1"
          >
            <span class="text-wrap">{{ LABELS.GUEST_CREATE_ACCOUNT }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from "vue";

// state
import { useAppStore } from "@/stores";

import { useAuth0 } from "@auth0/auth0-vue";
import { LABELS } from "@/constants";

// refs
const isVisibleRecipeFinderForm = ref(false);
const isVisibleHomePageNonAuthGreentings = ref(true);
const showGuestDialog = ref(false);

// state
const appState = useAppStore();

// components
const HomePageNonAuthGreentings = defineAsyncComponent(
  () => import("@/components/HomePageNonAuthGreentings.vue")
);

const HomePageAuthGreentings = defineAsyncComponent(
  () => import("@/components/HomePageAuthGreentings.vue")
);

const RecipeFinderForm = defineAsyncComponent(
  () => import("@/components/RecipeFinderForm.vue")
);

const { loginWithRedirect, isAuthenticated } = useAuth0();

const statusIsVisibleNonAuthGreentings = computed(() => {
  return !isAuthenticated.value && isVisibleHomePageNonAuthGreentings.value;
});

const handleStartJourney = () => {
  isVisibleRecipeFinderForm.value = true;
  isVisibleHomePageNonAuthGreentings.value = false;
  appState.setSkipWelcome(true);
};

const handleLogin = () => {
  loginWithRedirect();
};

const handleBrowse = () => {
  showGuestDialog.value = true;
};

const confirmGuestBrowse = () => {
  showGuestDialog.value = false;
  isVisibleRecipeFinderForm.value = true;
  isVisibleHomePageNonAuthGreentings.value = false;
  appState.setSkipWelcome(true);
};
</script>

<style scoped>
.hero-title {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
}
</style>
