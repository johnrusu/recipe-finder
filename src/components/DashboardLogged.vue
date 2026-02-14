<template>
  <div class="dashboard-logged">
    <!-- User Profile Section -->
    <v-card class="mb-8 profile-card" elevation="2">
      <v-card-text class="pa-6 pa-md-8">
        <div
          class="d-flex flex-column flex-md-row align-center gap-4 justify-md-start justify-center"
        >
          <v-avatar
            size="80"
            class="avatar-responsive"
            color="primary"
            variant="tonal"
          >
            <v-img
              v-if="user?.picture"
              :src="user.picture"
              :alt="user?.name || 'User'"
              cover
            />
            <v-icon v-else size="40" icon="mdi-account-circle" />
          </v-avatar>
          <div class="text-center text-md-left flex-grow-1">
            <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
              {{ DASHBOARD.WELCOME_HEADING
              }}{{ user?.name ? `, ${user.name.split(" ")[0]}` : "" }}!
            </h1>
            <p class="text-body1 text-md-h6 text-medium-emphasis mb-2">
              {{ DASHBOARD.WELCOME_SUBHEADING }}
            </p>
            <div
              class="d-flex align-center gap-2 justify-center justify-md-start"
              v-if="user?.email"
            >
              <v-icon size="small" icon="mdi-email" color="medium-emphasis" />
              <span class="text-caption text-medium-emphasis">{{
                user.email
              }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="4" class="pb-0!">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ DASHBOARD.FAVORITE_RECIPES_LABEL }}
                </p>
                <h2 class="text-h4 font-weight-bold">{{ favoriteCount }}</h2>
              </div>
              <v-avatar size="56" color="error" variant="tonal">
                <v-icon size="28" icon="mdi-heart" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="pb-0!">
        <v-card class="stat-card relative" elevation="2">
          <v-progress-linear
            indeterminate
            v-if="loadingOfViewedRecipes"
            class="absolute top-0 left-0 w-full"
          ></v-progress-linear>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ DASHBOARD.RECIPES_VIEWED_LABEL }}
                </p>
                <h2 class="text-h4 font-weight-bold">
                  <a
                    href="#"
                    @click.prevent="fetchListOfViewedRecipes()"
                    class="text-primary"
                  >
                    {{ totalRecipesViewedCount }}
                  </a>
                </h2>
              </div>
              <v-avatar size="56" color="primary" variant="tonal">
                <v-icon size="28" icon="mdi-eye" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="pb-0!">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ DASHBOARD.TOTAL_SEARCHES_LABEL }}
                </p>
                <h2 class="text-h4 font-weight-bold">
                  {{ searchHistoryCount }}
                </h2>
              </div>
              <v-avatar size="56" color="success" variant="tonal">
                <v-icon size="28" icon="mdi-magnify" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Favorite Recipes Section -->
    <v-card class="mb-8" elevation="2">
      <v-card-title class="pa-6 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <v-icon icon="mdi-heart" size="large" color="error" />
          <h2 class="text-h5 font-weight-bold">
            {{ DASHBOARD.FAVORITE_RECIPES_TITLE }}
          </h2>
        </div>
        <v-chip v-if="favoriteRecipes.length > 0" color="error" variant="flat">
          {{ favoriteRecipes.length }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Loading State -->
        <div v-if="loadingFavorites" class="d-flex justify-center pa-8">
          <AppLoading :config="LOADING_CONFIG" />
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="favoritesError"
          type="error"
          variant="tonal"
          closable
          @click:close="favoritesError = null"
        >
          {{ favoritesError }}
        </v-alert>
        <v-alert
          v-else-if="viewDetailsError"
          type="error"
          variant="tonal"
          closable
          @click:close="viewDetailsError = null"
        >
          {{ viewDetailsError }}
        </v-alert>

        <!-- Recipes Grid -->
        <v-row v-else-if="favoriteRecipes.length > 0">
          <v-col
            v-for="recipe in favoriteRecipes.slice(0, 6)"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="recipe-card h-100 d-flex flex-column"
              color="white"
              ripple
            >
              <v-img
                :src="recipe.image"
                :alt="recipe.title"
                height="200px"
                cover
              >
                <v-chip class="ma-2" color="error" variant="flat" size="small">
                  <v-icon start icon="mdi-heart" size="small" />
                  {{ DASHBOARD.FAVORITE_CHIP }}
                </v-chip>
              </v-img>
              <v-card-text class="grow">
                <h3 class="text-h6 font-weight-bold line-clamp-2 mb-2">
                  {{ recipe.title }}
                </h3>
                <div class="d-flex align-center gap-4 text-caption">
                  <div class="d-flex align-center gap-1">
                    <v-icon size="small" icon="mdi-clock" />
                    {{ recipe.readyInMinutes }} {{ DASHBOARD.RECIPE_TIME_UNIT }}
                  </div>
                  <div class="d-flex align-center gap-1">
                    <v-icon size="small" icon="mdi-silverware-fork-knife" />
                    {{ recipe.servings }} {{ DASHBOARD.RECIPE_SERVINGS_UNIT }}
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="pt-0 d-flex gap-2">
                <v-btn
                  icon
                  @click.stop="handleDeleteRecipeFavorites(recipe)"
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
                  @click.stop="handleGetRecipeDetails(recipe)"
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
        <div v-else class="text-center pa-8">
          <v-icon
            size="64"
            icon="mdi-heart-outline"
            color="grey-lighten-1"
            class="mb-4"
          />
          <p class="text-h6 text-medium-emphasis">
            {{ DASHBOARD.NO_FAVORITES_TITLE }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ DASHBOARD.NO_FAVORITES_MESSAGE }}
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            to="/"
            prepend-icon="mdi-magnify"
          >
            {{ DASHBOARD.DISCOVER_RECIPES_BUTTON }}
          </v-btn>
        </div>

        <!-- View All Link -->
        <div v-if="favoriteRecipes.length > 6" class="text-center mt-4">
          <v-btn
            color="primary"
            variant="text"
            to="/"
            append-icon="mdi-arrow-right"
          >
            {{ DASHBOARD.VIEW_ALL_FAVORITES(favoriteRecipes.length) }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loadingForDetails"
      :favorites="favoriteRecipes"
      :image-base-uri="imageBaseUri"
      @on-close="handleModalClose"
      @on-toggle-favorite="handleToggleFavorite"
    />

    <!-- Search History Section -->
    <v-card elevation="2">
      <v-card-title class="pa-6 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <v-icon icon="mdi-history" size="large" color="primary" />
          <h2 class="text-h5 font-weight-bold">
            {{ DASHBOARD.SEARCH_HISTORY_TITLE }}
          </h2>
        </div>
        <v-chip v-if="searchHistory.length > 0" color="primary" variant="flat">
          {{ searchHistory.length }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Loading State -->
        <div v-if="loadingSearchHistory" class="d-flex justify-center pa-8">
          <AppLoading :config="LOADING_CONFIG" />
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="searchHistoryError"
          type="error"
          variant="tonal"
          closable
          @click:close="searchHistoryError = null"
        >
          {{ searchHistoryError }}
        </v-alert>

        <!-- Search History List -->
        <v-list v-else-if="searchHistory.length > 0" lines="two">
          <v-list-item
            v-for="(search, index) in searchHistory.slice(0, 10)"
            :key="index"
            class="search-history-item"
          >
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="mdi-magnify" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ search.query }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ formatDate(search.timestamp) }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="searchAgain(search.query)"
              >
                <v-icon icon="mdi-refresh" />
                <v-tooltip activator="parent" location="top">
                  {{ DASHBOARD.SEARCH_AGAIN_TOOLTIP }}
                </v-tooltip>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <!-- Empty State -->
        <div v-else class="text-center pa-8">
          <v-icon
            size="64"
            icon="mdi-history"
            color="grey-lighten-1"
            class="mb-4"
          />
          <p class="text-h6 text-medium-emphasis">
            {{ DASHBOARD.NO_SEARCH_HISTORY_TITLE }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ DASHBOARD.NO_SEARCH_HISTORY_MESSAGE }}
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            to="/"
            prepend-icon="mdi-magnify"
          >
            {{ DASHBOARD.START_SEARCHING_BUTTON }}
          </v-btn>
        </div>

        <!-- View More Link -->
        <div v-if="searchHistory.length > 10" class="text-center mt-4">
          <v-btn color="primary" variant="text">
            {{ DASHBOARD.VIEW_ALL_SEARCHES(searchHistory.length) }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <RecipesListModal
      :open="isArrayNotEmpty(listOfViewedRecipes)"
      :recipes="listOfViewedRecipes"
      :loading="loadingViewedRecipes"
      :loadingForDetails="loadingForDetails"
      :loadingToggleFavorite="loadingToggleFavorite"
      :favorites="favoriteRecipes"
      :image-base-uri="imageBaseUri"
      icon="mdi-eye"
      icon-color="primary"
      title="Recipes You've Viewed"
      chip-color="primary"
      remove-button-text="Remove from History"
      empty-icon="mdi-history-off"
      empty-title="No Viewed Recipes"
      empty-message="You haven't viewed any recipes yet"
      @on-close="handleCloseRecipesListModal"
      @on-view-details="handleViewRecipeDetails"
      @on-toggle-favorite="handleToggleFavorite"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { pathOr } from "ramda";

// constants
import {
  LOADING_CONFIG,
  DASHBOARD,
  RECIPE_FINDER,
  FAVORITE_RECIPES,
} from "@/constants";

// types
import type { IRecipe, IRecipeDetails } from "@/types";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "@/utils";

// services
import {
  getFavoriteRecipes,
  getViewedRecipesCount,
  getViewedRecipes,
  getRecipeDetails,
  removeFavoriteRecipe,
  setFavoriteRecipes,
} from "@/services";

// stores
import { useAppStore } from "@/stores";

// components
import AppLoading from "@/components/AppLoading.vue";
import RecipeDetailsModal from "@/components/RecipeDetailsModal.vue";
import RecipesListModal from "@/components/RecipesListModal.vue";

// auth
const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

// router
const router = useRouter();

// store
const appStore = useAppStore();

// state
const favoriteRecipes = ref<IRecipe[]>([]);
const searchHistory = ref<Array<{ query: string; timestamp: string }>>([]);

const favoritesError = ref<string | null>(null);
const viewDetailsError = ref<string | null>(null);
const searchHistoryError = ref<string | null>(null);
const totalRecipesViewed = ref(0);
const listOfViewedRecipes = ref<IRecipe[]>([]);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);
const errorViewedRecipes = ref<string | null>(null);

