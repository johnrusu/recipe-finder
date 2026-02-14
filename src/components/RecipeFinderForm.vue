<template>
  <div class="recipe-finder-form mt-4 mb-12">
    <div class="d-flex align-center justify-center gap-3 mb-8">
      <v-icon icon="mdi-food-variant" size="x-large" color="primary" />
      <h1 class="text-2xl sm:text-4xl font-bold text-center">
        {{ RECIPE_FINDER.TITLE }}
      </h1>
    </div>
    <v-card>
      <v-card-text class="px-6 py-8 relative!">
        <!-- Main Search Bar -->
        <v-row class="mb-4">
          <v-col cols="12">
            <RecipeAutocomplete
              :loading="loadingAutocomplete"
              @item-selected="
                (data) =>
                  handleAutoCompleteItemSelected(
                    data as {
                      title: string;
                      suggestion: IAutocompleteSuggestion;
                    }
                  )
              "
              :suggestions-autocomplete="suggestionsAutocomplete"
              v-model="searchQuery"
              :placeholder="`${xs ? '' : RECIPE_FINDER.SEARCH_PLACEHOLDER}`"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              class="search-field"
              @keyup.enter="handleSearch"
              @update:model-value="debouncedAutoCompleteSearch"
              @click:clear="handleClearBtnInput"
            >
              <template v-slot:append-inner>
                <v-btn
                  color="primary"
                  @click="handleSearch"
                  :loading="loadingRecipes"
                >
                  {{ RECIPE_FINDER.SEARCH_BUTTON }}
                  <v-icon end icon="mdi-arrow-right" />
                </v-btn>
              </template>
            </RecipeAutocomplete>
          </v-col>
        </v-row>

        <!-- Quick Filters -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-filter-variant" size="20" class="mr-2" />
              <span class="text-subtitle-1 font-weight-medium">{{
                RECIPE_FINDER.QUICK_FILTERS_TITLE
              }}</span>
              <v-spacer />
              <v-btn
                v-if="hasActiveFilters"
                variant="text"
                size="small"
                color="error"
                @click="clearFilters"
              >
                {{ RECIPE_FINDER.CLEAR_ALL }}
              </v-btn>
            </div>

            <v-chip-group
              v-model="selectedMealType"
              selected-class="text-primary"
              column
            >
              <v-chip
                v-for="meal in mealTypes"
                :key="meal.value"
                :value="meal.value"
                variant="outlined"
                filter
                :prepend-icon="meal.icon"
              >
                {{ meal.label }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Advanced Filters Toggle -->
        <v-row>
          <v-col cols="12">
            <v-btn
              variant="text"
              @click="showAdvanced = !showAdvanced"
              block
              class="mb-4"
            >
              <v-icon icon="mdi-tune" class="mr-2" />
              {{
                showAdvanced
                  ? RECIPE_FINDER.HIDE_ADVANCED
                  : RECIPE_FINDER.SHOW_ADVANCED
              }}
              <v-icon
                :icon="showAdvanced ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                end
              />
            </v-btn>

            <v-expand-transition>
              <div v-show="showAdvanced">
                <v-divider class="mb-6" />

                <!-- Cuisine Selection -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedCuisine"
                      :items="cuisines"
                      :label="RECIPE_FINDER.CUISINE_LABEL"
                      prepend-inner-icon="mdi-earth"
                      variant="outlined"
                      clearable
                      chips
                      multiple
                      closable-chips
                      hide-details
                    />
                  </v-col>
                </v-row>

                <!-- Dietary Restrictions -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">
                      {{ RECIPE_FINDER.DIETARY_PREFERENCES_TITLE }}
                    </div>
                    <v-chip-group v-model="dietaryPreferences" column multiple>
                      <v-chip
                        v-for="diet in dietaryOptions"
                        :key="diet.value"
                        :value="diet.value"
                        variant="outlined"
                        filter
                        :color="diet.color"
                      >
                        {{ diet.label }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                </v-row>

                <!-- Intolerances -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">
                      {{ RECIPE_FINDER.INTOLERANCES_TITLE }}
                    </div>
                    <v-chip-group v-model="intolerances" column multiple>
                      <v-chip
                        v-for="intolerance in intoleranceOptions"
                        :key="intolerance.value"
                        :value="intolerance.value"
                        variant="outlined"
                        filter
                        color="error"
                      >
                        {{ intolerance.label }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                </v-row>

                <!-- Cooking Time Slider -->
                <v-row class="mb-4">
                  <v-col cols="12">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-subtitle-2">{{
                        RECIPE_FINDER.MAX_COOKING_TIME_LABEL
                      }}</span>
                      <v-chip size="small" color="primary">
                        {{
                          maxCookingTime === 120
                            ? RECIPE_FINDER.TIME_2PLUS_HOURS
                            : RECIPE_FINDER.TIME_MINUTES(maxCookingTime)
                        }}
                      </v-chip>
                    </div>
                    <v-slider
                      v-model="maxCookingTime"
                      :min="10"
                      :max="120"
                      :step="5"
                      thumb-label
                      color="primary"
                      track-color="grey-lighten-2"
                      hide-details
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-clock-fast" />
                      </template>
                      <template v-slot:append>
                        <v-icon icon="mdi-clock" />
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>

                <!-- Ingredients to Include/Exclude -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-combobox
                      v-model="includeIngredients"
                      :label="RECIPE_FINDER.INCLUDE_INGREDIENTS_LABEL"
                      prepend-inner-icon="mdi-plus-circle"
                      variant="outlined"
                      chips
                      multiple
                      closable-chips
                      :hint="RECIPE_FINDER.INGREDIENTS_HINT"
                      persistent-hint
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-combobox
                      v-model="excludeIngredients"
                      :label="RECIPE_FINDER.EXCLUDE_INGREDIENTS_LABEL"
                      prepend-inner-icon="mdi-minus-circle"
                      variant="outlined"
                      chips
                      multiple
                      closable-chips
                      :hint="RECIPE_FINDER.INGREDIENTS_HINT"
                      persistent-hint
                      color="error"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mt-6">
          <v-col cols="12" md="6" class="d-flex justify-center justify-md-end">
            <v-btn
              size="x-large"
              color="primary"
              variant="elevated"
              rounded="lg"
              :loading="loadingRecipes"
              @click="handleSearch"
              prepend-icon="mdi-magnify"
              block
              class="action-btn"
              type="button"
            >
              {{ RECIPE_FINDER.FIND_RECIPES_BUTTON }}
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex justify-center justify-md-start"
          >
            <v-btn
              size="x-large"
              color="secondary"
              variant="tonal"
              rounded="lg"
              prepend-icon="mdi-dice-5"
              @click="handleRandomRecipes"
              :loading="loadingRecipes"
              block
              class="action-btn"
              type="button"
            >
              {{ RECIPE_FINDER.SURPRISE_ME_BUTTON }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Error Alert -->
        <v-row v-if="error" class="mt-4">
          <v-col cols="12">
            <v-alert
              type="error"
              variant="tonal"
              closable
              @click:close="error = null"
            >
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="loadingRecipes && !error" class="mt-6">
          <v-col cols="12" class="justify-center flex">
            <AppLoading :config="LOADING_CONFIG" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- No Results Message -->
    <v-card
      v-if="
        searchResults.length === 0 &&
        !loadingRecipes &&
        !error &&
        lastSearchParams
      "
      class="mt-6"
    >
      <v-card-text class="py-8">
        <div class="text-h4 mb-4">{{ RECIPE_FINDER.NO_RESULTS_TITLE }}</div>
        <div class="text-body-1 text-medium-emphasis mb-6">
          {{ RECIPE_FINDER.NO_RESULTS_MESSAGE }}
        </div>
        <v-divider class="my-6" />
        <div class="text-h6 mb-4">
          {{ RECIPE_FINDER.NO_RESULTS_SUGGESTIONS }}
        </div>
        <v-list bg-color="transparent">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-lightbulb-on</v-icon>
            </template>
            <v-list-item-title>{{
              RECIPE_FINDER.NO_RESULTS_TIP_1
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-filter-remove</v-icon>
            </template>
            <v-list-item-title>{{
              RECIPE_FINDER.NO_RESULTS_TIP_2
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-spellcheck</v-icon>
            </template>
            <v-list-item-title>{{
              RECIPE_FINDER.NO_RESULTS_TIP_3
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-dice-5</v-icon>
            </template>
            <v-list-item-title>{{
              RECIPE_FINDER.NO_RESULTS_TIP_4
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Search Results Header -->
    <div
      v-if="searchResults.length > 0"
      class="d-flex align-center justify-center mb-6 mt-12"
    >
      <div class="d-flex align-center gap-3">
        <v-icon icon="mdi-check-circle" size="x-large" color="success" />
        <h2 class="text-h4 font-weight-bold">
          {{
            RECIPE_FINDER.SEARCH_RESULTS_HEADER(
              searchResults.length,
              totalResults
            )
          }}
        </h2>
      </div>
    </div>

    <!-- Search Results Card -->
    <v-card
      v-if="searchResults.length > 0"
      class="search-results-card"
      ref="searchResultsCard"
    >
      <v-card-text class="p-6! relative!">
        <v-row class="mt-0">
          <v-col cols="12">
            <v-row>
              <v-col
                v-for="recipe in searchResults"
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
                      {{ recipe.readyInMinutes }} {{ RECIPE_MODAL.TIME_UNIT }}
                    </div>
                    <div class="d-flex align-center gap-2 text-caption">
                      <v-icon size="small" icon="mdi-silverware-fork-knife" />
                      {{ recipe.servings }} {{ RECIPE_MODAL.SERVINGS_LABEL }}
                    </div>
                  </v-card-text>
                  <v-card-actions class="pt-0 d-flex gap-2">
                    <v-btn
                      icon
                      @click.stop="toggleFavorite(recipe)"
                      :color="isFavorited(recipe) ? 'error' : 'default'"
                      class="save-btn"
                      :loading="loading && recipe.id == favoriteRecipeId"
                    >
                      <v-icon
                        :icon="
                          isFavorited(recipe)
                            ? 'mdi-heart'
                            : 'mdi-heart-outline'
                        "
                      />
                      <v-tooltip activator="parent" location="top">
                        {{
                          !isAuthenticated
                            ? RECIPE_FINDER.LOGIN_REQUIRED_TOOLTIP
                            : isFavorited(recipe)
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
            <v-infinite-scroll
              v-if="hasMoreResults && !isRandomSearch"
              @load="handleInfiniteScroll"
              :height="400"
            >
              <template #loading>
                <div class="d-flex justify-center pa-4">
                  <AppLoading :config="LOADING_CONFIG" />
                </div>
              </template>
            </v-infinite-scroll>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Recipe Details Modal Component -->
    <RecipeDetailsModal
      :open="showRecipeModal"
      :recipe="selectedRecipeDetails"
      :isAddingFavorites="loading"
      :favorites="favorites"
      :image-base-uri="imageBaseUri"
      @on-close="handleModalClose"
      @on-toggle-favorite="toggleFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, nextTick } from "vue";
import { pathOr } from "ramda";
import { useDisplay } from "vuetify";

// state
import { useAppStore } from "@/stores";

// types
import type {
  IRecipe,
  IRecipeSearchParams,
  IRecipeDetails,
  IAutocompleteSuggestion,
} from "@/types";

// constants
import {
  RECIPE_FINDER,
  LOADING_CONFIG,
  AUTOCOMPLETE_NUMBER,
} from "@/constants";

// services
import {
  searchRecipes,
  getRandomRecipes,
  getRecipeDetails,
  setFavoriteRecipes,
  removeFavoriteRecipe,
  autoCompleteRecipeSearch,
  setRecipesSearchHistory,
} from "@/services";
import { isArrayNotEmpty, isNilOrEmpty, debounce } from "@/utils";

// components
const RecipeAutocomplete = defineAsyncComponent(
  () => import("./RecipeAutocomplete.vue")
);
const AppLoading = defineAsyncComponent(() => import("./AppLoading.vue"));
const RecipeDetailsModal = defineAsyncComponent(
  () => import("./RecipeDetailsModal.vue")
);

// auth
import { useAuth0 } from "@auth0/auth0-vue";

// State
const searchQuery = ref("");
const selectedMealType = ref<string | null>(null);
const selectedCuisine = ref<string[]>([]);
const dietaryPreferences = ref<string[]>([]);
const intolerances = ref<string[]>([]);
const maxCookingTime = ref(60);
const includeIngredients = ref<string[]>([]);
const excludeIngredients = ref<string[]>([]);
const showAdvanced = ref(false);
const loading = ref(false);
const loadingRecipes = ref(false);
const favoriteRecipeId = ref<number | null>(null);
const loadingAutocomplete = ref<boolean>(false);
const error = ref<string | null>(null);
const searchResults = ref<IRecipe[]>([]);
const imageBaseUri = ref(RECIPE_FINDER.IMAGE_BASE_URI);
const favorites = ref<IRecipe[]>([]);
const suggestionsAutocomplete = ref<IAutocompleteSuggestion[]>([]);

// Recipe details modal state
const showRecipeModal = ref(false);
const selectedRecipeDetails = ref<IRecipeDetails | null>(null);

// Pagination state
const searchResultsCard = ref<any>(null);
const currentOffset = ref(0);
const currentNumber = ref(10);
const totalResults = ref(0);
const isRandomSearch = ref(false);
const hasMoreResults = computed(
  () =>
    !isRandomSearch.value &&
    currentOffset.value + currentNumber.value < totalResults.value
);
const lastSearchParams = ref<IRecipeSearchParams | null>(null);

// hooks
const appStore = useAppStore();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

// constants
const RECIPE_MODAL = RECIPE_FINDER.RECIPE_MODAL;

const { xs } = useDisplay();

// Data
const mealTypes = [
  {
    label: RECIPE_FINDER.MEAL_TYPES.BREAKFAST,
    value: "breakfast",
    icon: "mdi-coffee",
  },
  {
    label: RECIPE_FINDER.MEAL_TYPES.LUNCH,
    value: "lunch",
    icon: "mdi-food-apple",
  },
  {
    label: RECIPE_FINDER.MEAL_TYPES.DINNER,
    value: "dinner",
    icon: "mdi-silverware-fork-knife",
  },
  { label: RECIPE_FINDER.MEAL_TYPES.SNACK, value: "snack", icon: "mdi-cookie" },
  {
    label: RECIPE_FINDER.MEAL_TYPES.DESSERT,
    value: "dessert",
    icon: "mdi-cupcake",
  },
];

const cuisines = RECIPE_FINDER.CUISINES;

const dietaryOptions = [
  {
    label: RECIPE_FINDER.DIETARY.VEGETARIAN,
    value: "vegetarian",
    color: "green",
  },
  {
    label: RECIPE_FINDER.DIETARY.VEGAN,
    value: "vegan",
    color: "green-darken-2",
  },
  {
    label: RECIPE_FINDER.DIETARY.GLUTEN_FREE,
    value: "gluten free",
    color: "amber",
  },
  { label: RECIPE_FINDER.DIETARY.KETO, value: "ketogenic", color: "purple" },
  { label: RECIPE_FINDER.DIETARY.PALEO, value: "paleo", color: "orange" },
  {
    label: "Pescetarian",
    value: "pescetarian",
    color: "blue-darken-1",
  },
  {
    label: "Primal",
    value: "primal",
    color: "red-darken-1",
  },
  {
    label: "Whole30",
    value: "whole30",
    color: "indigo",
  },
];

const intoleranceOptions = [
  { label: "Dairy", value: "dairy" },
  { label: "Egg", value: "egg" },
  { label: "Gluten", value: "gluten" },
  { label: "Grain", value: "grain" },
  { label: "Peanut", value: "peanut" },
  { label: "Seafood", value: "seafood" },
  { label: "Sesame", value: "sesame" },
  { label: "Shellfish", value: "shellfish" },
  { label: "Soy", value: "soy" },
  { label: "Sulfite", value: "sulfite" },
  { label: "Tree Nut", value: "tree nut" },
  { label: "Wheat", value: "wheat" },
];

// Computed
const hasActiveFilters = computed(() => {
  return (
    selectedMealType.value !== null ||
    selectedCuisine.value.length > 0 ||
    dietaryPreferences.value.length > 0 ||
    intolerances.value.length > 0 ||
    maxCookingTime.value !== 60 ||
    includeIngredients.value.length > 0 ||
    excludeIngredients.value.length > 0
  );
});

// Methods
const handleClearBtnInput = () => {
  searchQuery.value = "";
  suggestionsAutocomplete.value = [];
};

const handleAutoCompleteItemSelected = (data: {
  title: string;
  suggestion: IAutocompleteSuggestion;
}) => {
  searchQuery.value = data.title;

  // If suggestion has an ID (from Spoonacular autocomplete), fetch that specific recipe
  if (data.suggestion?.id) {
    handleGetRecipeDetails(data.suggestion.id);
  } else {
    // Otherwise, do a regular search
    handleSearch();
  }
};

const handleAutoCompleteSearch = async () => {
  loadingAutocomplete.value = true;
  if (isNilOrEmpty(searchQuery.value)) {
    loadingAutocomplete.value = false;
    return;
  }
  const suggestions = await autoCompleteRecipeSearch(
    searchQuery.value,
    AUTOCOMPLETE_NUMBER
  );
  if (!isNilOrEmpty(suggestions)) {
    loadingAutocomplete.value = false;
    const success: boolean = pathOr(false, ["success"], suggestions);
    const suggestionsList: IAutocompleteSuggestion[] = pathOr(
      [],
      ["suggestions"],
      suggestions
    );
    if (success && isArrayNotEmpty(suggestionsList)) {
      suggestionsAutocomplete.value = suggestionsList;
    }
  }
  loadingAutocomplete.value = false;
};

// Debounced version for autocomplete (300ms delay)
const debouncedAutoCompleteSearch = debounce(handleAutoCompleteSearch, 300);

const getImageUrl = (imageSrc: string): string => {
  // If it's already a full URL (starts with http), return as-is
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  // Otherwise, prepend the base URI
  return `${imageBaseUri.value}${imageSrc}`;
};

const handleSearch = async () => {
  // Validate search query
  if (!searchQuery.value.trim()) {
    error.value = RECIPE_FINDER.ERROR_EMPTY_QUERY;
    return;
  }

  // Reset pagination state
  currentOffset.value = 0;
  totalResults.value = 0;
  searchResults.value = [];
  isRandomSearch.value = false;

  loadingRecipes.value = true;
  error.value = null;

  try {
    // Build filter parameters
    const params: IRecipeSearchParams = {
      query: searchQuery.value,
      number: currentNumber.value,
      offset: 0,
    };

    // Add optional filters
    if (selectedMealType.value) {
      params.type = selectedMealType.value;
    }

    if (selectedCuisine.value.length > 0) {
      params.cuisine = selectedCuisine.value.join(",");
    }

    if (dietaryPreferences.value.length > 0) {
      params.diet = dietaryPreferences.value.join(",");
    }

    if (intolerances.value.length > 0) {
      params.intolerances = intolerances.value.join(",");
    }

    if (maxCookingTime.value < 120) {
      params.maxReadyTime = maxCookingTime.value;
    }

    if (includeIngredients.value.length > 0) {
      params.includeIngredients = includeIngredients.value.join(",");
    }

    if (excludeIngredients.value.length > 0) {
      params.excludeIngredients = excludeIngredients.value.join(",");
    }

    if (isAuthenticated.value) {
      try {
        const token = await getAccessTokenSilently();
        const response = await setRecipesSearchHistory(params, token);
        if (!response.success) {
          console.error(
            "Failed to add search query to history:",
            response.message
          );
        }
      } catch (error) {
        console.error("Error adding search query to history:", error);
      }
    }

    // Store search params for pagination
    lastSearchParams.value = params;
    const response = await searchRecipes(params);

    if (response.success && response.recipes.results) {
      searchResults.value = response.recipes.results;
      appStore.setRecipes(response.recipes.results);
      totalResults.value = response.recipes.totalResults || 0;
      currentOffset.value = response.recipes.offset || 0;
      // Store the base URI for image URLs
      if (response.recipes.baseUri) {
        imageBaseUri.value = response.recipes.baseUri;
      }
    } else {
      error.value = RECIPE_FINDER.ERROR_NO_RESULTS;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_SEARCH_FAILED;
    error.value = errorMessage;
    console.error("Search error:", err);
  } finally {
    loadingRecipes.value = false;
  }
};

const handleRandomRecipes = async () => {
  loadingRecipes.value = true;
  error.value = null;
  searchResults.value = [];
  isRandomSearch.value = true;

  try {
    const response = await getRandomRecipes(50);

    if (response.success && response.recipes.results) {
      searchResults.value = response.recipes.results;
      appStore.setRecipes(response.recipes.results);
      totalResults.value =
        response.recipes.totalResults || response.recipes.results.length;
      currentOffset.value = 0;
      // Store the base URI for image URLs
      if (response.recipes.baseUri) {
        imageBaseUri.value = response.recipes.baseUri;
      }

      // Wait for DOM to update then scroll to results
      await nextTick();
      // Add small delay to ensure v-if has fully rendered the card
      setTimeout(() => {
        const el = searchResultsCard.value?.$el as HTMLElement;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      error.value = RECIPE_FINDER.ERROR_NO_RESULTS;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_SEARCH_FAILED;
    error.value = errorMessage;
    console.error("Random recipe error:", err);
  } finally {
    loadingRecipes.value = false;
  }
};

const handleInfiniteScroll = async ({ done }: any) => {
  // Check if there are more results and we have stored search params
  if (
    !hasMoreResults.value ||
    !lastSearchParams.value ||
    isRandomSearch.value
  ) {
    done("empty");
    return;
  }

  try {
    // Increment offset for next page
    const nextOffset = currentOffset.value + currentNumber.value;
    const searchParams = {
      ...lastSearchParams.value,
      offset: nextOffset,
      number: currentNumber.value,
    };

    const response = await searchRecipes(searchParams);

    if (response.success && response.recipes.results) {
      // Append new results to existing ones
      searchResults.value.push(...response.recipes.results);
      appStore.setRecipes(searchResults.value);
      currentOffset.value = response.recipes.offset || nextOffset;
      totalResults.value = response.recipes.totalResults || 0;
      done("ok");
    } else {
      done("error");
    }
  } catch (err) {
    console.error("Infinite scroll error:", err);
    error.value = "Failed to load more recipes. Please try again.";
    done("error");
  }
};

const handleGetRecipeDetails = async (recipeId: number) => {
  loading.value = true;
  error.value = null;
  showRecipeModal.value = true;

  try {
    let token = "";
    // Only attempt to get token if explicitly authenticated
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
    const response = await getRecipeDetails(recipeId, token);

    if (response.success && response.recipe) {
      selectedRecipeDetails.value = response.recipe as IRecipeDetails;
    } else {
      error.value = RECIPE_FINDER.ERROR_RECIPE_NOT_FOUND;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : RECIPE_FINDER.ERROR_FETCHING_RECIPE;
    // Don't show Auth0 errors to users - they can still view recipes without being logged in
    if (
      errorMessage.includes("Missing Refresh Token") ||
      errorMessage.includes("missing_refresh_token")
    ) {
      console.warn("Auth0 session issue:", err);
      error.value = null; // Don't show error to user
    } else {
      error.value = errorMessage;
    }
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
  const alreadyFavorited = isFavorited(recipe);
  if (alreadyFavorited) {
    handleDeleteRecipeFavorites(recipe);
  } else {
    handleAddRecipeFavorites(recipe);
  }
  favoriteRecipeId.value = recipe.id;
};

const clearFilters = () => {
  selectedMealType.value = null;
  selectedCuisine.value = [];
  dietaryPreferences.value = [];
  intolerances.value = [];
  maxCookingTime.value = 60;
  includeIngredients.value = [];
  excludeIngredients.value = [];
  searchQuery.value = "";
  searchResults.value = [];
  appStore.setRecipes([]);
  error.value = null;
};

const handleModalClose = () => {
  showRecipeModal.value = false;
  selectedRecipeDetails.value = null;
};

const isFavorited = (recipe: IRecipe) => {
  return favorites.value.some((fav) => fav.id === recipe.id) !== undefined;
};

const recipesFromState = computed(() => appStore.recipes);
if (isArrayNotEmpty(recipesFromState.value)) {
  searchResults.value = recipesFromState.value;
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  color: white;
}

:deep(.v-chip) {
  transition: all 0.2s ease;
}

:deep(.v-chip:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.v-slider__thumb) {
  transition: all 0.2s ease;
}

:deep(.v-slider__thumb:hover) {
  transform: scale(1.2);
}

@media (min-width: 960px) {
  .action-btn {
    max-width: 300px;
  }
}

.save-btn {
  transition: all 0.2s ease;
}

.save-btn:hover {
  transform: scale(1.2);
}

.recipe-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
</style>
