<template>
  <div class="recent-recipes-container">
    <!-- Header Section -->
    <div class="d-flex align-center justify-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-icon icon="mdi-fire" size="x-large" color="primary" />
        <h2 class="text-h4 font-weight-bold">
          {{ title }}
        </h2>
      </div>
      <v-btn
        v-if="!loadingRecipes && recipes.length > 0"
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
      <v-card-text class="p-6! relative!">
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
        <v-row v-else-if="limitedRecipes.length > 0">
          <v-col
            v-for="recipe in limitedRecipes"
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
                  @click.stop="toggleFavorite(recipe.id)"
                  :color="isFavorited(recipe.id) ? 'error' : 'default'"
                  class="save-btn"
                  :loading="loading && recipe.id == loadingFavoriteRecipeId"
                >
                  <v-icon
                    :icon="
                      isFavorited(recipe.id) ? 'mdi-heart' : 'mdi-heart-outline'
                    "
                  />
                  <v-tooltip activator="parent" location="top">
                    {{
                      !isAuthenticated
                        ? RECIPE_FINDER.LOGIN_REQUIRED_TOOLTIP
                        : isFavorited(recipe.id)
                          ? RECIPE_FINDER.SAVED_RECIPE_TOOLTIP
                          : RECIPE_FINDER.SAVE_RECIPE_TOOLTIP
                    }}
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
          {{ RECENT_RECIPES.EMPTY_STATE }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loading"
      :favorites="favorites"
      :image-base-uri="imageBaseUri"
      @close="handleModalClose"
      @favorite="handleFavoriteToggle"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// types
import type { IRecipe, IRecipeDetails } from "@/types";

// constants
import { RECIPE_FINDER, LOADING_CONFIG, RECENT_RECIPES } from "@/constants";

// services
import {
  getRandomRecipes,
  getRecipeDetails,
  setFavoriteRecipes,
  removeFavoriteRecipes,
} from "@/services";

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
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

// state
const recipes = ref<IRecipe[]>([]);
const loadingRecipes = ref(false);
const loading = ref(false);
const loadingFavoriteRecipeId = ref<number | string | null>(null);
const error = ref<string | null>(null);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);
const favorites = ref<Set<number | string>>(new Set());

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// computed
const title = ref(props.title || RECENT_RECIPES.DEFAULT_TITLE);
const limitedRecipes = computed(() => recipes.value.slice(0, props.maxItems));

// methods
const getImageUrl = (imageSrc: string): string => {
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${imageBaseUri.value}${imageSrc}`;
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

const handleAddRecipesFavorites = async (recipeId: number | string) => {
  loading.value = true;
  loadingFavoriteRecipeId.value = recipeId;
  try {
    const token = await getAccessTokenSilently();
    const response = await setFavoriteRecipes(favorites.value, token);
    if (response.success) {
      console.log("Favorites updated successfully");
    } else {
      console.error("Failed to update favorites:", response.message);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  } finally {
    loading.value = false;
    loadingFavoriteRecipeId.value = null;
  }
};

const handleDeleteRecipesFavorites = async (recipeId: number | string) => {
  loading.value = true;
  loadingFavoriteRecipeId.value = recipeId;
  const recipeIdMapped = new Set<number | string>();
  recipeIdMapped.add(recipeId);
  try {
    const token = await getAccessTokenSilently();
    const response = await removeFavoriteRecipes(recipeIdMapped, token);
    if (response.success) {
      console.log("Favorites removed successfully");
    } else {
      console.error("Failed to remove favorites:", response.message);
    }
  } catch (error) {
    console.error("Error removing favorites:", error);
  } finally {
    loading.value = false;
    loadingFavoriteRecipeId.value = null;
  }
};

const toggleFavorite = (recipeId: number | string) => {
  if (!isAuthenticated.value) {
    return;
  }
  if (favorites.value.has(recipeId)) {
    favorites.value.delete(recipeId);
    handleDeleteRecipesFavorites(recipeId);
  } else {
    favorites.value.add(recipeId);
    handleAddRecipesFavorites(recipeId);
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
};

const handleFavoriteToggle = (recipeId: number) => {
  toggleFavorite(recipeId);
};

const isFavorited = (recipeId: number) => {
  return favorites.value.has(recipeId);
};

// lifecycle
onMounted(() => {
  fetchRecipes();
});
</script>

<style scoped>
.recent-recipes-container {
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

.save-btn {
  transition: all 0.2s ease-in-out;
}

.save-btn:hover {
  transform: scale(1.1);
}

.view-recipe-btn {
  flex: 1;
}
</style>
