<template>
  <div
    class="favorite-recipes-container mb-12"
    v-if="isArrayNotEmpty(allRecipesIds)"
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
      <v-progress-linear
        indeterminate
        v-if="loadingPartialFromState"
        class="absolute top-0 left-0 w-full"
      ></v-progress-linear>
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
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <v-card
              class="h-100 d-flex flex-column recipe-card"
              color="white"
              ripple
            >
              <v-img
                :src="getImageUrl(recipe.image)"
                :alt="recipe.title"
                height="200px"
                cover
              />
              <v-card-text class="grow">
                <div class="text-h6 font-weight-bold line-clamp-2">
                  {{ recipe.title }}
                </div>
                <div class="d-flex align-center gap-2 mt-2 text-caption">
                  <v-icon size="small" icon="mdi-clock" />
                  {{ recipe.readyInMinutes }} min
                </div>
                <div class="d-flex align-center gap-2 text-caption">
                  <v-icon size="small" icon="mdi-silverware-fork-knife" />
                  {{ recipe.servings }} servings
                </div>
              </v-card-text>
              <v-card-actions class="pt-0 d-flex gap-2">
                <v-btn
                  icon
                  @click.stop="handleRemoveFavorite(recipe.id)"
                  color="error"
                  class="remove-btn"
                  :loading="
                    loadingForDetails && recipe.id == loadingFavoriteRecipeId
                  "
                >
                  <v-icon icon="mdi-heart-off" />
                  <v-tooltip activator="parent" location="top">
                    {{ FAVORITE_RECIPES.REMOVE_BUTTON }}
                  </v-tooltip>
                </v-btn>
                <v-btn
                  variant="elevated"
                  color="primary"
                  size="large"
                  @click.stop="handleGetRecipeDetails(recipe.id)"
                  class="view-recipe-btn grow"
                  append-icon="mdi-arrow-right"
                >
                  {{ RECIPE_FINDER.VIEW_RECIPE_BUTTON }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loadingForDetails"
      :favorites="favoriteRecipeIds"
      :image-base-uri="imageBaseUri"
      @close="handleModalClose"
      @favorite="handleFavoriteToggle"
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
  getFavoriteRecipes,
  getRecipeDetails,
  removeFavoriteRecipes,
  getRecipesBulkDetails,
} from "@/services";
import { isArrayNotEmpty, isNilOrEmpty } from "@/utils";

// components
import AppLoading from "./AppLoading.vue";
import RecipeDetailsModal from "./RecipeDetailsModal.vue";

// props
const props = defineProps<{
  maxItems: number;
  title?: string;
}>();

// auth
const { getAccessTokenSilently } = useAuth0();

// store
const appStore = useAppStore();

// state
const allRecipesIds = ref<number[]>([]);
const recipes = ref<IRecipe[]>([]);
const favoriteRecipeIds = ref<number[]>([]);
const loadingFavoriteRecipeId = ref<number | null>(null);
const error = ref<string | null>(null);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);

const loadingAllFavoriteRecipes = ref(false);
const loadingPartialFromState = ref(false);
const loadingForDetails = ref(false);

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// computed
const title = ref(props.title || FAVORITE_RECIPES.DEFAULT_TITLE);
const displayedRecipes = computed(() =>
  isArrayNotEmpty(recipes.value) ? recipes.value.slice(0, props.maxItems) : []
);

