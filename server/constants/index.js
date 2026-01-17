const IS_DEV = process.env.NODE_ENV !== "production";

const MONGODB_URI = IS_DEV
  ? "mongodb://localhost:27017/recipe-finder-db"
  : process.env.MONGO_URI || process.env.MONGODB_URI;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "your-api-identifier";
const AUTH0_ISSUER =
  process.env.AUTH0_ISSUER ||
  process.env.AUTH0_ISSUER_BASE_URL ||
  "https://your-domain.auth0.com/";

const APP_NAME = "Recipe Finder";
const SPOONACULAR_BASE_URL =
  process.env.SPOONACULAR_BASE_URL || "https://api.spoonacular.com";
const SPOONACULAR_API_KEY = process.env.API_RECIPE_KEY;

module.exports = {
  MONGODB_URI,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  APP_NAME,
  SPOONACULAR_BASE_URL,
  SPOONACULAR_API_KEY,
};
