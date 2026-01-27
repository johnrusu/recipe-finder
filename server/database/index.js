const mongoose = require("mongoose");

// constants
const { MONGODB_URI } = require("../constants/index.js");

const initializeDatabase = async () => {
  const maxRetries = 2; // Reduced from 3
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Connecting to MongoDB... (attempt ${attempt}/${maxRetries})`
      );

      // Use the connection string directly
      const connectionUri = MONGODB_URI;
      console.log(`Using URI: ${connectionUri.substring(0, 50)}...`);

      const dbConnection = await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      return dbConnection;
    } catch (error) {
      lastError = error;
      console.error(
        `MongoDB connection attempt ${attempt} failed:`,
        error.message
      );

      if (attempt < maxRetries) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  console.error("MongoDB connection failed after all retries");
  throw lastError;
};

const usersSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: false },
  name: { type: String, required: false },
});

const favoritesRecipesSchema = new mongoose.Schema({
  recipeIds: [{ type: String, required: true }],
  auth0Id: { type: String, required: true, unique: true },
});

const usersModel = mongoose.model("User", usersSchema, "users-collection");
const favoritesRecipesModel = mongoose.model(
  "FavoritesRecipe",
  favoritesRecipesSchema,
  "favorites-recipes-collection"
);

// User database methods
const createOrUpdateUser = async (userData) => {
  const { auth0Id, email, name } = userData;

  try {
    const existingUser = await usersModel.findOne({ auth0Id });

    if (existingUser) {
      // Update existing user
      existingUser.email = email;
      existingUser.name = name;
      await existingUser.save();
      return existingUser;
    } else {
      // Create new user
      const newUser = new usersModel({
        userId: auth0Id, // Use auth0Id as userId
        auth0Id,
        email,
        name,
      });
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    throw new Error(`Error creating/updating user: ${error.message}`);
  }
};

const getUserByAuth0Id = async (auth0Id) => {
  try {
    return await usersModel.findOne({ auth0Id });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// recipes database methods
const setFavoritesRecipes = async (auth0Id, recipeIds) => {
  try {
    console.log(`[DB] Setting favorites for ${auth0Id}:`, recipeIds);

    let existingUser = await usersModel.findOne({ auth0Id });

    // If user doesn't exist yet, create a placeholder user
    if (!existingUser) {
      console.log(`[DB] User ${auth0Id} not found, creating placeholder...`);
      existingUser = new usersModel({
        userId: auth0Id,
        auth0Id,
        email: `${auth0Id}@placeholder.local`,
        name: "Placeholder User",
      });
      await existingUser.save();
    }

    // Find and update existing favorites, or create new one
    const recipesFavorites = await favoritesRecipesModel.findOneAndUpdate(
      { auth0Id },
      { auth0Id, recipeIds },
      { upsert: true, new: true }
    );
    console.log(`[DB] Favorites saved successfully`);
    return recipesFavorites;
  } catch (error) {
    console.error(`[DB] Error saving favorites:`, error.message);
    throw new Error(`Error saving favorites: ${error.message}`);
  }
};

// remove favorite recipes
const removeFavoritesRecipes = async (auth0Id, recipeIds) => {
  try {
    console.log(`[DB] Removing favorites for ${auth0Id}:`, recipeIds);

    // Remove recipe IDs from favorites
    const recipesFavorites = await favoritesRecipesModel.findOneAndUpdate(
      { auth0Id },
      { $pull: { recipeIds: { $in: recipeIds } } },
      { new: true }
    );
    console.log(`[DB] Favorites removed successfully`);
    return recipesFavorites;
  } catch (error) {
    console.error(`[DB] Error removing favorites:`, error.message);
    throw new Error(`Error removing favorites: ${error.message}`);
  }
};

const closeDatabase = async () => {
  await mongoose.connection.close();
};

module.exports = {
  // Database methods
  initializeDatabase,
  closeDatabase,

  // User methods
  usersModel,
  createOrUpdateUser,
  getUserByAuth0Id,

  // Recipes methods
  favoritesRecipesModel,
  setFavoritesRecipes,
  removeFavoritesRecipes,
};
