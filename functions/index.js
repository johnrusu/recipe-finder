const functions = require("firebase-functions");

// Load dotenv for local development
require("dotenv").config();

// Ensure we're in production mode for Cloud Functions
process.env.NODE_ENV = "production";

// Load the server app
let app;
try {
  app = require("./server/index.js");
} catch (error) {
  console.error("Error loading server:", error);
  // Create a simple error app if server fails to load
  const express = require("express");
  app = express();
  app.use((req, res) => {
    res
      .status(500)
      .json({ error: "Server failed to initialize", message: error.message });
  });
}

// Create Cloud Function that uses the pre-loaded server
exports.api = functions.https.onRequest((req, res) => {
  // Map Firebase config to process.env for EACH REQUEST
  const config = functions.config();
  if (config.api) {
    process.env.API_RECIPE_KEY =
      config.api.recipe_key || process.env.API_RECIPE_KEY;
    process.env.SPOONACULAR_BASE_URL =
      config.api.spoonacular_base_url || process.env.SPOONACULAR_BASE_URL;
    process.env.MONGODB_URI = config.api.mongodb_uri || process.env.MONGODB_URI;
    process.env.AUTH0_AUDIENCE =
      config.api.auth0_audience || process.env.AUTH0_AUDIENCE;
    process.env.AUTH0_DOMAIN =
      config.api.auth0_domain || process.env.AUTH0_DOMAIN;
    process.env.AUTH0_CLIENT_ID =
      config.api.auth0_client_id || process.env.AUTH0_CLIENT_ID;
    process.env.AUTH0_ISSUER =
      config.api.auth0_issuer || process.env.AUTH0_ISSUER;
    process.env.USE_MOCK_DATA =
      config.api.use_mock_data || process.env.USE_MOCK_DATA;
    process.env.MOCK_DATA_PATH =
      config.api.mock_data_path || process.env.MOCK_DATA_PATH;
    process.env.MOCK_RECIPE_DETAILS_PATH =
      config.api.mock_recipe_details_path ||
      process.env.MOCK_RECIPE_DETAILS_PATH;
  }

  app(req, res);
});
