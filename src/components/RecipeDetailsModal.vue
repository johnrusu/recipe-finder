<template>
  <v-dialog
    v-model="isOpen"
    max-width="800"
    scrollable
    @update:model-value="$emit('close')"
    :persistent="!recipe"
  >
    <v-card class="recipe-modal">
      <template v-if="recipe">
        <!-- Header Image -->
        <v-img
          :src="getImageUrl(recipe.image)"
          :alt="recipe.title"
          height="300px"
          cover
        />

        <!-- Card Content -->
        <v-card-text class="pa-6">
          <!-- Title -->
          <h2 class="text-h4 font-weight-bold mb-2">
            {{ recipe.title }}
          </h2>

          <!-- Info Chips -->
          <div class="d-flex flex-wrap gap-2 mb-6">
            <v-chip
              v-if="recipe.readyInMinutes"
              prepend-icon="mdi-clock"
              color="primary"
              variant="tonal"
            >
              {{ recipe.readyInMinutes }} min
            </v-chip>
            <v-chip
              v-if="recipe.servings"
              prepend-icon="mdi-silverware-fork-knife"
              color="success"
              variant="tonal"
            >
              {{ recipe.servings }} servings
            </v-chip>
            <v-chip
              v-if="recipe.healthScore"
              prepend-icon="mdi-heart"
              color="error"
              variant="tonal"
            >
              Health: {{ recipe.healthScore }}
            </v-chip>
          </div>

          <!-- Summary -->
          <div v-if="recipe.summary" class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-2">
              {{ RECIPE_MODAL.SUMMARY_TITLE }}
            </h3>
            <div class="text-body2" v-html="recipe.summary"></div>
          </div>

          <v-divider class="mb-6" />

          <!-- Ingredients -->
          <div v-if="recipe.extendedIngredients?.length" class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-3">
              {{ RECIPE_MODAL.INGREDIENTS_TITLE }}
            </h3>
            <v-list>
              <v-list-item
                v-for="(ingredient, index) in recipe.extendedIngredients"
                :key="index"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-check-circle" color="success" />
                </template>
                <v-list-item-title>
                  {{ ingredient.original }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <v-divider class="mb-6" />

          <!-- Instructions -->
          <div v-if="recipe.instructions" class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-3">
              {{ RECIPE_MODAL.INSTRUCTIONS_TITLE }}
            </h3>
            <div class="text-body2" v-html="recipe.instructions"></div>
          </div>

          <!-- Source Link -->
          <div v-if="recipe.sourceUrl" class="d-flex gap-2">
            <v-btn
              color="primary"
              variant="elevated"
              prepend-icon="mdi-open-in-new"
              :href="recipe.sourceUrl"
              target="_blank"
              block
            >
              {{ RECIPE_MODAL.VIEW_FULL_RECIPE }}
            </v-btn>
          </div>
        </v-card-text>

        <!-- Modal Actions -->
        <v-card-actions class="pa-6 d-flex gap-2">
          <v-spacer />
          <v-btn variant="tonal" @click="$emit('close')">
            {{ RECIPE_MODAL.CLOSE_BUTTON }}
          </v-btn>
          <v-btn
            v-if="recipe.id"
            icon
            @click.stop="toggleFavorite(recipe.id)"
            :color="isFavorited(recipe.id) ? 'error' : 'default'"
          >
            <v-icon
              :icon="isFavorited(recipe.id) ? 'mdi-heart' : 'mdi-heart-outline'"
            />
            <v-tooltip activator="parent" location="top">
              {{
                !isAuthenticated
                  ? LOGIN_REQUIRED_TOOLTIP
                  : isFavorited(recipe.id)
                    ? SAVED_RECIPE_TOOLTIP
                    : SAVE_RECIPE_TOOLTIP
              }}
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-text class="flex justify-center">
          <AppLoading :config="LOADING_CONFIG" />
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

// components
const AppLoading = defineAsyncComponent(() => import("./AppLoading.vue"));

// constants
import { RECIPE_FINDER, LOADING_CONFIG } from "@/constants";

// types
import type { IRecipeDetails } from "@/types";

// Props
interface Props {
  open: boolean;
  recipe: IRecipeDetails | null;
  favorites: Set<number | string>;
  imageBaseUri: string;
}

const props = withDefaults(defineProps<Props>(), {
  imageBaseUri: RECIPE_FINDER.IMAGE_BASE_URI,
});

// Emits
const emit = defineEmits<{
  close: [];
  favorite: [recipeId: number];
}>();

// Auth
const { isAuthenticated } = useAuth0();

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      emit("close");
    }
  },
});

// Constants
const LOGIN_REQUIRED_TOOLTIP = RECIPE_FINDER.LOGIN_REQUIRED_TOOLTIP;
const SAVED_RECIPE_TOOLTIP = RECIPE_FINDER.SAVED_RECIPE_TOOLTIP;
const SAVE_RECIPE_TOOLTIP = RECIPE_FINDER.SAVE_RECIPE_TOOLTIP;
const RECIPE_MODAL = RECIPE_FINDER.RECIPE_MODAL;

// Methods
const getImageUrl = (imageSrc: string): string => {
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${props.imageBaseUri}${imageSrc}`;
};

const toggleFavorite = (recipeId: number) => {
  if (!isAuthenticated.value) {
    return;
  }
  emit("favorite", recipeId);
};

const isFavorited = (recipeId: number) => {
  return props.favorites.has(recipeId);
};
</script>

<style scoped>
.recipe-modal {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.recipe-modal .v-list-item) {
  padding-left: 12px;
  padding-right: 12px;
}
</style>
