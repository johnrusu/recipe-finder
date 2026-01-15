<template>
  <v-container class="recipe-finder-form pa-0">
    <v-card>
      <!-- Header Section -->
      <v-card-title
        class="font-weight-bold text-center bg-gradient pa-6 white responsive-title flex! flex-col gap-4 sm:flex-row align-center justify-center"
      >
        <v-icon icon="mdi-chef-hat" size="40" color="white" />
        <span>{{ RECIPE_FINDER.TITLE }}</span>
      </v-card-title>
      <v-card-text class="px-6 py-8">
        <!-- Main Search Bar -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-text-field
              v-model="searchQuery"
              :placeholder="`${xs ? '' : RECIPE_FINDER.SEARCH_PLACEHOLDER}`"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              class="search-field"
              @keyup.enter="handleSearch"
            >
              <template v-slot:append-inner>
                <v-btn color="primary" @click="handleSearch" :loading="loading">
                  {{ RECIPE_FINDER.SEARCH_BUTTON }}
                  <v-icon end icon="mdi-arrow-right" />
                </v-btn>
              </template>
            </v-text-field>
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
                  <v-col cols="12" md="6">
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

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="difficulty"
                      :items="difficultyLevels"
                      :label="RECIPE_FINDER.DIFFICULTY_LABEL"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      clearable
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
              :loading="loading"
              @click="handleSearch"
              prepend-icon="mdi-magnify"
              block
              class="action-btn"
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
              @click="handleRandomRecipe"
              block
              class="action-btn"
            >
              {{ RECIPE_FINDER.SURPRISE_ME_BUTTON }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Search Tips -->
    <v-card class="mx-auto mt-6" variant="tonal">
      <v-card-text class="py-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-lightbulb-on" color="warning" class="mr-3" />
          <div>
            <div class="text-subtitle-2 font-weight-bold">
              {{ RECIPE_FINDER.PRO_TIPS_TITLE }}
            </div>
            <div class="text-caption">
              {{ RECIPE_FINDER.PRO_TIPS_TEXT }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";

// constants
import { RECIPE_FINDER } from "@/constants";

// State
const searchQuery = ref("");
const selectedMealType = ref<string | null>(null);
const selectedCuisine = ref<string[]>([]);
const difficulty = ref<string | null>(null);
const dietaryPreferences = ref<string[]>([]);
const maxCookingTime = ref(60);
const includeIngredients = ref<string[]>([]);
const excludeIngredients = ref<string[]>([]);
const showAdvanced = ref(false);
const loading = ref(false);

// hooks
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

const difficultyLevels = [
  { title: RECIPE_FINDER.DIFFICULTY_LEVELS.EASY, value: "easy" },
  { title: RECIPE_FINDER.DIFFICULTY_LEVELS.MEDIUM, value: "medium" },
  { title: RECIPE_FINDER.DIFFICULTY_LEVELS.HARD, value: "hard" },
];

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
    value: "gluten-free",
    color: "amber",
  },
  {
    label: RECIPE_FINDER.DIETARY.DAIRY_FREE,
    value: "dairy-free",
    color: "blue",
  },
  { label: RECIPE_FINDER.DIETARY.KETO, value: "keto", color: "purple" },
  { label: RECIPE_FINDER.DIETARY.PALEO, value: "paleo", color: "orange" },
  { label: RECIPE_FINDER.DIETARY.LOW_CARB, value: "low-carb", color: "teal" },
];

// Computed
const hasActiveFilters = computed(() => {
  return (
    selectedMealType.value !== null ||
    selectedCuisine.value.length > 0 ||
    difficulty.value !== null ||
    dietaryPreferences.value.length > 0 ||
    maxCookingTime.value !== 60 ||
    includeIngredients.value.length > 0 ||
    excludeIngredients.value.length > 0
  );
});

// Methods
const handleSearch = () => {
  loading.value = true;

  const filters = {
    query: searchQuery.value,
    mealType: selectedMealType.value,
    cuisine: selectedCuisine.value,
    difficulty: difficulty.value,
    dietary: dietaryPreferences.value,
    maxTime: maxCookingTime.value,
    include: includeIngredients.value,
    exclude: excludeIngredients.value,
  };

  console.log("Searching with filters:", filters);

  // TODO: Implement actual search logic
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const handleRandomRecipe = () => {
  console.log("Getting random recipe...");
  // TODO: Implement random recipe logic
};

const clearFilters = () => {
  selectedMealType.value = null;
  selectedCuisine.value = [];
  difficulty.value = null;
  dietaryPreferences.value = [];
  maxCookingTime.value = 60;
  includeIngredients.value = [];
  excludeIngredients.value = [];
};
</script>

<style scoped>
.responsive-title {
  font-size: 1.25rem;
}

@media (min-width: 600px) {
  .responsive-title {
    font-size: 1.5rem;
  }
}

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
</style>
