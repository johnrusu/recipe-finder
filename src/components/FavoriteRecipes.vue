<template>
  <div
    class="favorite-recipes-container mb-12"
    v-if="isArrayNotEmpty(favoriteRecipes)"
  >
    <!-- Header Section -->
    <div class="d-flex align-center justify-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-icon icon="mdi-heart" size="x-large" color="error" />
        <h2 class="text-h4 font-weight-bold">
          {{ title }}
        </h2>
      </div>
    </div>

    <v-card class="relative">
      <v-card-text class="px-6 py-8 relative!">
        <!-- Loading State -->
        <div
          v-if="loadingAllFavoriteRecipes"
          class="d-flex justify-center pa-8"
        >
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
        <v-row v-else-if="isArrayNotEmpty(displayedRecipes)">
          <v-col
            v-for="recipe in displayedRecipes"
            :key="`favorite-recipe-${recipe.id}`"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <AppRecipe
              :rating="fetchRatingForRecipe(recipe.id)"
              :recipe="recipe"
              :loading-app-recipe="loadingAppRecipe"
              :favorite-recipe-id="favoriteRecipeId"
              :is-authenticated="isAuthenticated"
              @remove-favorite="handleRemoveFavorite"
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
      :isAddingFavorites="loadingAppRecipe"
      :favorites="favoriteRecipes"
      :image-base-uri="imageBaseUri"
      @on-close="handleModalClose"
      @on-toggle-favorite="handleRemoveFavorite"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { pathOr } from "ramda";

// state
import { useAppStore } from "@/stores";

// types
import type { IRecipe, IRecipeDetails } from "@/types";

// constants
import { RECIPE_FINDER, LOADING_CONFIG, FAVORITE_RECIPES } from "@/constants";

// services
import {
  fetchFavoriteRecipes,
  fetchRecipeDetails,
  removeFavoriteRecipe,
} from "@/services";
import { isArrayNotEmpty, isNilOrEmpty } from "@/utils";

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
const favoriteRecipes = ref<IRecipe[]>([]);
const favoriteRecipeId = ref<number | null>(null);
const error = ref<string | null>(null);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);

const loadingAllFavoriteRecipes = ref(false);
const loadingAppRecipe = ref(false);

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// computed
const title = ref(props.title || FAVORITE_RECIPES.DEFAULT_TITLE);
const displayedRecipes = computed(() =>
  isArrayNotEmpty(favoriteRecipes.value)
    ? favoriteRecipes.value.slice(0, props.maxItems)
    : []
);

const fetchFavoritesRecipes = async () => {
  let token = "";

  try {
    token = (await getAccessTokenSilently()) || "";
  } catch (authError) {
    console.error("Failed to get access token:", authError);
  }

  try {
    const response = await fetchFavoriteRecipes(token);
    if (!isNilOrEmpty(response)) {
      const success = pathOr(false, ["success"], response);
      const recipes = pathOr([], ["recipes"], response);

      if (success) {
        if (isArrayNotEmpty(recipes)) {
          favoriteRecipes.value = recipes;
          loadingAllFavoriteRecipes.value = false;

          appStore.setFavoritesRecipes(recipes);
        }
      }
    }

    favoriteRecipes.value = [];
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : FAVORITE_RECIPES.ERROR_GENERIC;
    error.value = errorMessage;
    console.error("Error loading favorite recipes:", err);
    favoriteRecipes.value = [];
  }
};

const handleGetRecipeDetails = async (recipeId: number) => {
  loadingAppRecipe.value = true;
  error.value = null;
  showRecipeModal.value = true;

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
    loadingAppRecipe.value = false;
  }
};

const handleRemoveFavorite = async (recipe: IRecipe) => {
  loadingAppRecipe.value = true;
  favoriteRecipeId.value = recipe.id;

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
        loadingAppRecipe.value = false;
        return;
      }
    }
    const response = await removeFavoriteRecipe([recipe], token);

    if (response.success) {
      // Remove from local state
      const filteredRecipes = favoriteRecipes.value.filter(
        (r) => r.id !== recipe.id
      );
      favoriteRecipes.value = filteredRecipes;
      appStore.setFavoritesRecipes(filteredRecipes);
    } else {
      console.error("Failed to remove favorite:", response.message);
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  } finally {
    loadingAppRecipe.value = false;
    favoriteRecipeId.value = null;
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
};

// watch store for changes from other components
watch(
  () => appStore.favoritesRecipes,
  (storeFavorites) => {
    favoriteRecipes.value = storeFavorites;
  },
  { deep: true }
);

// lifecycle
onMounted(async () => {
  if (!isArrayNotEmpty(appStore.favoritesRecipes)) {
    await fetchFavoritesRecipes();
  } else {
    // Initialize from store if already populated
    favoriteRecipes.value = appStore.favoritesRecipes;
  }
});
</script>
