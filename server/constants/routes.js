// API Routes Configuration
const ROUTES = {
  // Public routes
  ROOT: {
    method: "GET",
    path: "/",
    protected: false,
    description: "Welcome endpoint",
  },

  PROTECTED_TEST: {
    method: "GET",
    path: "/protected",
    protected: true,
    description: "Test protected route",
  },

  // User routes
  CREATE_OR_UPDATE_USER: {
    method: "POST",
    path: "/users",
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    path: "/users/me",
    protected: true,
    description: "Get current authenticated user",
  },

  // Recipe routes
  SEARCH_RECIPES: {
    method: "GET",
    path: "/recipes/search",
    protected: false,
    description: "Search recipes by query",
  },

  GET_RECIPE_DETAILS: {
    method: "GET",
    path: "/recipes/recipe/:recipeId",
    protected: false,
    description: "Get detailed information about a recipe",
  },

  GET_RECIPES_BULK_DETAILS: {
    method: "POST",
    path: "/recipes/bulk-details",
    protected: false,
    description: "Get detailed information about multiple recipes",
  },

  GET_RANDOM_RECIPES: {
    method: "GET",
    path: "/recipes/random",
    protected: false,
    description: "Get random recipes",
  },

  GET_FAVORITE_RECIPES: {
    method: "GET",
    path: "/recipes/favorites",
    protected: true,
    description: "Get user's favorite recipes",
  },

  SET_FAVORITE_RECIPES: {
    method: "POST",
    path: "/recipes/favorites",
    protected: true,
    description: "Set recipes as favorite",
  },

  REMOVE_FAVORITE_RECIPES: {
    method: "DELETE",
    path: "/recipes/favorites",
    protected: true,
    description: "Remove recipes from favorites",
  },

  AUTOCOMPLETE_RECIPE_SEARCH: {
    method: "GET",
    path: "/recipes/autocomplete",
    protected: false,
    description: "Get autocomplete suggestions for recipe search",
  },

  ADD_SEARCH_HISTORY: {
    method: "POST",
    path: "/recipes/search-history",
    protected: true,
    description: "Add a search query to user's search history",
  },

  REMOVE_SEARCH_HISTORY: {
    method: "DELETE",
    path: "/recipes/search-history",
    protected: true,
    description: "Remove a search query from user's search history",
  },

  SET_RECIPE_VIEWED: {
    method: "POST",
    path: "/recipes/recipe/:recipeId/view",
    protected: true,
    description: "Mark a recipe as viewed",
  },

  GET_VIEWED_RECIPES: {
    method: "GET",
    path: "/recipes/viewed",
    protected: true,
    description: "Get user's viewed recipes",
  },

  GET_VIEWED_RECIPES_COUNT: {
    method: "GET",
    path: "/recipes/viewed/count",
    protected: true,
    description: "Get count of user's viewed recipes",
  },
};

module.exports = { ROUTES };
