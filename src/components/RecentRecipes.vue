<template>
  <div class="recent-recipes-container" v-if="isArrayNotEmpty(recipes)">
    <!-- Header Section -->
    <div class="d-flex align-center justify-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-icon icon="mdi-fire" size="x-large" color="primary" />
        <h2 class="text-h4 font-weight-bold">
          {{ title }}
        </h2>
      </div>
      <v-btn
        v-if="!loadingRecipes && isArrayNotEmpty(recipes)"
        variant="text"
        size="small"
        color="primary"
        @click="refreshRecipes"
        prepend-icon="mdi-refresh"
        class="ml-4"
      >
        {{ RECENT_RECIPES.REFRESH_BUTTON }}
      </v-btn>
    </div>
    <v-card>
      <v-card-text class="p-6!">
        <!-- Loading State -->
        <div v-if="loadingRecipes" class="d-flex justify-center pa-8">
          <AppLoading :config="LOADING_CONFIG" />
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          closable
          @click:close="error = null"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <!-- Recipes Grid -->
        <v-row v-else-if="isArrayNotEmpty(limitedRecipes)">
          <v-col
            v-for="recipe in limitedRecipes"
            :key="`recent-recipe-${recipe.id}`"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <AppRecipe
              :recipe="recipe"
              :rating="fetchRatingForRecipe(recipe.id)"
              :loading-app-recipe="loading"
              :favorite-recipe-id="favoriteRecipeId"
              :show-toggle-favorite="true"
              :is-favorited="isFavorited(recipe)"
              :is-authenticated="isAuthenticated"
              @toggle-favorite="toggleFavorite"
              @view-recipe-details="handleGetRecipeDetails"
              @rating-change="handleRatingChange"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loading"
      :favorites="favorites"
      :image-base-uri="imageBaseUri"
      @on-close="handleModalClose"
      @on-toggle-favorite="handleFavoriteToggle"
    />
  </div>
  <!-- Loading State -->
  <div v-else class="d-flex justify-center pa-8">
    <AppLoading :config="LOADING_CONFIG" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// state
import { useAppStore } from "@/stores";

// types
import type { IRecipe, IRecipeDetails } from "@/types";

// constants
import { RECIPE_FINDER, LOADING_CONFIG, RECENT_RECIPES } from "@/constants";

// services
import {
  getRandomRecipes,
  fetchRecipeDetails,
  setFavoriteRecipes,
  removeFavoriteRecipe,
  fetchFavoriteRecipes,
} from "@/services";
import { isArrayNotEmpty } from "@/utils";

// composables
import { useRecipeRating } from "@/composables/useRecipeRating";

// components
import AppLoading from "./AppLoading.vue";
import AppRecipe from "./AppRecipe.vue";
import RecipeDetailsModal from "./RecipeDetailsModal.vue";

// props
const props = defineProps<{
  maxItems: number;
  title?: string;
}>();

// auth
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

// store
const appStore = useAppStore();

// composables
const { fetchRatingForRecipe, handleRatingChange } = useRecipeRating();

// state
const recipes = ref<IRecipe[]>([]);
const favorites = ref<IRecipe[]>([]);

const loadingRecipes = ref(false);
const loading = ref(false);

const favoriteRecipeId = ref<number | null>(null);
const error = ref<string | null>(null);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// computed
const title = ref(props.title || RECENT_RECIPES.DEFAULT_TITLE);
const limitedRecipes = computed(() => recipes.value.slice(0, props.maxItems));

// methods
const fetchFavoritesRecipes = async () => {
  if (!isAuthenticated.value) {
    return;
  }
  try {
    let token = "";
    if (
      isAuthenticated.value === true &&
      typeof getAccessTokenSilently === "function"
    ) {
      try {
        token = (await getAccessTokenSilently()) || "";
      } catch (authError) {
        console.warn("Failed to get access token:", authError);
        return;
      }
    }
    const response = await fetchFavoriteRecipes(token);

    if (response.success && response.recipes) {
      appStore.setFavoritesRecipes(response.recipes);
      favorites.value = response.recipes;
    }
  } catch (err) {
    console.error("Error initializing favorites:", err);
  }
};

