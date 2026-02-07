<template>
  <v-dialog
    :model-value="open"
    max-width="1200px"
    @update:model-value="$emit('close')"
  >
    <v-card class="d-flex flex-column modal-card">
      <v-progress-linear
        indeterminate
        v-if="loadingForDetails"
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
          <v-btn icon variant="text" @click="$emit('close')">
            <v-icon icon="mdi-close" />
            <v-tooltip activator="parent" location="bottom">
              {{ RECIPE_MODAL.CLOSE_BUTTON }}
            </v-tooltip>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6 scrollable-content">
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center pa-8">
          <AppLoading :config="LOADING_CONFIG" />
        </div>

        <!-- Recipes Grid -->
        <v-row v-else-if="recipes.length > 0">
          <v-col
            v-for="recipe in recipes"
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
                  @click.stop="toggleFavorite(recipe.id)"
                  :color="isFavorited(recipe.id) ? 'error' : 'default'"
                  class="save-btn"
                  :loading="loadingToggleFavorite && recipe.id == recipeId"
                >
                  <v-icon
                    :icon="
                      isFavorited(recipe.id) ? 'mdi-heart' : 'mdi-heart-outline'
                    "
                  />
                </v-btn>
                <v-btn
                  variant="elevated"
                  color="primary"
                  size="large"
                  @click.stop="handleViewDetails(recipe.id)"
                  class="view-recipe-btn grow"
                  append-icon="mdi-arrow-right"
                >
                  {{ LABELS.VIEW_RECIPE }}
                </v-btn>
              </v-card-actions>
            </v-card>
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

// Constants
const RECIPE_MODAL = RECIPE_FINDER.RECIPE_MODAL;

// props
const props = withDefaults(
  defineProps<{
    open: boolean;
    recipes: IRecipe[];
    loading?: boolean;
    loadingForDetails: boolean;
    loadingToggleFavorite: boolean;
    favorites?: number[];
    imageBaseUri?: string;
    icon?: string;
    iconColor?: string;
    title: string;
    chipColor?: string;
    removeButtonText?: string;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyMessage?: string;
  }>(),
  {
    loading: false,
    loadingForDetails: false,
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
  }
);

// emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "view-details", recipeId: number): void;
  (e: "favorite-toggle", recipeId: number): void;
}>();

// state
const recipeId = ref<number | null>(null);

// methods
const getImageUrl = (imageSrc: string): string => {
  if (!imageSrc) return "";
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${props.imageBaseUri}${imageSrc}`;
};

const isFavorited = (recipeId: number) => {
  return props.favorites.includes(recipeId);
};

const handleViewDetails = (id: number) => {
  recipeId.value = id;
  emit("view-details", id);
};

const toggleFavorite = (id: number) => {
  recipeId.value = id;
  emit("favorite-toggle", id);
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

.remove-btn:active {
  transform: scale(0.95);
}

.view-recipe-btn {
  transition: all 0.2s ease-in-out;
}
</style>
