<template>
  <div class="dashboard-logged">
    <!-- Welcome Header -->
    <v-card class="mb-8 welcome-card" elevation="2">
      <v-card-text class="pa-8">
        <div class="d-flex align-center gap-4">
          <v-avatar size="80" color="primary">
            <v-icon size="40" icon="mdi-account-circle" />
          </v-avatar>
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Welcome back!</h1>
            <p class="text-h6 text-medium-emphasis">
              Your personalized recipe dashboard
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Favorite Recipes
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

      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Recipes Viewed
                </p>
                <h2 class="text-h4 font-weight-bold">
                  {{ totalRecipesViewed }}
                </h2>
              </div>
              <v-avatar size="56" color="primary" variant="tonal">
                <v-icon size="28" icon="mdi-eye" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Total Searches
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
          <h2 class="text-h5 font-weight-bold">Your Favorite Recipes</h2>
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

        <!-- Recipes Grid -->
        <v-row v-else-if="favoriteRecipes.length > 0">
          <v-col
            v-for="recipe in favoriteRecipes.slice(0, 6)"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="recipe-card h-100" color="white" ripple>
              <v-img
                :src="recipe.image"
                :alt="recipe.title"
                height="200px"
                cover
              >
                <v-chip class="ma-2" color="error" variant="flat" size="small">
                  <v-icon start icon="mdi-heart" size="small" />
                  Favorite
                </v-chip>
              </v-img>
              <v-card-text>
                <h3 class="text-h6 font-weight-bold line-clamp-2 mb-2">
                  {{ recipe.title }}
                </h3>
                <div class="d-flex align-center gap-4 text-caption">
                  <div class="d-flex align-center gap-1">
                    <v-icon size="small" icon="mdi-clock" />
                    {{ recipe.readyInMinutes }} min
                  </div>
                  <div class="d-flex align-center gap-1">
                    <v-icon size="small" icon="mdi-silverware-fork-knife" />
                    {{ recipe.servings }} servings
                  </div>
                </div>
              </v-card-text>
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
          <p class="text-h6 text-medium-emphasis">No favorite recipes yet</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Start exploring and save your favorite recipes
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            to="/"
            prepend-icon="mdi-magnify"
          >
            Discover Recipes
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
            View All {{ favoriteRecipes.length }} Favorites
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Search History Section -->
    <v-card elevation="2">
      <v-card-title class="pa-6 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <v-icon icon="mdi-history" size="large" color="primary" />
          <h2 class="text-h5 font-weight-bold">Recent Search History</h2>
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
                  Search Again
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
          <p class="text-h6 text-medium-emphasis">No search history</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Your recent recipe searches will appear here
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            to="/"
            prepend-icon="mdi-magnify"
          >
            Start Searching
          </v-btn>
        </div>

        <!-- View More Link -->
        <div v-if="searchHistory.length > 10" class="text-center mt-4">
          <v-btn color="primary" variant="text">
            View All {{ searchHistory.length }} Searches
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

// constants
import { LOADING_CONFIG } from "@/constants";

// types
import type { IRecipe } from "@/types";

// services
import { getFavoriteRecipes, getRecipeDetails } from "@/services";

// components

const AppLoading = defineAsyncComponent(
  () => import("@/components/AppLoading.vue")
);

// auth
const { getAccessTokenSilently } = useAuth0();

// router
const router = useRouter();

// state
const favoriteRecipes = ref<IRecipe[]>([]);
const searchHistory = ref<Array<{ query: string; timestamp: string }>>([]);
const loadingFavorites = ref(false);
const loadingSearchHistory = ref(false);
const favoritesError = ref<string | null>(null);
const searchHistoryError = ref<string | null>(null);

// computed
const favoriteCount = computed(() => favoriteRecipes.value.length);
const searchHistoryCount = computed(() => searchHistory.value.length);
const totalRecipesViewed = computed(() => {
  // This could be tracked separately, for now using favorites + searches as proxy
  return favoriteCount.value + searchHistoryCount.value;
});

// methods
const fetchFavorites = async () => {
  loadingFavorites.value = true;
  favoritesError.value = null;

  try {
    const token = await getAccessTokenSilently();
    const response = await getFavoriteRecipes(token);

    if (response.success && response.recipeIds) {
      // Fetch recipe details for each favorite
      const recipeDetailsPromises = response.recipeIds.map((id) =>
        getRecipeDetails(id)
      );

      const recipeDetailsResults = await Promise.allSettled(
        recipeDetailsPromises
      );

      favoriteRecipes.value = recipeDetailsResults
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

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

const searchAgain = (query: string) => {
  router.push({ path: "/", query: { q: query } });
};

// lifecycle
onMounted(() => {
  fetchFavorites();
  fetchSearchHistory();
});
</script>

<style scoped>
.dashboard-logged {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
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
</style>
