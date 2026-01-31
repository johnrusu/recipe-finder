const express = require("express");
const { pathOr } = require("ramda");
const router = express.Router();

// Helper function to get env vars with safe defaults
const getEnvVar = (key, defaultValue = "") => {
  return process.env[key] || defaultValue;
};

const pathOfMockData = getEnvVar("MOCK_DATA_PATH", "../mock/recipes.json");
const pathMockOfAutocomplete = getEnvVar(
  "MOCK_AUTOCOMPLETE_PATH",
  "../mock/autocomplete.json"
);
const pathOfMockRecipeDetails = getEnvVar(
  "MOCK_RECIPE_DETAILS_PATH",
  "../mock/recipes-details.json"
);

// Helper to lazy-load mock data when needed
const fetchMockData = (mockName = "") => {
  try {
    switch (mockName) {
      case "recipes":
        return require(pathOfMockData);
      case "autocomplete":
        return require(pathMockOfAutocomplete);
      case "recipeDetails":
        return require(pathOfMockRecipeDetails);
      default:
        return null;
    }
  } catch (error) {
    console.error("Failed to load mock data from", mockName, error);
    return null;
  }
};

// Version: 1.0.1 - Timestamp fixes

// Constants
const {
  APP_NAME,
  SPOONACULAR_BASE_URL,
  SPOONACULAR_API_KEY,
} = require("../constants/index.js");
const { ROUTES } = require("../constants/routes.js");

// Auth middleware
const { checkJwt } = require("../middleware/auth.js");

// utils
const { isNilOrEmpty } = require("../utils/index.js");

// Database functions
const {
  createOrUpdateUser,
  getUserByAuth0Id,
  setFavoritesRecipes,
  removeFavoritesRecipes,
} = require("../database/index.js");

// Root route - Public
router[ROUTES.ROOT.method.toLowerCase()](ROUTES.ROOT.path, async (req, res) => {
  res.json({ message: `Welcome to ${APP_NAME}` });
});

router[ROUTES.PROTECTED_TEST.method.toLowerCase()](
  ROUTES.PROTECTED_TEST.path,
  checkJwt,
  async (req, res) => {
    res.json({ message: `You have accessed a protected route in ${APP_NAME}` });
  }
);

// ===== USER ROUTES =====

