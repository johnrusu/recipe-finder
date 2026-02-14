import { API_ROUTES } from "@/constants/routes";

// types
import type {
  ApiRequestOptions,
  IUser,
  IUserData,
  IRecipeSearchParams,
  IRecipeSearchResponse,
  IRecipeDetailsResponse,
  IAutocompleteSuggestion,
  IRecipe,
  IBaseRecipe
} from "@/types";

// ===== USER SERVICES =====

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint URL (full URL from API_ROUTES)
 * @param {ApiRequestOptions} options - Fetch options (method, headers, body, etc.)
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
const apiRequest = async <T = Record<string, unknown>>(
  endpoint: string,
  options: ApiRequestOptions = {},
  token: string | null = null
): Promise<T | null> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    console.error("API Request failed:", {
      endpoint,
      status: response.status,
      error,
      requestBody: config.body,
    });
    throw new Error(
      error.message || `Request failed with status ${response.status}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Create or update user
 * POST /api/users
 */
export const createOrUpdateUser = async (
  userData: IUserData,
  token: string
): Promise<IUser> => {
  return apiRequest(
    API_ROUTES.CREATE_OR_UPDATE_USER.url,
    {
      method: API_ROUTES.CREATE_OR_UPDATE_USER.method,
      body: JSON.stringify(userData),
    },
    token
  ) as Promise<IUser>;
};

/**
 * Get current user
 * GET /api/users/me
 */
export const getCurrentUser = async (token: string): Promise<IUser> => {
  return apiRequest(
    API_ROUTES.GET_CURRENT_USER.url,
    {
      method: API_ROUTES.GET_CURRENT_USER.method,
    },
    token
  ) as Promise<IUser>;
};

// ===== RECIPE SERVICES =====

/**
 * Search recipes
 * GET /api/recipes/search?query=...&filters...
 */
export const searchRecipes = async (
  params: IBaseRecipe
): Promise<IRecipeSearchResponse> => {
  const queryParams = new URLSearchParams({
    query: params.query,
    number: String(params.number || 10),
    offset: String(params.offset || 0),
  });

  // Add optional filters
  if (params.type) {
    queryParams.append("type", params.type);
  }

  if (params.cuisine) {
    queryParams.append("cuisine", params.cuisine);
  }

  if (params.diet) {
    queryParams.append("diet", params.diet);
  }

  if (params.intolerances) {
    queryParams.append("intolerances", params.intolerances);
  }

  if (params.maxReadyTime) {
    queryParams.append("maxReadyTime", String(params.maxReadyTime));
  }

  if (params.includeIngredients) {
    queryParams.append("includeIngredients", params.includeIngredients);
  }

  if (params.excludeIngredients) {
    queryParams.append("excludeIngredients", params.excludeIngredients);
  }

  const url = `${API_ROUTES.SEARCH_RECIPES.url}?${queryParams.toString()}`;

  return apiRequest(url, {
    method: API_ROUTES.SEARCH_RECIPES.method,
  }) as Promise<IRecipeSearchResponse>;
};

/**
 * Get recipe details
 * GET /api/recipes/:recipeId
 */
export const fetchRecipeDetails = async (
  recipeId: number,
  token: string
): Promise<IRecipeDetailsResponse> => {
  const url = API_ROUTES.GET_RECIPE_DETAILS.url.replace(
    ":recipeId",
    String(recipeId)
  );

  return apiRequest(
    url,
    {
      method: API_ROUTES.GET_RECIPE_DETAILS.method,
    },
    token
  ) as Promise<IRecipeDetailsResponse>;
};

/**
 * Get recipes bulk details
 * POST /api/recipes/bulk-details
 *
 * @param recipeIds - Array of recipe IDs to fetch details for
 * @param token - Optional Auth0 JWT token for authentication
 * @returns {Promise<IRecipeDetailsResponse>} - Response data
 *
 */
export const fetchRecipesBulkDetails = async (
  recipesIds: number[],
  token?: string
): Promise<IRecipeDetailsResponse> => {
  const url = API_ROUTES.GET_RECIPES_BULK_DETAILS.url;

  return apiRequest(
    url,
    {
      method: API_ROUTES.GET_RECIPES_BULK_DETAILS.method,
      body: JSON.stringify({ recipesIds }),
    },
    token
  ) as Promise<IRecipeDetailsResponse>;
};

/**
 * Get random recipes
 * GET /api/recipes/random?number=...
 */
export const getRandomRecipes = async (
  number: number = 5
): Promise<IRecipeSearchResponse> => {
  const queryParams = new URLSearchParams({
    number: String(number),
  });

  const url = `${API_ROUTES.GET_RANDOM_RECIPES.url}?${queryParams.toString()}`;

  return apiRequest(url, {
    method: API_ROUTES.GET_RANDOM_RECIPES.method,
  }) as Promise<IRecipeSearchResponse>;
};

/**
 * Get user's favorite recipes
 * @param token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const fetchFavoriteRecipes = async (
  token: string
): Promise<{
  success: boolean;
  message: string;
  recipes: IRecipe[];
}> => {
  return apiRequest(
    API_ROUTES.GET_FAVORITE_RECIPES.url,
    {
      method: API_ROUTES.GET_FAVORITE_RECIPES.method,
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    recipes: IRecipe[];
  }>;
};

/**
 * Set favorite recipes for the authenticated user
 *
 * @param {IRecipe[]} recipes Array of recipe objects to set as favorites
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const setFavoriteRecipes = async (
  recipes: IRecipe[],
  token: string
): Promise<{
  success: boolean;
  message: string;
  recipes: IRecipe[];
}> => {
  return apiRequest(
    API_ROUTES.SET_FAVORITE_RECIPES.url,
    {
      method: API_ROUTES.SET_FAVORITE_RECIPES.method,
      body: JSON.stringify({ recipes }),
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    recipes: IRecipe[];
  }>;
};

/**
 * Remove favorite recipes for the authenticated user
 *
 * @param {IRecipe[]} recipes Array of recipe objects to remove from favorites
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const removeFavoriteRecipe = async (
  recipes: IRecipe[],
  token: string
): Promise<{
  success: boolean;
  message: string;
  recipes: IRecipe[];
}> => {
  return apiRequest(
    API_ROUTES.REMOVE_FAVORITE_RECIPES.url,
    {
      method: API_ROUTES.REMOVE_FAVORITE_RECIPES.method,
      body: JSON.stringify({ recipes }),
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    recipes: IRecipe[];
  }>;
};

/**
 * Get autocomplete suggestions for recipe search
 */
export const autoCompleteRecipeSearch = async (
  query: string,
  number: number = 10
): Promise<IAutocompleteSuggestion[]> => {
  const url = `${API_ROUTES.AUTOCOMPLETE_RECIPE_SEARCH.url}?query=${encodeURIComponent(
    query
  )}&number=${number}`;

  return apiRequest(url, {
    method: API_ROUTES.AUTOCOMPLETE_RECIPE_SEARCH.method,
  }) as Promise<IAutocompleteSuggestion[]>;
};

/**
 * Add a search query to user's search history
 * @param searchQuery  - The search query params to add
 * @param token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const setRecipesSearchHistory = async (
  searchQuery: IBaseRecipe,
  token: string
): Promise<{
  success: boolean;
  message: string;
  searchQuery: IBaseRecipe;
}> => {
  return apiRequest(
    API_ROUTES.ADD_SEARCH_HISTORY.url,
    {
      method: API_ROUTES.ADD_SEARCH_HISTORY.method,
      body: JSON.stringify({ searchQuery }),
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    searchQuery: IBaseRecipe;
  }>;
};

/**
 * Remove a search query from user's search history
 * @param searchQueryId - The ID of the search query to remove
 * @param token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const removeRecipesSearchHistory = async (
  searchQueryId: string,
  token: string
): Promise<{
  success: boolean;
  message: string;
  searchQueryId: string;
}> => {
  return apiRequest(
    API_ROUTES.REMOVE_SEARCH_HISTORY.url,
    {
      method: API_ROUTES.REMOVE_SEARCH_HISTORY.method,
      body: JSON.stringify({ searchQueryId }),
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    searchQueryId: string;
  }>;
};

/**
 * Fetch user's search history
 *
 * @param token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const fetchRecipesSearchHistory = async (
  token: string
): Promise<{
  success: boolean;
  message: string;
  searchHistory: IRecipeSearchParams[];
}> => {
  return apiRequest(
    API_ROUTES.GET_SEARCH_HISTORY.url,
    {
      method: API_ROUTES.GET_SEARCH_HISTORY.method,
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    searchHistory: IRecipeSearchParams[];
  }>;
};

/**
 * Get viewed recipes for the authenticated user
 *
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const fetchViewedRecipes = async (
  token: string
): Promise<{
  success: boolean;
  message: string;
  recipeIds: number[];
}> => {
  return apiRequest(
    API_ROUTES.GET_VIEWED_RECIPES.url,
    {
      method: API_ROUTES.GET_VIEWED_RECIPES.method,
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    recipeIds: number[];
  }>;
};

/**
 * Get count of viewed recipes for the authenticated user
 *
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const getViewedRecipesCount = async (
  token: string
): Promise<{
  success: boolean;
  message: string;
  count: number;
}> => {
  return apiRequest(
    API_ROUTES.GET_VIEWED_RECIPES_COUNT.url,
    {
      method: API_ROUTES.GET_VIEWED_RECIPES_COUNT.method,
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    count: number;
  }>;
};
