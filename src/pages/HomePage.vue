<template>
  <v-container class="home-page pb-0">
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

    <FavoriteRecipes
      v-if="
        isAuthenticated && (isVisibleRecipeFinderForm || appState.skipWelcome)
      "
      :max-items="MAX_FAVORITE_ITEMS"
    />

    <RecentRecipes
      v-if="isVisibleRecipeFinderForm || appState.skipWelcome"
      :max-items="MAX_RECENT_ITEMS"
      :title="LABELS.RECENT_RECIPES_TITLE"
    />

    <HomePageConfirmAuthDialog
      :show-guest-dialog="showGuestDialog"
      @on-login="handleLogin"
      @on-guest-confirmed="confirmGuestBrowse"
    />
  </v-container>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// constants
import { MAX_RECENT_ITEMS, MAX_FAVORITE_ITEMS, LABELS } from "@/constants";

// state
import { useAppStore } from "@/stores";

// refs
const isVisibleRecipeFinderForm = ref(false);
const isVisibleHomePageNonAuthGreentings = ref(true);
const showGuestDialog = ref(false);

// state
const appState = useAppStore();

// components
import FavoriteRecipes from "@/components/FavoriteRecipes.vue";
import RecentRecipes from "@/components/RecentRecipes.vue";
import RecipeFinderForm from "@/components/RecipeFinderForm.vue";
import HomePageAuthGreentings from "@/components/HomePageAuthGreentings.vue";
import HomePageNonAuthGreentings from "@/components/HomePageNonAuthGreentings.vue";
import HomePageConfirmAuthDialog from "@/components/HomePageConfirmAuthDialog.vue";

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
