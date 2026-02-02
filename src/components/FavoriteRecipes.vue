<template>
  <div
    class="favorite-recipes-container mb-12"
    v-if="isArrayNotEmpty(displayedRecipes)"
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

    <v-card>
      <v-card-text class="px-6 py-8 relative!">
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
        <v-row v-else-if="isArrayNotEmpty(displayedRecipes)">
          <v-col
            v-for="recipe in displayedRecipes"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
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
                  :loading="loading && recipe.id == loadingFavoriteRecipeId"
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

        <!-- Empty State -->
        <v-alert v-else type="info" variant="tonal">
          {{ FAVORITE_RECIPES.EMPTY_STATE }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loading"
      :favorites="favoriteIds"
      :image-base-uri="imageBaseUri"
      @close="handleModalClose"
      @favorite="handleFavoriteToggle"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

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
} from "@/services";
import { isArrayNotEmpty } from "@/utils";

// components
const AppLoading = defineAsyncComponent(() => import("./AppLoading.vue"));
const RecipeDetailsModal = defineAsyncComponent(
  () => import("./RecipeDetailsModal.vue")
);

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
const recipes = ref<IRecipe[]>([]);
const favoriteRecipeIds = ref<Array<string | number>>([]);
const loadingRecipes = ref(false);
const loading = ref(false);
const loadingFavoriteRecipeId = ref<number | string | null>(null);
const error = ref<string | null>(null);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// computed
const title = ref(props.title || FAVORITE_RECIPES.DEFAULT_TITLE);
const displayedRecipes = computed(() => recipes.value.slice(0, props.maxItems));
const favoriteIds = computed(() => new Set(favoriteRecipeIds.value));
const hasFavorites = computed(() => recipes.value.length > 0);

// methods
const getImageUrl = (imageSrc: string): string => {
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${imageBaseUri.value}${imageSrc}`;
};

const fetchFavorites = async () => {
  loadingRecipes.value = true;
  error.value = null;

  try {
    const token = await getAccessTokenSilently();
    const response = await getFavoriteRecipes(token);

    if (response.success && response.recipeIds) {
      favoriteRecipeIds.value = response.recipeIds;

      console.log("Fetching details for recipe IDs:", response.recipeIds);

      // Fetch recipe details for each favorite
      const recipeDetailsPromises = response.recipeIds.map((id) =>
        getRecipeDetails(id)
      );

      // Use allSettled to handle both successful and failed requests
      const recipeDetailsResults = await Promise.allSettled(
        recipeDetailsPromises
      );

      console.log("Recipe details results:", recipeDetailsResults);

      recipes.value = recipeDetailsResults
        .filter(
          (result) =>
            result.status === "fulfilled" &&
            result.value.success &&
            result.value.recipe
        )
        .map(
          (result) =>
            (result as PromiseFulfilledResult<any>).value.recipe as IRecipe
        );

      console.log("Final recipes:", recipes.value);
    } else {
      favoriteRecipeIds.value = [];
      recipes.value = [];
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : FAVORITE_RECIPES.ERROR_GENERIC;
    error.value = errorMessage;
    console.error("Error loading favorite recipes:", err);
  } finally {
    loadingRecipes.value = false;
  }
};

const handleGetRecipeDetails = async (recipeId: number) => {
  loading.value = true;
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
    loading.value = false;
  }
};

const handleRemoveFavorite = async (recipeId: number | string) => {
  loading.value = true;
  loadingFavoriteRecipeId.value = recipeId;
  const recipeIdMapped = new Set<number | string>();
  recipeIdMapped.add(recipeId);

  try {
    const token = await getAccessTokenSilently();
    const response = await removeFavoriteRecipes(recipeIdMapped, token);

    if (response.success) {
      console.log("Favorite removed successfully");
      // Remove from local state
      recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeId);
      favoriteRecipeIds.value = favoriteRecipeIds.value.filter(
        (id) => id !== recipeId
      );
    } else {
      console.error("Failed to remove favorite:", response.message);
    }

    // Update store
    appStore.setFavoritesRecipes(new Set(favoriteRecipeIds.value as number[]));
  } catch (error) {
    console.error("Error removing favorite:", error);
  } finally {
    loading.value = false;
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
onMounted(() => {
  fetchFavorites();
});

// expose
defineExpose({
  hasFavorites,
});
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