const fetchRecipes = async () => {
  loadingRecipes.value = true;
  error.value = null;

  try {
    const response = await getRandomRecipes(props.maxItems);

    if (response.success && response.recipes.results) {
      recipes.value = response.recipes.results;
      if (response.recipes.baseUri) {
        imageBaseUri.value = response.recipes.baseUri;
      }

      // Cache full recipes in store for navigation persistence
      appStore.setRecentRecipes(response.recipes.results);

      // Sync local favorites with store
      favorites.value = appStore.favoritesRecipes;
    } else {
      error.value = RECENT_RECIPES.ERROR_LOADING;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECENT_RECIPES.ERROR_GENERIC;
    error.value = errorMessage;
    console.error("Error loading recent recipes:", err);
  } finally {
    loadingRecipes.value = false;
  }
};

const refreshRecipes = () => {
  fetchRecipes();
};

const handleGetRecipeDetails = async (recipeId: number) => {
  loading.value = true;
  error.value = null;
  showRecipeModal.value = true;

  try {
    let token = "";
    // Only attempt to get token if user is authenticated
    if (
      isAuthenticated.value === true &&
      typeof getAccessTokenSilently === "function"
    ) {
      try {
        token = (await getAccessTokenSilently()) || "";
      } catch (authError) {
        console.warn("Failed to get access token:", authError);
        // Continue with empty token - viewing recipes doesn't require auth
      }
    }
    const response = await fetchRecipeDetails(recipeId, token);

    if (response.success && response.recipe) {
      selectedRecipeDetails.value = response.recipe as IRecipeDetails;
    } else {
      error.value = RECIPE_FINDER.ERROR_RECIPE_NOT_FOUND;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_FETCHING_RECIPE;
    error.value = errorMessage;
    console.error("Get recipe details error:", err);
  } finally {
    loading.value = false;
  }
};

const handleAddRecipeFavorites = async (recipe: IRecipe) => {
  loading.value = true;
  try {
    let token = "";
    if (
      isAuthenticated.value === true &&
      typeof getAccessTokenSilently === "function"
    ) {
      try {
        token = (await getAccessTokenSilently()) || "";
      } catch (authError) {
        console.warn("Failed to get access token:", authError);
        loading.value = false;
        return;
      }
    }
    const updatedFavorites = [...favorites.value, recipe];
    const response = await setFavoriteRecipes(updatedFavorites, token);
    if (response.success) {
      // Update store with new favorites
      favorites.value = updatedFavorites;
      appStore.setFavoritesRecipes(updatedFavorites);
    } else {
      console.error("Failed to update favorites:", response.message);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  } finally {
    loading.value = false;
  }
};

const handleDeleteRecipeFavorites = async (recipe: IRecipe) => {
  loading.value = true;
  try {
    let token = "";
    if (
      isAuthenticated.value === true &&
      typeof getAccessTokenSilently === "function"
    ) {
      try {
        token = (await getAccessTokenSilently()) || "";
      } catch (authError) {
        console.warn("Failed to get access token:", authError);
        loading.value = false;
        return;
      }
    }

    const response = await removeFavoriteRecipe([recipe], token);
    if (response.success) {
      const updatedFavorites = favorites.value.filter(
        (r) => r.id !== recipe.id
      );
      favorites.value = updatedFavorites;
      appStore.setFavoritesRecipes(updatedFavorites);
    } else {
      console.error("Failed to remove favorites:", response.message);
    }
  } catch (error) {
    console.error("Error removing favorites:", error);
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = (recipe: IRecipe) => {
  if (!isAuthenticated.value) {
    return;
  }
  favoriteRecipeId.value = recipe.id;
  const alreadyFavorited = isFavorited(recipe);
  if (alreadyFavorited) {
    handleDeleteRecipeFavorites(recipe);
  } else {
    handleAddRecipeFavorites(recipe);
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
};

const handleFavoriteToggle = (recipe: IRecipe) => {
  toggleFavorite(recipe);
};

const isFavorited = (recipe: IRecipe) => {
  return favorites.value.find((r) => r.id === recipe.id) !== undefined;
};

// watch store for changes from other components
watch(
  () => appStore.favoritesRecipes,
  (storeFavorites) => {
    favorites.value = storeFavorites;
  },
  { deep: true }
);

// lifecycle
onMounted(async () => {
  const hasFavorites = isArrayNotEmpty(appStore.favoritesRecipes);
  const hasRecent = isArrayNotEmpty(appStore.recentRecipes);

  // Always load recent recipes from store if available
  if (hasRecent) {
    recipes.value = appStore.recentRecipes;
  }

  // Handle favorites initialization
  if (hasFavorites) {
    favorites.value = appStore.favoritesRecipes;
  } else {
    await fetchFavoritesRecipes();
  }

  // Fetch fresh recipes if we don't have any
  if (!hasRecent) {
    await fetchRecipes();
  }
});
</script>
