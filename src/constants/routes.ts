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
    url: `${BASE_URL}/api/users`,
    protected: true,
    description: "Create or update user after Auth0 login",
  },

  GET_CURRENT_USER: {
    method: "GET",
    url: `${BASE_URL}/api/users/me`,
    protected: true,
    description: "Get current authenticated user",
  },

  GET_RECEIPTS: {
    method: "GET",
    url: `${BASE_URL}/api/receipts`,
    protected: true,
    description: "Get saved receipts for the authenticated user",
  },

  SAVE_RECEIPT: {
    method: "POST",
    url: `${BASE_URL}/api/receipts`,
    protected: true,
    description: "Save a new receipt for the authenticated user",
  },

  DELETE_RECEIPT: {
    method: "DELETE",
    url: `${BASE_URL}/api/receipts/:id`,
    protected: true,
    description: "Delete a receipt by ID for the authenticated user",
  },

  UPDATE_RECEIPT: {
    method: "PUT",
    url: `${BASE_URL}/api/receipts/:id`,
    protected: true,
    description: "Update a receipt by ID for the authenticated user",
  },
} as const;
