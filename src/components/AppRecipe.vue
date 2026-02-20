<template>
  <v-card class="h-100 d-flex flex-column recipe-card" color="white" ripple>
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
      <div class="d-flex align-center gap-2 mt-2">
        <v-rating
          :hover="showRatingHover"
          size="small"
          :model-value="rating"
          :readonly="!isAuthenticated && readonlyRating"
          :length="5"
          color="warning"
          active-color="warning"
          density="compact"
          @update:model-value="handleRatingChange"
          v-tooltip="showRatingTooltip"
        >
        </v-rating>
      </div>
    </v-card-text>
    <v-card-actions class="pt-0 d-flex gap-2">
      <!-- Remove Favorite Button -->
      <v-btn
        v-if="!showToggleFavorite"
        icon
        @click.stop="handleRemoveFavorite(recipe)"
        color="error"
        class="remove-btn"
        :loading="loadingAppRecipe && recipe.id == favoriteRecipeId"
      >
        <v-icon icon="mdi-heart-off" />
        <v-tooltip activator="parent" location="top">
          {{ FAVORITE_RECIPES_LABELS.REMOVE_BUTTON }}
        </v-tooltip>
      </v-btn>

      <!-- Toggle Favorite Button -->
      <v-btn
        v-else
        icon
        @click.stop="handleToggleFavorite(recipe)"
        :color="isFavorited ? 'error' : 'default'"
        class="save-btn"
        :loading="loadingAppRecipe && recipe.id === favoriteRecipeId"
      >
        <v-icon :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" />
        <v-tooltip activator="parent" location="top">
          {{
            !isAuthenticated
              ? loginRequiredTooltip
              : isFavorited
                ? favoriteTooltip
                : unfavoriteTooltip
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
        {{ RECIPE_FINDER_LABELS.VIEW_RECIPE_BUTTON }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { IRecipe } from "@/types";
import { RECIPE_FINDER, FAVORITE_RECIPES } from "@/constants";

// Props
interface Props {
  recipe: IRecipe;
  loadingAppRecipe?: boolean;
  favoriteRecipeId?: number | null;
  timeUnit?: string;
  servingsLabel?: string;
  removeButtonLabel?: string;
  viewRecipeButtonLabel?: string;
  imageBaseUri?: string;
  // Toggle favorite  button props
  showToggleFavorite?: boolean;
  isFavorited?: boolean;
  isAuthenticated?: boolean;
  favoriteTooltip?: string;
  unfavoriteTooltip?: string;
  loginRequiredTooltip?: string;
  // rating props
  rateRecipesRequiredTooltip?: string;
  rating?: number;
  readonlyRating?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loadingAppRecipe: false,
  favoriteRecipeId: null,
  timeUnit: RECIPE_FINDER.RECIPE_MODAL.TIME_UNIT,
  servingsLabel: RECIPE_FINDER.RECIPE_MODAL.SERVINGS_LABEL,
  removeButtonLabel: FAVORITE_RECIPES.REMOVE_BUTTON,
  viewRecipeButtonLabel: RECIPE_FINDER.VIEW_RECIPE_BUTTON,
  imageBaseUri: RECIPE_FINDER.IMAGE_BASE_URI,
  showToggleFavorite: false,
  isFavorited: false,
  isAuthenticated: false,
  favoriteTooltip: RECIPE_FINDER.SAVED_RECIPE_TOOLTIP,
  unfavoriteTooltip: RECIPE_FINDER.SAVE_RECIPE_TOOLTIP,
  loginRequiredTooltip: RECIPE_FINDER.LOGIN_REQUIRED_TOOLTIP,
  rateRecipesRequiredTooltip: RECIPE_FINDER.RATE_RECIPES_REQUIRED_TOOLTIP,
  rating: 0,
  readonlyRating: false,
});

// Computed values for template
const RECIPE_MODAL = computed(() => ({
  TIME_UNIT: props.timeUnit,
  SERVINGS_LABEL: props.servingsLabel,
}));

const FAVORITE_RECIPES_LABELS = computed(() => ({
  REMOVE_BUTTON: props.removeButtonLabel,
}));

const RECIPE_FINDER_LABELS = computed(() => ({
  VIEW_RECIPE_BUTTON: props.viewRecipeButtonLabel,
}));

const showRatingTooltip = computed(() =>
  props.isAuthenticated ? "" : props.rateRecipesRequiredTooltip
);

const showRatingHover = computed(() => props.isAuthenticated);

// Emits
const emit = defineEmits<{
  removeFavorite: [recipe: IRecipe];
  viewRecipeDetails: [recipeId: number];
  ratingChange: [recipeId: string | number, rating: number];
  toggleFavorite: [recipe: IRecipe];
}>();

// Helper function to get image URL
const getImageUrl = (imageSrc: string): string => {
  if (!imageSrc) {
    return "";
  }
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${props.imageBaseUri}${imageSrc}`;
};

// Event handlers
const handleRemoveFavorite = (recipe: IRecipe) => {
  emit("removeFavorite", recipe);
};

const handleToggleFavorite = (recipe: IRecipe) => {
  emit("toggleFavorite", recipe);
};

const handleGetRecipeDetails = (recipeId: number) => {
  emit("viewRecipeDetails", recipeId);
};

const handleRatingChange = (newRating: string | number) => {
  if (!props.isAuthenticated) {
    return;
  }
  const ratingValue =
    typeof newRating === "string" ? parseFloat(newRating) : newRating;
  emit("ratingChange", props.recipe.id, ratingValue);
};
</script>

<style scoped>
.recipe-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
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