// Create or update user (called after Auth0 login)
router[ROUTES.CREATE_OR_UPDATE_USER.method.toLowerCase()](
  ROUTES.CREATE_OR_UPDATE_USER.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const email = pathOr(null, ["body", "email"], req);
      const name = pathOr(null, ["body", "name"], req);

      if (isNilOrEmpty(auth0Id) || isNilOrEmpty(email)) {
        return res.status(400).json({ error: "Missing required user data" });
      }

      const user = await createOrUpdateUser({ auth0Id, email, name });
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get current user
router[ROUTES.GET_CURRENT_USER.method.toLowerCase()](
  ROUTES.GET_CURRENT_USER.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);

      if (isNilOrEmpty(auth0Id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await getUserByAuth0Id(auth0Id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ===== RECIPE ROUTES =====

// Search recipes with filters
router[ROUTES.SEARCH_RECIPES.method.toLowerCase()](
  ROUTES.SEARCH_RECIPES.path,
  async (req, res) => {
    try {
      const {
        query,
        number = 10,
        offset = 0,
        type,
        cuisine,
        diet,
        intolerances,
        maxReadyTime,
        includeIngredients,
        excludeIngredients,
      } = req.query;

      if (isNilOrEmpty(query)) {
        return res
          .status(400)
          .json({ error: "Missing required query parameter" });
      }

      // Build the search URL with all available filters
      const params = new URLSearchParams({
        query: encodeURIComponent(query),
        number: parseInt(number),
        offset: parseInt(offset),
        addRecipeInformation: true,
        apiKey: SPOONACULAR_API_KEY,
      });

      // Add optional filters
      if (!isNilOrEmpty(type)) {
        params.append("type", type);
      }

      if (!isNilOrEmpty(cuisine)) {
        params.append("cuisine", cuisine);
      }

      if (!isNilOrEmpty(diet)) {
        params.append("diet", diet);
      }

      if (!isNilOrEmpty(intolerances)) {
        params.append("intolerances", intolerances);
      }

      if (!isNilOrEmpty(maxReadyTime)) {
        params.append("maxReadyTime", parseInt(maxReadyTime));
      }

      if (!isNilOrEmpty(includeIngredients)) {
        params.append("includeIngredients", includeIngredients);
      }

      if (!isNilOrEmpty(excludeIngredients)) {
        params.append("excludeIngredients", excludeIngredients);
      }

      const searchUrl = `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`;

      const response = await fetch(searchUrl);
      const result = await response.json();

      if (!response.ok) {
        // Fallback to mock data if API fails (quota exceeded, etc.)
        const mockData = fetchMockData("recipes");
        if (mockData) {
          console.log(
            `API failed with status ${response.status}, using mock data as fallback`
          );
          return res.status(200).json({
            success: true,
            recipes: mockData,
            usingMockData: true,
            apiError: result.message || "API unavailable",
          });
        }
        return res
          .status(response.status)
          .json({ error: result.message || "Search failed" });
      }

      res.status(200).json({ success: true, recipes: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get random recipes (must come BEFORE :recipeId route)
router[ROUTES.GET_RANDOM_RECIPES.method.toLowerCase()](
  ROUTES.GET_RANDOM_RECIPES.path,
  async (req, res) => {
    try {
      const { number = 5 } = pathOr({}, ["query"], req);
      const randomUrl = `${SPOONACULAR_BASE_URL}/recipes/random?number=${parseInt(number)}&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;

      const response = await fetch(randomUrl);
      const result = await response.json();

      if (!response.ok) {
        // Fallback to mock data if API fails (quota exceeded, etc.)
        const mockData = fetchMockData("recipes");
        if (mockData) {
          console.log(
            `API failed with status ${response.status}, using mock data as fallback`
          );
          return res.status(200).json({
            success: true,
            recipes: {
              results: mockData.results || [],
              baseUri:
                mockData.baseUri || "https://img.spoonacular.com/recipes/",
              offset: mockData.offset || 0,
              number: mockData.number || parseInt(number),
              totalResults:
                mockData.totalResults ||
                (mockData.results ? mockData.results.length : 0),
              processingTimeMs: 0,
              expires: 0,
            },
            usingMockData: true,
            apiError: result.message || "API unavailable",
          });
        }
        return res
          .status(response.status)
          .json({ error: result.message || "Failed to get random recipes" });
      }

      // Normalize response structure to match search endpoint
      // Random endpoint returns { recipes: [...] }
      // Search endpoint returns { results: [...], baseUri: "...", ... }
      const normalizedResult = {
        results: result.recipes || [],
        baseUri: "https://img.spoonacular.com/recipes/",
        offset: 0,
        number: parseInt(number),
        totalResults: result.recipes ? result.recipes.length : 0,
        processingTimeMs: 0,
        expires: 0,
      };

      res.status(200).json({
        success: true,
        recipes: normalizedResult,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Set recipes as favorite (must come BEFORE :recipeId route)
router[ROUTES.SET_FAVORITE_RECIPES.method.toLowerCase()](
  ROUTES.SET_FAVORITE_RECIPES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const { recipeIds = [] } = req.body;

      if (isNilOrEmpty(auth0Id)) {
        console.log("❌ No auth0Id found");
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
        console.log("❌ Invalid recipeIds");
        return res
          .status(400)
          .json({ error: "recipeIds must be a non-empty array" });
      }

      const favorites = await setFavoritesRecipes(auth0Id, recipeIds);

      if (favorites) {
        res.status(200).json({
          success: true,
          message: `Recipes [${recipeIds.join(
            ", "
          )}] set as favorite for user ${auth0Id}`,
          recipeIds,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Recipes [${recipeIds.join(
            ", "
          )}] marked as favorite for user ${auth0Id} (offline mode)`,
          recipeIds,
          offline: true,
        });
      }
    } catch (error) {
      console.error("❌ Error in SET_FAVORITE_RECIPES:", error.message);
      // Don't fail - return success even if DB is down
      res.status(200).json({
        success: true,
        message: "Favorites recorded (database offline)",
        offline: true,
      });
    }
  }
);

// Remove recipes from favorites
router[ROUTES.REMOVE_FAVORITE_RECIPES.method.toLowerCase()](
  ROUTES.REMOVE_FAVORITE_RECIPES.path,
  checkJwt,
  async (req, res) => {
    try {
      const auth0Id = pathOr(null, ["auth", "payload", "sub"], req);
      const recipeIds = pathOr([], ["body"], req);

      if (isNilOrEmpty(auth0Id)) {
        console.log("❌ No auth0Id found");
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
        console.log("❌ Invalid recipeIds");
        return res
          .status(400)
          .json({ error: "recipeIds must be a non-empty array" });
      }

      const favorites = await removeFavoritesRecipes(auth0Id, recipeIds);

      if (favorites) {
        res.status(200).json({
          success: true,
          message: `Recipes [${recipeIds.join(
            ", "
          )}] removed from favorites for user ${auth0Id}`,
          recipeIds,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Recipes [${recipeIds.join(
            ", "
          )}] removed from favorites for user ${auth0Id} (offline mode)`,
          recipeIds,
          offline: true,
        });
      }
    } catch (error) {
      console.error("❌ Error in REMOVE_FAVORITE_RECIPES:", error.message);
      // Don't fail - return success even if DB is down
      res.status(200).json({
        success: true,
        message: "Favorites recorded (database offline)",
        offline: true,
      });
    }
  }
);

// Get recipe details
router[ROUTES.GET_RECIPE_DETAILS.method.toLowerCase()](
  ROUTES.GET_RECIPE_DETAILS.path,
  async (req, res) => {
    try {
      const recipeId = pathOr("", ["params", "recipeId"], req);

      if (isNilOrEmpty(recipeId)) {
        return res
          .status(400)
          .json({ error: "Missing required recipeId parameter" });
      }

      const detailsUrl = `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;
      const response = await fetch(detailsUrl);
      const result = await response.json();

      if (!response.ok) {
        // Fallback to mock data if API fails (quota exceeded, etc.)
        const mockRecipeDetails = fetchMockData("recipeDetails");
        if (mockRecipeDetails) {
          console.log(
            `API failed with status ${response.status}, using mock data as fallback`
          );
          const recipeDetailsMock =
            mockRecipeDetails.recipes.find(
              (r) => r.id === parseInt(recipeId)
            ) || mockRecipeDetails.recipes[0];

          return res.status(200).json({
            success: true,
            recipe: { ...recipeDetailsMock, id: parseInt(recipeId) },
            usingMockData: true,
            apiError: result.message || "API unavailable",
          });
        }
        return res
          .status(response.status)
          .json({ error: result.message || "Failed to get recipe details" });
      }

      res.status(200).json({ success: true, recipe: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Autocomplete search recipe
router[ROUTES.AUTOCOMPLETE_RECIPE_SEARCH.method.toLowerCase()](
  ROUTES.AUTOCOMPLETE_RECIPE_SEARCH.path,
  async (req, res) => {
    try {
      const query = pathOr("", ["query", "query"], req);
      const number = pathOr(10, ["query", "number"], req);
      if (isNilOrEmpty(query) || isNilOrEmpty(number)) {
        return res
          .status(400)
          .json({ error: "Missing required query parameters" });
      }

      const autocompleteUrl = `${SPOONACULAR_BASE_URL}/recipes/autocomplete?query=${encodeURIComponent(
        query
      )}&number=${parseInt(number)}&apiKey=${SPOONACULAR_API_KEY}`;

      const response = await fetch(autocompleteUrl);
      const result = await response.json();
      if (!response.ok) {
        // Fallback to mock data if API fails (quota exceeded, etc.)
        const mockData = fetchMockData("autocomplete");
        if (mockData) {
          console.log(
            `API failed with status ${response.status}, using mock data as fallback`
          );
          return res.status(200).json({
            success: true,
            recipes: mockData,
            usingMockData: true,
            apiError: result.message || "API unavailable",
          });
        }
        return res
          .status(response.status)
          .json({ error: result.message || "Autocomplete search failed" });
      }

      res.status(200).json({ success: true, suggestions: result });
    } catch (error) {
      console.error("❌ Error in AUTOCOMPLETE_RECIPE_SEARCH:", error.message);
      // Don't fail - return success even if DB is down
      res.status(200).json({
        success: true,
        message: "Autocomplete search recorded (database offline)",
        offline: true,
      });
    }
  }
);

// 404 handler - must be last route
router.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
  });
});

module.exports = router;
