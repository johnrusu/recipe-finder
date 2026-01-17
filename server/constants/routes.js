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
    path: "/api/users",
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    path: "/api/users/me",
    protected: true,
    description: "Get current authenticated user",
  },

  // Theme routes
  GET_THEME: {
    method: "GET",
    path: "/api/theme",
    protected: true,
    description: "Get all themes for authenticated user",
  },

  CREATE_THEME: {
    method: "POST",
    path: "/api/theme",
    protected: true,
    description: "Create new theme",
  },

  UPDATE_THEME: {
    method: "PUT",
    path: "/api/theme",
    protected: true,
    description: "Update existing theme",
  },

  // Recipe routes
  SEARCH_RECIPES: {
    method: "GET",
    path: "/api/recipes/search",
    protected: false,
    description: "Search recipes by query",
  },

  GET_RECIPE_DETAILS: {
    method: "GET",
    path: "/api/recipes/:recipeId",
    protected: false,
    description: "Get detailed information about a recipe",
  },

  GET_RANDOM_RECIPES: {
    method: "GET",
    path: "/api/recipes/random",
    protected: false,
    description: "Get random recipes",
  },
};

module.exports = { ROUTES };
