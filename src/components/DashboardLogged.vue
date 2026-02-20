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
            :key="`favorite-recipe-${recipe.id}`"
            cols="12"
            sm="6"
            md="4"
          >
            <AppRecipe
              :rating="fetchRatingForRecipe(recipe.id)"
              :recipe="recipe"
              :loading-app-recipe="loadingAppRecipe"
              :favorite-recipe-id="favoriteRecipeId"
              :image-base-uri="imageBaseUri"
              :is-authenticated="isAuthenticated"
              @remove-favorite="handleDeleteRecipeFavorites"
              @view-recipe-details="handleGetRecipeDetailsById"
              @rating-change="handleRatingChange"
            />
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
      :errorLoadingRecipe="viewDetailsError"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loadingAppRecipe"
      :favorites="favoriteRecipes"
      :image-base-uri="imageBaseUri"
      @on-close="handleModalClose"
      @on-toggle-favorite="handleToggleFavorite"
    />

    <!-- Search History Section -->
    <v-card elevation="2">
      <v-card-title
        class="pa-6 d-flex flex-column flex-sm-row align-center justify-space-between gap-3"
      >
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
            v-for="(search, index) in visibleSearchHistory"
            :key="`search-history-${index}-${search._id}`"
            class="search-history-item pl-0 pr-0"
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
              <div class="d-flex flex-wrap gap-2 align-center mt-1">
                <span v-if="search.cuisine" class="search-param-chip">
                  <v-icon size="x-small" icon="mdi-earth" />
                  {{ search.cuisine }}
                </span>
                <span v-if="search.diet" class="search-param-chip">
                  <v-icon size="x-small" icon="mdi-food-apple" />
                  {{ search.diet }}
                </span>
                <span v-if="search.type" class="search-param-chip">
                  <v-icon size="x-small" icon="mdi-silverware" />
                  {{ search.type }}
                </span>
                <span v-if="search.intolerances" class="search-param-chip">
                  <v-icon size="x-small" icon="mdi-alert-circle" />
                  {{ search.intolerances }}
                </span>
                <span
                  v-if="search.includeIngredients"
                  class="search-param-chip search-param-include"
                >
                  <v-icon size="x-small" icon="mdi-plus-circle" />
                  {{ DASHBOARD.INCLUDE_LABEL }}: {{ search.includeIngredients }}
                </span>
                <span
                  v-if="search.excludeIngredients"
                  class="search-param-chip search-param-exclude"
                >
                  <v-icon size="x-small" icon="mdi-minus-circle" />
                  {{ DASHBOARD.EXCLUDE_LABEL }}: {{ search.excludeIngredients }}
                </span>
                <span v-if="search.maxReadyTime" class="search-param-chip">
                  <v-icon size="x-small" icon="mdi-clock-outline" />
                  ≤{{ search.maxReadyTime }} {{ DASHBOARD.RECIPE_TIME_UNIT }}
                </span>
              </div>
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="searchAgain(search)"
              >
                <v-icon icon="mdi-refresh" />
                <v-tooltip activator="parent" location="top">
                  {{ DASHBOARD.SEARCH_AGAIN_TOOLTIP }}
                </v-tooltip>
              </v-btn>

              <v-btn
                icon
                variant="text"
                size="small"
                color="error"
                @click="handleRemoveSearchHistory(search._id as string)"
              >
                <v-icon icon="mdi-delete" />
                <v-tooltip activator="parent" location="top">
                  {{ DASHBOARD.REMOVE_SEARCH_HISTORY_TOOLTIP }}
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

        <!-- Load More Button -->
        <div v-if="hasMoreSearchHistory" class="text-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            @click="searchHistoryItemsToShow += ITEMS_PER_PAGE"
            prepend-icon="mdi-chevron-down"
          >
            {{ DASHBOARD.LOAD_MORE_BUTTON }}
            {{
              DASHBOARD.LOAD_MORE_REMAINING(
                searchHistory.length - searchHistoryItemsToShow
              )
            }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <RecipesListModal
      :open="isArrayNotEmpty(listOfViewedRecipes)"
      :errorLoadingRecipe="errorViewedRecipes"
      :recipes="listOfViewedRecipes"
      :loading="loadingViewedRecipes"
      :loading-app-recipe="loadingAppRecipe"
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
import { LOADING_CONFIG, DASHBOARD, RECIPE_FINDER } from "@/constants";

// types
import type {
  IRecipe,
  IRecipeDetails,
  IRecipeSearchParams,
  IRecipeRating,
} from "@/types";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "@/utils";

// composables
import { useRecipeRating } from "@/composables/useRecipeRating";

// services
import {
  fetchFavoriteRecipes,
  getViewedRecipesCount,
  fetchViewedRecipes,
  fetchRecipeDetails,
  removeFavoriteRecipe,
  setFavoriteRecipes,
  fetchRecipesSearchHistory,
  removeRecipesSearchHistory,
  getRecipesRatings,
} from "@/services";

// stores
import { useAppStore } from "@/stores";

// components
import AppLoading from "@/components/AppLoading.vue";
import RecipeDetailsModal from "@/components/RecipeDetailsModal.vue";
import RecipesListModal from "@/components/RecipesListModal.vue";
import AppRecipe from "@/components/AppRecipe.vue";

// auth
const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

// router
const router = useRouter();

// store
const appStore = useAppStore();

// composables
const { fetchRatingForRecipe, handleRatingChange } = useRecipeRating();

// state
const favoriteRecipes = ref<IRecipe[]>([]);
const searchHistory = ref<IRecipeSearchParams[]>([]);

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

// pagination
const searchHistoryItemsToShow = ref(10);
const ITEMS_PER_PAGE = 2;

// recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);
const loadingAppRecipe = ref(false);
const favoriteRecipeId = ref<number | null>(null);

// computed
const favoriteCount = computed(() => favoriteRecipes.value.length);
const searchHistoryCount = computed(() => searchHistory.value.length);
const totalRecipesViewedCount = computed(() => totalRecipesViewed.value);
const visibleSearchHistory = computed(() =>
  searchHistory.value.slice(0, searchHistoryItemsToShow.value)
);
const hasMoreSearchHistory = computed(
  () => searchHistory.value.length > searchHistoryItemsToShow.value
);

// methods

const fetchSearchHistoryForRecipes = async () => {
  loadingSearchHistory.value = true;
  searchHistoryError.value = null;

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
        loadingSearchHistory.value = false;
        return;
      }
    }
    const response = await fetchRecipesSearchHistory(token);

    const success = pathOr(false, ["success"], response);
    const history = pathOr([], ["history"], response);

    if (success && isArrayNotEmpty(history)) {
      appStore.setSearchHistory(history);
      searchHistory.value = history;
      // Reset pagination when loading new history
      searchHistoryItemsToShow.value = ITEMS_PER_PAGE;
    } else {
      appStore.setSearchHistory([]);
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load search history";
    searchHistoryError.value = errorMessage;
    console.error("Error loading search history:", err);
  } finally {
    loadingSearchHistory.value = false;
  }
};

