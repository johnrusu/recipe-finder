const IS_DEV = process.env.NODE_ENV !== "production";

// Helper to get env vars with defaults
const getEnv = (key, def = "") => process.env[key] || def;

// MongoDB connection string with fallback
const MONGODB_URI = IS_DEV
  ? "mongodb://localhost:27017/recipe-finder-db"
  : getEnv("MONGODB_URI") ||
    getEnv("MONGO_URI") ||
    "mongodb://localhost:27017/recipe-finder-db";
const AUTH0_AUDIENCE = getEnv("AUTH0_AUDIENCE", "your-api-identifier");
const AUTH0_ISSUER =
  getEnv("AUTH0_ISSUER") ||
  getEnv("AUTH0_ISSUER_BASE_URL") ||
  "https://your-domain.auth0.com/";

const APP_NAME = "Recipe Finder";
const SPOONACULAR_BASE_URL = getEnv(
  "SPOONACULAR_BASE_URL",
  "https://api.spoonacular.com"
);
const SPOONACULAR_API_KEY = getEnv("API_RECIPE_KEY", "");

module.exports = {
  MONGODB_URI,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  APP_NAME,
  SPOONACULAR_BASE_URL,
  SPOONACULAR_API_KEY,
};