const loadingFavorites = ref(false);
const loadingSearchHistory = ref(false);
const loadingViewedRecipes = ref(false);
const loadingOfViewedRecipes = ref(false);
const loadingToggleFavorite = ref(false);

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);
const loadingForDetails = ref(false);
const loadingFavoriteRecipeId = ref<number | null>(null);

// computed
const favoriteCount = computed(() => favoriteRecipes.value.length);
const searchHistoryCount = computed(() => searchHistory.value.length);
const totalRecipesViewedCount = computed(() => totalRecipesViewed.value);

// methods
const fetchFavorites = async () => {
  loadingFavorites.value = true;
  favoritesError.value = null;

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
        loadingFavorites.value = false;
        return;
      }
    }
    const response = await getFavoriteRecipes(token);

    const success = pathOr(false, ["success"], response);
    const recipes = pathOr([], ["recipes"], response);

    if (success && isArrayNotEmpty(recipes)) {
      appStore.setFavoritesRecipes(recipes);
    } else {
      appStore.setFavoritesRecipes([]);
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load favorites";
    favoritesError.value = errorMessage;
    console.error("Error loading favorites:", err);
  } finally {
    loadingFavorites.value = false;
  }
};

const handleGetRecipeDetails = async (recipe: IRecipe) => {
  loadingForDetails.value = true;
  showRecipeModal.value = true;
  viewDetailsError.value = null;

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
    const response = await getRecipeDetails(recipe.id, token);
    const success = pathOr(false, ["success"], response);
    const recipeDetails: IRecipeDetails | null = pathOr(
      null,
      ["recipe"],
      response
    );

    if (success && !isNilOrEmpty(recipeDetails)) {
      selectedRecipeDetails.value = recipeDetails;
      await fetchTotalRecipesViewed();
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_FETCHING_RECIPE;
    viewDetailsError.value = errorMessage;
    console.error("Get recipe details error:", err);
  } finally {
    loadingForDetails.value = false;
  }
};

