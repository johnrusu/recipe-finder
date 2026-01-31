<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    location="bottom"
    offset="4"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="searchQuery"
        v-bind="{ ...$attrs, ...props }"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <!-- Forward all slots to v-text-field -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </v-text-field>
    </template>

    <v-list
      v-if="isArrayNotEmpty(props.suggestionsAutocomplete)"
      class="gap-2 flex flex-col"
    >
      <v-list-item
        v-for="(suggestion, index) in props.suggestionsAutocomplete"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="cursor-pointer"
      >
        <template v-if="getSuggestionImage(suggestion)" v-slot:prepend>
          <v-avatar size="40" rounded="sm">
            <v-img
              :src="getSuggestionImage(suggestion)"
              :alt="getSuggestionTitle(suggestion)"
              cover
              @error="handleImageError"
            >
              <template v-slot:error>
                <div
                  class="d-flex align-center justify-center h-100 bg-grey-lighten-3"
                >
                  <v-icon icon="mdi-food" size="20" color="grey" />
                </div>
              </template>
            </v-img>
          </v-avatar>
        </template>
        <v-list-item-title>
          {{ getSuggestionTitle(suggestion) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// utils
import { isArrayNotEmpty } from "@/utils";
// props
const props = defineProps<{
  suggestionsAutocomplete: unknown[];
}>();

defineOptions({
  inheritAttrs: false,
});

// refs
const showMenu = ref(false);
const searchQuery = ref("");

// emits
const emit = defineEmits<{
  (e: "item-selected", value: unknown): void;
}>();

// watch suggestions to show/hide menu
watch(
  () => props.suggestionsAutocomplete,
  (newVal) => {
    if (isArrayNotEmpty(newVal)) {
      showMenu.value = true;
    } else {
      showMenu.value = false;
    }
  },
  { deep: true }
);

// methods
const getSuggestionTitle = (suggestion: any): string => {
  if (typeof suggestion === "string") {
    return suggestion;
  }
  return suggestion?.title || suggestion?.name || String(suggestion);
};

const getSuggestionImage = (suggestion: any): string | undefined => {
  if (typeof suggestion === "string") {
    return undefined;
  }

  // If direct image URL is provided
  if (suggestion?.image || suggestion?.imageUrl || suggestion?.thumbnail) {
    return suggestion.image || suggestion.imageUrl || suggestion.thumbnail;
  }

  // If Spoonacular format (id + imageType)
  if (suggestion?.id && suggestion?.imageType) {
    // Remove query params from imageType if any (e.g., "jpg?w=470" -> "jpg")
    const cleanImageType = suggestion.imageType.split("?")[0];
    return `https://img.spoonacular.com/recipes/${suggestion.id}-312x231.${cleanImageType}`;
  }

  return undefined;
};

const selectSuggestion = (suggestion: any) => {
  const title = getSuggestionTitle(suggestion);
  searchQuery.value = title;
  showMenu.value = false;
  emit("item-selected", { title, suggestion });
};

const handleFocus = () => {
  if (isArrayNotEmpty(props.suggestionsAutocomplete)) {
    showMenu.value = true;
  }
};

const handleImageError = () => {
  // Image failed to load, error template will show fallback icon
  console.debug("Failed to load suggestion image");
};

const handleBlur = () => {
  // Delay to allow click on menu items
  setTimeout(() => {
    showMenu.value = false;
  }, 200);
};
</script>

<style scoped>
:deep(.v-field__input),
:deep(.v-field__field),
:deep(input) {
  cursor: text !important;
}
</style>
