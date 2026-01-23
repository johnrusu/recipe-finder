// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = [
  "API_RECIPE_KEY",
  "SPOONACULAR_BASE_URL",
  "AUTH0_AUDIENCE",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_ISSUER",
  "USE_MOCK_DATA",
  "MOCK_DATA_PATH",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn("⚠️ Missing environment variables:", missingEnvVars.join(", "));
  console.warn(
    "This may cause API errors. Check Firebase config or .env file."
  );
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
}

console.log("✓ Server initialization started");

// database
const { initializeDatabase, closeDatabase } = require("./database/index.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database in background
initializeDatabase()
  .then(() => {
    setupRoutes();
    console.log("Database connected");
  })
  .catch((err) => {
    console.log({
      message: "Database connection error:",
      error: err.message,
    });
    console.log("Starting server without database connection...");
    setupRoutes();
  });

function setupRoutes() {
  // Load routes
  const routes = require("./routes/index.js");
  // Routes are already prefixed with /api in their path definitions
  app.use(routes);
}

// For local development: listen on a port
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nShutting down gracefully...");
    await closeDatabase();
    process.exit(0);
  });
}

// For Cloud Functions: export the app
module.exports = app;
