<template>
  <v-dialog
    v-model="isOpen"
    :fullscreen="$vuetify.display.mobile"
    max-width="1024px"
    @update:model-value="$emit('on-close')"
    :persistent="!recipe"
    scrim="black"
    :opacity="0.9"
  >
    <v-card
      class="recipe-modal d-flex flex-column"
      :style="$vuetify.display.mobile ? 'height: 100vh' : 'max-height: 90vh'"
    >
      <template v-if="recipe">
        <!-- Header Image -->
        <v-img
          :src="getImageUrl(recipe.image)"
          :alt="recipe.title"
          :height="$vuetify.display.mobile ? '200px' : '300px'"
          cover
          class="shrink-0"
        />

        <!-- Card Content -->
        <v-card-text class="pa-6 grow" style="overflow-y: auto">
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
              {{ recipe.readyInMinutes }} {{ RECIPE_MODAL.TIME_UNIT }}
            </v-chip>
            <v-chip
              v-if="recipe.servings"
              prepend-icon="mdi-silverware-fork-knife"
              color="success"
              variant="tonal"
            >
              {{ recipe.servings }} {{ RECIPE_MODAL.SERVINGS_LABEL }}
            </v-chip>
            <v-chip
              v-if="recipe.healthScore"
              prepend-icon="mdi-heart"
              color="error"
              variant="tonal"
            >
              {{ RECIPE_MODAL.HEALTH_LABEL }} {{ recipe.healthScore }}
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
                :key="`ingredient-${index}-${ingredient.id}`"
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
              size="large"
            >
              {{ RECIPE_MODAL.VIEW_FULL_RECIPE }}
            </v-btn>
          </div>
        </v-card-text>

        <!-- Modal Actions -->
        <v-card-actions
          class="pa-6 d-flex flex-column flex-sm-row gap-2 justify-space-between shrink-0"
        >
          <div
            class="d-flex flex-column flex-sm-row align-center gap-2 w-100 w-sm-auto"
          >
            <v-btn
              v-if="recipe.id"
              :prepend-icon="
                isFavorited(recipe) ? 'mdi-heart' : 'mdi-heart-outline'
              "
              variant="tonal"
              @click.stop="toggleFavorite(recipe)"
              :loading="isAddingFavorites"
              :color="isFavorited(recipe) ? 'primary' : 'default'"
              class="w-100 w-sm-auto"
            >
              <v-tooltip activator="parent" location="top">
                {{
                  isFavorited(recipe)
                    ? SAVED_RECIPE_TOOLTIP
                    : SAVE_RECIPE_TOOLTIP
                }}
              </v-tooltip>
              <span class="text-wrap">
                {{
                  isFavorited(recipe)
                    ? LABELS.REMOVE_FROM_FAVORITES
                    : LABELS.ADD_TO_FAVORITES
                }}</span
              >
            </v-btn>
            <v-btn
              @click="printRecipe"
              prepend-icon="mdi-printer"
              variant="tonal"
              class="w-100 w-sm-auto"
            >
              <span class="text-wrap">{{ LABELS.PRINT }}</span>
            </v-btn>
          </div>
          <v-btn
            variant="flat"
            @click="$emit('on-close')"
            prepend-icon="mdi-close"
            class="w-100 w-sm-auto"
          >
            {{ RECIPE_MODAL.CLOSE_BUTTON }}
          </v-btn>
        </v-card-actions>
      </template>
      <template v-else-if="errorLoadingRecipe">
        <v-card-text class="flex">
          {{ errorLoadingRecipe }}
        </v-card-text>
        <v-card-actions class="pa-6 d-flex justify-center">
          <v-btn
            variant="flat"
            @click="$emit('on-close')"
            prepend-icon="mdi-close"
          >
            {{ RECIPE_MODAL.CLOSE_BUTTON }}
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

// components
const AppLoading = defineAsyncComponent(() => import("./AppLoading.vue"));

// constants
import { RECIPE_FINDER, LOADING_CONFIG, LABELS } from "@/constants";

// types
import type { IRecipe, IRecipeDetails } from "@/types";

// Props
interface Props {
  open: boolean;
  recipe: IRecipeDetails | null;
  favorites: IRecipe[];
  imageBaseUri: string;
  isAddingFavorites: boolean;
  errorLoadingRecipe?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  imageBaseUri: RECIPE_FINDER.IMAGE_BASE_URI,
  isAddingFavorites: false,
  errorLoadingRecipe: null,
});

// Emits
const emit = defineEmits<{
  (e: "on-toggle-favorite", recipe: IRecipe): void;
  (e: "on-close"): void;
}>();

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      emit("on-close");
    }
  },
});

// Constants
const SAVED_RECIPE_TOOLTIP = RECIPE_FINDER.SAVED_RECIPE_TOOLTIP;
const SAVE_RECIPE_TOOLTIP = RECIPE_FINDER.SAVE_RECIPE_TOOLTIP;
const RECIPE_MODAL = RECIPE_FINDER.RECIPE_MODAL;

// Methods
const getImageUrl = (imageSrc: string): string => {
  if (!imageSrc) {
    return "";
  }
  if (imageSrc.startsWith("http")) {
    return imageSrc;
  }
  return `${props.imageBaseUri}${imageSrc}`;
};

const toggleFavorite = (recipe: IRecipe) => {
  emit("on-toggle-favorite", recipe);
};

const isFavorited = (recipe: IRecipe) => {
  return props.favorites.find((r) => r.id === recipe.id);
};

const printRecipe = () => {
  if (!props.recipe) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const recipe = props.recipe;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${recipe.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 20px; }
          .info { margin: 20px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; }
          .info p { margin: 5px 0; }
          .ingredients ul { margin: 10px 0; padding-left: 20px; }
          .ingredients li { margin: 5px 0; }
          .instructions { margin: 20px 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <div class="info">
          ${recipe.readyInMinutes ? `<p><strong>${RECIPE_MODAL.PRINT_TIME_LABEL}</strong> ${recipe.readyInMinutes} ${RECIPE_MODAL.PRINT_TIME_MINUTES}</p>` : ""}
          ${recipe.servings ? `<p><strong>${RECIPE_MODAL.PRINT_SERVINGS_LABEL}</strong> ${recipe.servings}</p>` : ""}
          ${recipe.healthScore ? `<p><strong>${RECIPE_MODAL.PRINT_HEALTH_SCORE_LABEL}</strong> ${recipe.healthScore}</p>` : ""}
        </div>
        ${recipe.summary ? `<div class="summary"><h2>${RECIPE_MODAL.SUMMARY_TITLE}</h2>${recipe.summary}</div>` : ""}
        ${
          recipe.extendedIngredients?.length
            ? `<div class="ingredients"><h2>${RECIPE_MODAL.INGREDIENTS_TITLE}</h2><ul>${recipe.extendedIngredients.map((i: any) => `<li>${i.original}</li>`).join("")}</ul></div>`
            : ""
        }
        ${recipe.instructions ? `<div class="instructions"><h2>${RECIPE_MODAL.INSTRUCTIONS_TITLE}</h2>${recipe.instructions}</div>` : ""}
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
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
