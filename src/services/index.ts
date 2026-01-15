import { API_ROUTES } from "@/constants/routes";

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface IUserData {
  auth0Id: string;
  email: string;
  name?: string;
}

interface IUser extends IUserData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

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
