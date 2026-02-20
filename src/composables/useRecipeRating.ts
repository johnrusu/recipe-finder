import { useAuth0 } from "@auth0/auth0-vue";
import { useAppStore } from "@/stores";
import { setRecipesRatings } from "@/services";
import { isNilOrEmpty, isArrayNotEmpty } from "@/utils";
import { pathOr } from "ramda";

import type { IRecipeRating } from "@/types";

export function useRecipeRating() {
  const appStore = useAppStore();
  const { getAccessTokenSilently } = useAuth0();

  const fetchRatingForRecipe = (recipeId: string | number): number => {
    const ratingsForRecipes = appStore.recipesRatings;
    if (!isNilOrEmpty(ratingsForRecipes)) {
      const recipeAverageRatingValue =
        ratingsForRecipes
          .filter((q) => q.recipeId === recipeId)
          .map((q) => q.rating)
          .reduce((acc, rating) => acc + rating, 0) /
        ratingsForRecipes.filter((q) => q.recipeId === recipeId).length;
      return isNaN(recipeAverageRatingValue) ? 0 : recipeAverageRatingValue;
    }
    return 0;
  };

  const handleRatingChange = async (
    recipeId: string | number,
    newRating: number
  ) => {
    let token = "";

    try {
      token = (await getAccessTokenSilently()) || "";
    } catch (authError) {
      console.error("Failed to get access token:", authError);
    }

    if (!isNilOrEmpty(recipeId) && !isNilOrEmpty(newRating)) {
      try {
        const response = await setRecipesRatings(
          { recipeId, rating: newRating } as IRecipeRating,
          token
        );
        if (!isNilOrEmpty(response)) {
          const success = pathOr(false, ["success"], response);
          const ratings = pathOr([], ["ratings"], response);
          if (success) {
            // Update local state with new rating
            if (isArrayNotEmpty(ratings)) {
              appStore.setRecipesRatings(ratings);
            }
          }
        }
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    }
  };

  return {
    fetchRatingForRecipe,
    handleRatingChange,
  };
}