const handleToggleFavorite = (recipe: IRecipe) => {
  const foundFavorite = favoriteRecipes.value.find((r) => r.id === recipe.id);
  if (foundFavorite) {
    handleDeleteRecipeFavorites(recipe);
    return;
  }
  handleAddRecipeFavorites(recipe);
};

const handleDeleteRecipeFavorites = async (recipe: IRecipe) => {
  loadingToggleFavorite.value = true;

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
        loadingToggleFavorite.value = false;
        return;
      }
    }
    const response = await removeFavoriteRecipe([recipe], token);

    if (response.success) {
      const filteredFavorites = favoriteRecipes.value.filter(
        (r) => r.id !== recipe.id
      );
      favoriteRecipes.value = filteredFavorites;
      appStore.setFavoritesRecipes(filteredFavorites);
    } else {
      console.error("Failed to remove favorite:", response.message);
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  } finally {
    loadingToggleFavorite.value = false;
  }
};

const handleAddRecipeFavorites = async (recipe: IRecipe) => {
  loadingToggleFavorite.value = true;
  try {
    let token = "";
    if (isAuthenticated.value) {
      try {
        token = (await getAccessTokenSilently()) || "";
      } catch (authError) {
        console.warn("Failed to get access token:", authError);
        loadingToggleFavorite.value = false;
        return;
      }
    }
    const favoritesToAdd = [...favoriteRecipes.value, recipe];
    const response = await setFavoriteRecipes(favoritesToAdd, token);
    if (response.success) {
      favoriteRecipes.value = favoritesToAdd;
      appStore.setFavoritesRecipes(favoritesToAdd);
    } else {
      console.error("Failed to update favorites:", response.message);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  } finally {
    loadingToggleFavorite.value = false;
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
  loadingForDetails.value = false;
};

const fetchSearchHistory = async () => {
  loadingSearchHistory.value = true;
  searchHistoryError.value = null;

  try {
    // TODO: Implement API endpoint to fetch search history
    // For now, using mock data
    searchHistory.value = [
      { query: "Chicken pasta", timestamp: new Date().toISOString() },
      {
        query: "Vegetarian tacos",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        query: "Chocolate cake",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load search history";
    searchHistoryError.value = errorMessage;
    console.error("Error loading search history:", err);
  } finally {
    loadingSearchHistory.value = false;
  }
};

const fetchListOfViewedRecipes = async () => {
  loadingOfViewedRecipes.value = true;
  errorViewedRecipes.value = null;
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
        loadingOfViewedRecipes.value = false;
        return 0;
      }
    }
    const response = await getViewedRecipes(token);
    if (response.success) {
      const recipes: IRecipe[] = pathOr([], ["recipes"], response);
      listOfViewedRecipes.value = recipes;
    }
  } catch (err) {
    console.error("Error fetching total recipes viewed:", err);
  } finally {
    loadingOfViewedRecipes.value = false;
  }
  return 0; // Fallback to 0 if there's an error
};

const fetchTotalRecipesViewed = async () => {
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
        return 0;
      }
    }
    const response = await getViewedRecipesCount(token);
    if (response.success) {
      const count = pathOr(0, ["count"], response);
      totalRecipesViewed.value = count;
    }
  } catch (err) {
    console.error("Error fetching total recipes viewed:", err);
  }
  return 0; // Fallback to 0 if there's an error
};

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return DASHBOARD.TIME_JUST_NOW;
  if (diffMins < 60) return DASHBOARD.TIME_MINUTES_AGO(diffMins);
  if (diffHours < 24) return DASHBOARD.TIME_HOURS_AGO(diffHours);
  if (diffDays < 7) return DASHBOARD.TIME_DAYS_AGO(diffDays);

  return date.toLocaleDateString();
};