const handleRemoveSearchHistory = async (searchId: string) => {
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
    const response = await removeRecipesSearchHistory(searchId, token);
    if (response.success) {
      const updatedHistory = searchHistory.value.filter(
        (s) => s._id !== searchId
      ) as IRecipeSearchParams[];
      searchHistory.value = updatedHistory;
      appStore.setSearchHistory(updatedHistory);

      // Adjust pagination if needed - maintain the same visible count
      if (searchHistoryItemsToShow.value > updatedHistory.length) {
        searchHistoryItemsToShow.value = Math.max(
          ITEMS_PER_PAGE,
          updatedHistory.length
        );
      }
    } else {
      console.error("Failed to remove search history:", response.message);
    }
  } catch (error) {
    console.error("Error removing search history:", error);
  }
};

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
    const response = await fetchFavoriteRecipes(token);

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
  loadingAppRecipe.value = true;
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
    const response = await fetchRecipeDetails(recipe.id, token);
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
    loadingAppRecipe.value = false;
  }
};

// Handler for AppRecipe component which emits recipeId
const handleGetRecipeDetailsById = async (recipeId: number) => {
  const recipe = favoriteRecipes.value.find((r) => r.id === recipeId);
  if (recipe) {
    await handleGetRecipeDetails(recipe);
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
  favoriteRecipeId.value = recipe.id;
  loadingToggleFavorite.value = true;
  loadingAppRecipe.value = true;

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
    loadingAppRecipe.value = false;
  }
};

