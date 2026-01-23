import { API_ROUTES } from "@/constants/routes";

// types
import type {
  ApiRequestOptions,
  IUser,
  IUserData,
  IRecipeSearchParams,
  IRecipeSearchResponse,
  IRecipeDetailsResponse,
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
  params: IRecipeSearchParams
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
export const getRecipeDetails = async (
  recipeId: string | number
): Promise<IRecipeDetailsResponse> => {
  const url = API_ROUTES.GET_RECIPE_DETAILS.url.replace(
    ":recipeId",
    String(recipeId)
  );

  return apiRequest(url, {
    method: API_ROUTES.GET_RECIPE_DETAILS.method,
  }) as Promise<IRecipeDetailsResponse>;
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
 * Set favorite recipes for the authenticated user
 *
 * @param {Array<string | number>} recipeIds Array of recipe IDs to set as favorites
 * @param {string | null} token - Auth0 JWT token
 * @returns {Promise<any>} - Response data
 */
export const setFavoriteRecipes = async (
  recipeIds: Set<number | string>,
  token: string
): Promise<{
  success: boolean;
  message: string;
  recipeIds: Set<number | string>;
}> => {
  return apiRequest(
    API_ROUTES.SET_FAVORITE_RECIPES.url,
    {
      method: API_ROUTES.SET_FAVORITE_RECIPES.method,
      body: JSON.stringify({ recipeIds: Array.from(recipeIds) }),
    },
    token
  ) as Promise<{
    success: boolean;
    message: string;
    recipeIds: Set<number | string>;
  }>;
};