// methods
const getImageUrl = (imageSrc: string): string => {
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${imageBaseUri.value}${imageSrc}`;
};

const fetchBulkDetailsByIds = async (ids: number[], token: string) => {
  recipes.value = [];
  if (isArrayNotEmpty(ids)) {
    // Fetch recipe details in bulk
    try {
      const detailsResponse = await getRecipesBulkDetails(ids, token);

      if (!isNilOrEmpty(detailsResponse)) {
        const recipesData = pathOr([], ["recipes"], detailsResponse);
        recipes.value = recipesData;
      } else {
        console.error(
          "Failed to fetch favorite recipe details:",
          detailsResponse
        );
      }
    } catch (e) {
      console.error("Error fetching bulk recipe details:", e);
      recipes.value = [];
    }
  }
};

const fetchFavorites = async (
  favoritesFromStore: number[],
  allFavorites: boolean
) => {
  const token = await getAccessTokenSilently();
  if (allFavorites) {
    loadingAllFavoriteRecipes.value = true;
    allRecipesIds.value = [];
  } else {
    loadingPartialFromState.value = true;
  }

  favoriteRecipeIds.value = [];
  error.value = null;

  if (isArrayNotEmpty(favoritesFromStore)) {
    favoriteRecipeIds.value = favoritesFromStore;
    await fetchBulkDetailsByIds(Array.from(favoritesFromStore), token);
  } else {
    try {
      const response = await getFavoriteRecipes(token);
      if (!isNilOrEmpty(response)) {
        const success = pathOr(false, ["success"], response);
        const recipeIds = pathOr([], ["recipeIds"], response);

        if (success) {
          if (isArrayNotEmpty(recipeIds)) {
            favoriteRecipeIds.value = recipeIds;
            allRecipesIds.value = recipeIds;
            loadingAllFavoriteRecipes.value = false;

            appStore.setFavoritesRecipes(recipeIds);
            await fetchBulkDetailsByIds(recipeIds, token);
            return;
          }
        }
      }

      favoriteRecipeIds.value = [];
      recipes.value = [];
      allRecipesIds.value = [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : FAVORITE_RECIPES.ERROR_GENERIC;
      error.value = errorMessage;
      console.error("Error loading favorite recipes:", err);
      favoriteRecipeIds.value = [];
      recipes.value = [];
      allRecipesIds.value = [];
    }
  }
  if (allFavorites) {
    loadingAllFavoriteRecipes.value = false;
  } else {
    loadingPartialFromState.value = false;
  }
};

const handleGetRecipeDetails = async (recipeId: number) => {
  loadingForDetails.value = true;
  error.value = null;
  showRecipeModal.value = true;

  try {
    const response = await getRecipeDetails(recipeId);

    if (response.success && response.recipe) {
      selectedRecipeDetails.value = {
        ...response.recipe,
        extendedIngredients: response.recipe.extendedIngredients || [],
      } as IRecipeDetails;
    } else {
      error.value = RECIPE_FINDER.ERROR_RECIPE_NOT_FOUND;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_FETCHING_RECIPE;
    error.value = errorMessage;
    console.error("Get recipe details error:", err);
  } finally {
    loadingForDetails.value = false;
  }
};

const handleRemoveFavorite = async (recipeId: number) => {
  loadingForDetails.value = true;
  loadingFavoriteRecipeId.value = recipeId;

  try {
    const token = await getAccessTokenSilently();
    const response = await removeFavoriteRecipes([recipeId], token);

    if (response.success) {
      console.log(
        "Favorite removed successfully",
        recipes.value,
        recipeId,
        recipes.value.filter((recipe) => recipe.id !== recipeId),
        (favoriteRecipeIds.value = favoriteRecipeIds.value.filter(
          (id) => id !== recipeId
        ))
      );
      // Remove from local state
      recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeId);
      favoriteRecipeIds.value = favoriteRecipeIds.value.filter(
        (id) => id !== recipeId
      );
      allRecipesIds.value = allRecipesIds.value.filter((id) => id !== recipeId);

      appStore.setFavoritesRecipes(favoriteRecipeIds.value);
    } else {
      console.error("Failed to remove favorite:", response.message);
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  } finally {
    loadingForDetails.value = false;
    loadingFavoriteRecipeId.value = null;
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
};

const handleFavoriteToggle = (recipeId: number) => {
  handleRemoveFavorite(recipeId);
};

// lifecycle
onMounted(async () => {
  const hasFavorites = isArrayNotEmpty(appStore.favoritesRecipes);

  if (hasFavorites) {
    favoriteRecipeIds.value = appStore.favoritesRecipes;
    return;
  }
  await fetchFavorites([], true);
});

// watch store for changes from other components
watch(
  () => appStore.favoritesRecipes,
  (newFavorites) => {
    if (!isArrayNotEmpty(newFavorites)) {
      favoriteRecipeIds.value = [];
      return;
    }
    favoriteRecipeIds.value = Array.from(newFavorites);
  },
  { deep: true }
);

// watch favorite recipe ids length and refetch details when it changes
watch(
  () => favoriteRecipeIds.value.length,
  async (newLength) => {
    if (newLength > 0) {
      const token = await getAccessTokenSilently();
      allRecipesIds.value = Array.from(favoriteRecipeIds.value);
      await fetchBulkDetailsByIds(Array.from(favoriteRecipeIds.value), token);
    } else {
      recipes.value = [];
      allRecipesIds.value = [];
    }
  }
);
</script>

<style scoped>
.favorite-recipes-container {
  width: 100%;
}

.recipe-card {
  transition: transform 0.2s ease-in-out;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-btn {
  transition: all 0.2s ease-in-out;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.view-recipe-btn {
  flex: 1;
}
</style>