const handleAddRecipeFavorites = async (recipe: IRecipe) => {
  loadingToggleFavorite.value = true;
  loadingAppRecipe.value = true;
  favoriteRecipeId.value = recipe.id;
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
    loadingAppRecipe.value = false;
  }
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
  loadingAppRecipe.value = false;
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
    const response = await fetchViewedRecipes(token);
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

const searchAgain = (search: IRecipeSearchParams) => {
  const queryParams: Record<string, string> = { q: search.query };
  if (search.cuisine) queryParams.cuisine = search.cuisine;
  if (search.diet) queryParams.diet = search.diet;
  if (search.type) queryParams.type = search.type;
  if (search.intolerances) queryParams.intolerances = search.intolerances;
  if (search.includeIngredients)
    queryParams.includeIngredients = search.includeIngredients;
  if (search.excludeIngredients)
    queryParams.excludeIngredients = search.excludeIngredients;
  if (search.maxReadyTime)
    queryParams.maxReadyTime = search.maxReadyTime.toString();
  router.push({ path: "/", query: queryParams });
};

const handleCloseRecipesListModal = () => {
  listOfViewedRecipes.value = [];
  errorViewedRecipes.value = null;
};

const handleViewRecipeDetails = async (recipe: IRecipe) => {
  loadingAppRecipe.value = true;
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
    const response = await fetchRecipeDetails(recipe.id, token);

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
    loadingAppRecipe.value = false;
  }
};

const fetchRatingsForRecipes = async () => {
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
  try {
    const responseFetchRatings: {
      success: boolean;
      ratings: IRecipeRating[];
      message: string;
    } = await getRecipesRatings(token);
    if (!isNilOrEmpty(responseFetchRatings)) {
      const success = pathOr(false, ["success"], responseFetchRatings);
      if (!success) {
        console.error("Failed to fetch ratings for recipes");
        return;
      }
      const ratings: IRecipeRating[] = pathOr(
        [],
        ["ratings"],
        responseFetchRatings
      );
      if (isArrayNotEmpty(ratings)) {
        appStore.setRecipesRatings(ratings);
      }
    }
  } catch (error) {
    console.error("Error fetching ratings for recipes:", error);
    return [];
  }
};

// lifecycle
onMounted(async () => {
  if (!isArrayNotEmpty(appStore.recipesRatings)) {
    await fetchRatingsForRecipes();
  }
  if (!isArrayNotEmpty(appStore.favoritesRecipes)) {
    await fetchFavorites();
  } else {
    // Initialize from store if already populated
    favoriteRecipes.value = appStore.favoritesRecipes;
  }
  await fetchSearchHistoryForRecipes();
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

.search-history-item {
  transition: background-color 0.2s;
}

.search-history-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.search-param-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
  white-space: nowrap;
}

.search-param-include {
  background-color: rgba(76, 175, 80, 0.1);
  color: rgb(76, 175, 80);
}

.search-param-exclude {
  background-color: rgba(244, 67, 54, 0.1);
  color: rgb(244, 67, 54);
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .profile-card {
    margin-bottom: 1rem;
  }
}
</style>
