<template>
  <v-dialog
    :model-value="open"
    max-width="1200px"
    @update:model-value="$emit('on-close')"
  >
    <v-card class="d-flex flex-column modal-card">
      <v-progress-linear
        indeterminate
        v-if="loadingAppRecipe"
        class="absolute top-0 left-0 w-full"
      ></v-progress-linear>
      <v-card-title
        class="pa-6 d-flex align-center justify-space-between fixed-header"
      >
        <div class="d-flex align-center gap-3">
          <v-icon :icon="icon" size="large" :color="iconColor" />
          <h2 class="text-h5 font-weight-bold">
            {{ title }}
          </h2>
        </div>
        <div class="d-flex align-center gap-2">
          <v-chip v-if="recipes.length > 0" :color="chipColor" variant="flat">
            {{ recipes.length }}
          </v-chip>
          <v-btn icon variant="text" @click="$emit('on-close')">
            <v-icon icon="mdi-close" />
            <v-tooltip activator="parent" location="bottom"> Close </v-tooltip>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6 scrollable-content">
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center pa-8">
          <AppLoading :config="LOADING_CONFIG" />
        </div>

        <v-alert v-else-if="errorLoadingRecipe" type="error" variant="tonal">
          {{ errorLoadingRecipe }}
        </v-alert>

        <!-- Recipes Grid -->
        <v-row v-else-if="recipes.length > 0">
          <v-col
            v-for="recipe in recipes"
            :key="`recipe-${recipe.id}`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <AppRecipe
              :recipe="recipe"
              :rating="fetchRatingForRecipe(recipe.id)"
              :loading-app-recipe="isLoading(recipe)"
              :show-toggle-favorite="true"
              :is-favorited="isFavorited(recipe)"
              :is-authenticated="true"
              :view-recipe-button-label="LABELS.VIEW_RECIPE"
              @toggle-favorite="toggleFavorite"
              @view-recipe-details="handleViewRecipeDetails"
              @rating-change="handleRatingChange"
            />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-else class="text-center pa-8">
          <v-icon
            size="64"
            :icon="emptyIcon"
            color="grey-lighten-1"
            class="mb-4"
          />
          <p class="text-h6 text-medium-emphasis">
            {{ emptyTitle }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ emptyMessage }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from "vue";

// types
import type { IRecipe } from "@/types";

// constants
import {
  LABELS,
  LOADING_CONFIG,
  RECIPE_FINDER,
  FAVORITE_RECIPES,
} from "@/constants";

// components
const AppLoading = defineAsyncComponent(
  () => import("@/components/AppLoading.vue")
);
const AppRecipe = defineAsyncComponent(
  () => import("@/components/AppRecipe.vue")
);

// composables
import { useRecipeRating } from "@/composables/useRecipeRating";

// props
const props = withDefaults(
  defineProps<{
    open: boolean;
    recipes: IRecipe[];
    loading?: boolean;
    loadingAppRecipe: boolean;
    loadingToggleFavorite: boolean;
    favorites?: IRecipe[];
    imageBaseUri?: string;
    icon?: string;
    iconColor?: string;
    title: string;
    chipColor?: string;
    removeButtonText?: string;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyMessage?: string;
    errorLoadingRecipe?: string | null;
  }>(),
  {
    loading: false,
    loadingAppRecipe: false,
    loadingToggleFavorite: false,
    favorites: () => [],
    imageBaseUri: RECIPE_FINDER.IMAGE_BASE_URI,
    icon: "mdi-list",
    iconColor: "primary",
    chipColor: "primary",
    removeButtonText: FAVORITE_RECIPES.REMOVE_BUTTON,
    emptyIcon: "mdi-format-list-text",
    emptyTitle: RECIPE_FINDER.NO_RECIPES_TITLE,
    emptyMessage: RECIPE_FINDER.THE_LIST_IS_EMPTY,
    errorLoadingRecipe: null,
  }
);

// emits
const emit = defineEmits<{
  (e: "on-close"): void;
  (e: "on-view-details", recipe: IRecipe): void;
  (e: "on-toggle-favorite", recipe: IRecipe): void;
}>();

// composables
const { fetchRatingForRecipe, handleRatingChange } = useRecipeRating();

// ref
const favoriteRecipeSelected = ref<IRecipe>();

// methods
const isLoading = (recipe: IRecipe) => {
  return (
    props.loadingToggleFavorite &&
    recipe.id === favoriteRecipeSelected.value?.id
  );
};

const isFavorited = (recipe: IRecipe) => {
  return props.favorites?.find((fav) => fav.id === recipe.id) !== undefined;
};

const toggleFavorite = (recipe: IRecipe) => {
  favoriteRecipeSelected.value = recipe;
  emit("on-toggle-favorite", recipe);
};

const handleViewDetails = (recipe: IRecipe) => {
  emit("on-view-details", recipe);
};

// Wrapper to convert recipeId to recipe object for AppRecipe emit
const handleViewRecipeDetails = (recipeId: number) => {
  const recipe = props.recipes.find((r) => r.id === recipeId);
  if (recipe) {
    handleViewDetails(recipe);
  }
};
</script>

<style scoped>
.modal-card {
  max-height: 90vh;
}

.fixed-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.scrollable-content {
  overflow-y: auto;
  flex: 1;
}
</style>
