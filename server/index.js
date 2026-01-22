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
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error(
    "Please check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

console.log("✓ All required environment variables are present");

// database
const { initializeDatabase, closeDatabase } = require("./database/index.js");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
initializeDatabase()
  .then(() => {
    console.log("Database connected");
    startServer();
  })
  .catch((err) => {
    console.log({
      message: "Database connection error:",
      error: err.message,
    });
    console.log("Starting server without database connection...");
    startServer();
  });

function startServer() {
  // Load routes
  const routes = require("./routes/index.js");
  app.use(routes);

  // Start the server
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