const searchAgain = (query: string) => {
  router.push({ path: "/", query: { q: query } });
};

const handleCloseRecipesListModal = () => {
  listOfViewedRecipes.value = [];
  errorViewedRecipes.value = null;
};

const handleViewRecipeDetails = async (recipe: IRecipe) => {
  loadingForDetails.value = true;
  errorViewedRecipes.value = null;

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
    const response = await getRecipeDetails(recipe.id, token);

    if (response.success && response.recipe) {
      selectedRecipeDetails.value = response.recipe as IRecipeDetails;
      showRecipeModal.value = true;
    } else {
      errorViewedRecipes.value = RECIPE_FINDER.ERROR_RECIPE_NOT_FOUND;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_FETCHING_RECIPE;
    errorViewedRecipes.value = errorMessage;
    console.error("Get recipe details error:", err);
  } finally {
    loadingForDetails.value = false;
  }
};

// lifecycle
onMounted(async () => {
  if (!isArrayNotEmpty(appStore.favoritesRecipes)) {
    await fetchFavorites();
  } else {
    // Initialize from store if already populated
    favoriteRecipes.value = appStore.favoritesRecipes;
  }
  await fetchSearchHistory();
  await fetchTotalRecipesViewed();
});

// watch store for changes from other components
watch(
  () => appStore.favoritesRecipes,
  (storeFavorites) => {
    favoriteRecipes.value = storeFavorites;
  },
  { deep: true }
);
</script>

<style scoped>
.dashboard-logged {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.profile-card :deep(.v-card-text) {
  position: relative;
  z-index: 1;
}

.profile-card .avatar-responsive {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-responsive {
  flex-shrink: 0;
}

.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.recipe-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.search-history-item {
  transition: background-color 0.2s;
}

.search-history-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.remove-btn {
  transition: all 0.2s ease-in-out;
}

.remove-btn:active {
  transform: scale(0.95);
}

.view-recipe-btn {
  transition: all 0.2s ease-in-out;
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .profile-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 600px) {
  .recipe-card {
    border-radius: 8px;
  }

  .recipe-card :deep(.v-card__actions) {
    padding: 8px 8px;
  }

  .remove-btn,
  .view-recipe-btn {
    font-size: 0.875rem;
    text-transform: none;
  }
}
</style>
