import { ref } from "vue";
import { defineStore } from "pinia";

// types
import type { TUser, IRecipe } from "@/types";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const user = ref<TUser | null>(null);
  const skipWelcome = ref(false);
  const recipes = ref<IRecipe[]>([]);
  const savedRecipes = ref<Set<number>>(new Set());

  const setError = (value: Error | null) => {
    error.value = value;
  };

  const setUser = (value: TUser | null) => {
    user.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setSkipWelcome = (value: boolean) => {
    skipWelcome.value = value;
  };

  const setRecipes = (recipesData: IRecipe[]) => {
    recipes.value = recipesData;
  };

  const setSavedRecipes = (recipeIds: Set<number>) => {
    savedRecipes.value = recipeIds;
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    user,
    setUser,
    skipWelcome,
    setSkipWelcome,
    setRecipes,
    recipes,
    setSavedRecipes,
    savedRecipes,
  };
});
