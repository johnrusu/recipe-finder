/**
 * API Routes Configuration
 * This file exports all available API endpoints for the Link Shortener application
 */

// Safe access to import.meta.env for both browser and test environments
const getBaseUrl = () => {
  // Check if import.meta.env exists (browser environment)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.MODE === "production"
      ? (import.meta.env.VITE_API_BASE_URL as string)
      : (import.meta.env.VITE_API_BASE_URL_LOCAL as string) ||
          "http://localhost:3000";
  }
  // Fallback for test environments
  return "http://localhost:3000";
};

const BASE_URL = getBaseUrl();

// API Routes Configuration (mirrored from server/constants/routes.js)
export const API_ROUTES = {
  // Public routes
  ROOT: {
    method: "GET",
    url: `${BASE_URL}/`,
    protected: false,
    description: "Welcome endpoint",
  },

  PROTECTED_TEST: {
    method: "GET",
    url: `${BASE_URL}/protected`,
    protected: true,
    description: "Test protected route",
  },

  // User authenticated routes
  CREATE_OR_UPDATE_USER: {
    method: "POST",
    url: `${BASE_URL}/users`,
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    url: `${BASE_URL}/users/me`,
    protected: true,
    description: "Get current authenticated user",
  },

  // Recipe routes
  SEARCH_RECIPES: {
    method: "GET",
    url: `${BASE_URL}/recipes/search`,
    protected: false,
    description: "Search recipes by query",
  },

  GET_RECIPE_DETAILS: {
    method: "GET",
    url: `${BASE_URL}/recipes/recipe/:recipeId`,
    protected: false,
    description: "Get detailed information about a recipe (public, no tracking)",
  },

  GET_RECIPE_DETAILS_PROTECTED: {
    method: "GET",
    url: `${BASE_URL}/recipes/recipe/:recipeId/view`,
    protected: true,
    description: "Get detailed information about a recipe (protected, with view tracking)",
  },

  GET_RECIPES_BULK_DETAILS: {
    method: "POST",
    url: `${BASE_URL}/recipes/bulk-details`,
    protected: true,
    description: "Get detailed information about multiple recipes",
  },

  GET_RANDOM_RECIPES: {
    method: "GET",
    url: `${BASE_URL}/recipes/random`,
    protected: false,
    description: "Get random recipes",
  },

  GET_FAVORITE_RECIPES: {
    method: "GET",
    url: `${BASE_URL}/recipes/favorites`,
    protected: true,
    description: "Get user's favorite recipes",
  },

  SET_FAVORITE_RECIPES: {
    method: "POST",
    url: `${BASE_URL}/recipes/favorites`,
    protected: true,
    description: "Set favorite recipes for the authenticated user",
  },

  REMOVE_FAVORITE_RECIPES: {
    method: "DELETE",
    url: `${BASE_URL}/recipes/favorites`,
    protected: true,
    description: "Remove favorite recipes for the authenticated user",
  },

  AUTOCOMPLETE_RECIPE_SEARCH: {
    method: "GET",
    url: `${BASE_URL}/recipes/autocomplete`,
    protected: false,
    description: "Get autocomplete suggestions for recipe search",
  },

  ADD_SEARCH_HISTORY: {
    method: "POST",
    url: `${BASE_URL}/recipes/search-history`,
    protected: true,
    description: "Add a search query to user's search history",
  },

  REMOVE_SEARCH_HISTORY: {
    method: "DELETE",
    url: `${BASE_URL}/recipes/search-history`,
    protected: true,
    description: "Remove a search query from user's search history",
  },

  GET_SEARCH_HISTORY: {
    method: "GET",
    url: `${BASE_URL}/recipes/search-history`,
    protected: true,
    description: "Get user's search history",
  },

  SET_RECIPE_VIEWED: {
    method: "POST",
    url: `${BASE_URL}/recipes/recipe/:recipeId/view`,
    protected: true,
    description: "Mark a recipe as viewed",
  },

  GET_VIEWED_RECIPES: {
    method: "GET",
    url: `${BASE_URL}/recipes/viewed`,
    protected: true,
    description: "Get user's viewed recipes",
  },

  GET_VIEWED_RECIPES_COUNT: {
    method: "GET",
    url: `${BASE_URL}/recipes/viewed/count`,
    protected: true,
    description: "Get count of user's viewed recipes",
  },
} as const;
