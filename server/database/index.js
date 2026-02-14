const mongoose = require("mongoose");

// constants
const { MONGODB_URI } = require("../constants/index.js");

// Define Mongoose schemas

const usersSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: false },
  name: { type: String, required: false },
});
const usersModel = mongoose.model("User", usersSchema, "users-collection");

const favoritesRecipesSchema = new mongoose.Schema({
  recipes: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      imageType: { type: String, required: true },
      readyInMinutes: { type: Number, required: true },
      servings: { type: Number, required: true },
      sourceUrl: { type: String, required: true },
      vegetarian: { type: Boolean, required: true },
      vegan: { type: Boolean, required: true },
      glutenFree: { type: Boolean, required: true },
      dairyFree: { type: Boolean, required: true },
      veryHealthy: { type: Boolean, required: true },
      cheap: { type: Boolean, required: true },
      veryPopular: { type: Boolean, required: true },
      sustainable: { type: Boolean, required: true },
      lowFodmap: { type: Boolean, required: true },
      weightWatcherSmartPoints: { type: Number, required: true },
      gaps: { type: String, required: true },
      preparationMinutes: { type: Number, required: false },
      cookingMinutes: { type: Number, required: false },
      aggregateLikes: { type: Number, required: true },
      healthScore: { type: Number, required: true },
      creditsText: { type: String, required: true },
      license: { type: String, required: true },
      sourceName: { type: String, required: true },
      pricePerServing: { type: Number, required: true },
      extendedIngredients: { type: [Object], required: false },
      summary: { type: String, required: false },
      instructions: { type: String, required: false },
    },
  ],
  auth0Id: { type: String, required: true, unique: true },
});

const favoritesRecipesModel = mongoose.model(
  "FavoritesRecipe",
  favoritesRecipesSchema,
  "favorites-recipes-collection"
);

const recipesSearchHistorySchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  searchQueries: [
    {
      query: { type: String, required: true },
      type: { type: String, required: false },
      cuisine: { type: String, required: false },
      diet: { type: String, required: false },
      intolerances: { type: String, required: false },
      maxReadyTime: { type: Number, required: false },
      includeIngredients: { type: String, required: false },
      excludeIngredients: { type: String, required: false },
      number: { type: Number, required: false },
      offset: { type: Number, required: false },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const recipesSearchHistoryModel = mongoose.model(
  "RecipesSearchHistory",
  recipesSearchHistorySchema,
  "recipes-search-history-collection"
);

const recipeViewedSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  recipes: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      imageType: { type: String, required: true },
      readyInMinutes: { type: Number, required: true },
      servings: { type: Number, required: true },
      sourceUrl: { type: String, required: true },
      vegetarian: { type: Boolean, required: true },
      vegan: { type: Boolean, required: true },
      glutenFree: { type: Boolean, required: true },
      dairyFree: { type: Boolean, required: true },
      veryHealthy: { type: Boolean, required: true },
      cheap: { type: Boolean, required: true },
      veryPopular: { type: Boolean, required: true },
      sustainable: { type: Boolean, required: true },
      lowFodmap: { type: Boolean, required: true },
      weightWatcherSmartPoints: { type: Number, required: true },
      gaps: { type: String, required: true },
      preparationMinutes: { type: Number, required: false },
      cookingMinutes: { type: Number, required: false },
      aggregateLikes: { type: Number, required: true },
      healthScore: { type: Number, required: true },
      creditsText: { type: String, required: true },
      license: { type: String, required: true },
      sourceName: { type: String, required: true },
      pricePerServing: { type: Number, required: true },
      extendedIngredients: { type: [Object], required: false },
      summary: { type: String, required: false },
      instructions: { type: String, required: false },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
});

const recipeViewedModel = mongoose.model(
  "RecipeViewed",
  recipeViewedSchema,
  "recipe-viewed-collection"
);

// Database connection and methods
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

const closeDatabase = async () => {
  await mongoose.connection.close();
};

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
const getFavoritesRecipes = async (auth0Id) => {
  try {
    console.log(`[DB] Getting favorites for ${auth0Id}`);
    const favorites = await favoritesRecipesModel.findOne({ auth0Id });
    return favorites || [];
  } catch (error) {
    console.error(`[DB] Error getting favorites:`, error.message);
    throw new Error(`Error getting favorites: ${error.message}`);
  }
};

const setFavoritesRecipes = async (auth0Id, recipes) => {
  try {
    console.log(`[DB] Setting favorites for ${auth0Id}:`, recipes);

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

    // First, remove any existing entry with the same recipe ID to avoid duplicates
    await favoritesRecipesModel.findOneAndUpdate(
      { auth0Id },
      { $pull: { recipes: { id: recipe.id } } }
    );

    // Then add the recipe with current timestamp at the beginning of the array
    const recipesFavorites = await favoritesRecipesModel.findOneAndUpdate(
      { auth0Id },
      {
        $push: {
          recipes: {
            $each: [{ ...recipe }],
            $position: 0,
          },
        },
      },
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
const removeFavoritesRecipes = async (auth0Id, recipes) => {
  try {
    console.log(`[DB] Removing favorites for ${auth0Id}:`, recipes);

    // Extract recipe IDs from recipe objects
    const recipeIds = recipes.map((recipe) => recipe.id);

    // Remove recipes by their ID
    const removedFavorites = await favoritesRecipesModel.findOneAndUpdate(
      { auth0Id },
      { $pull: { recipes: { id: { $in: recipeIds } } } },
      { new: true }
    );
    console.log(`[DB] Favorites removed successfully`);
    return removedFavorites;
  } catch (error) {
    console.error(`[DB] Error removing favorites:`, error.message);
    throw new Error(`Error removing favorites: ${error.message}`);
  }
};

// add recipes search history
const createRecipesSearchHistory = async (auth0Id, searchQuery) => {
  try {
    console.log(`[DB] Setting search history for ${auth0Id}:`, searchQuery);

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

    // Find and update existing search history, or create new one
    const setSearchHistoryRecipes =
      await recipesSearchHistoryModel.findOneAndUpdate(
        { auth0Id },
        {
          $push: {
            searchQueries: { $each: [searchQuery], $position: 0, $slice: 50 },
          },
        },
        { upsert: true, new: true }
      );
    console.log(`[DB] Search history saved successfully`);
    return setSearchHistoryRecipes;
  } catch (error) {
    console.error(`[DB] Error saving search history:`, error.message);
    throw new Error(`Error saving search history: ${error.message}`);
  }
};

// remove search history
const removeRecipesSearchHistory = async (auth0Id, searchQueryId) => {
  try {
    console.log(`Removing search history for ${auth0Id}:`, searchQueryId);
    // Remove search query by _id
    const searchHistoryAfterRemove =
      await recipesSearchHistoryModel.findOneAndUpdate(
        { auth0Id },
        { $pull: { searchQueries: { _id: searchQueryId } } },
        { new: true }
      );
    return searchHistoryAfterRemove;
  } catch (error) {
    console.error(`[DB] Error removing search history:`, error.message);
    throw new Error(`Error removing search history: ${error.message}`);
  }
};

// Mark recipe as viewed
const setRecipeViewed = async (auth0Id, recipe) => {
  try {
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

    // First, remove any existing entry with the same recipe ID to avoid duplicates
    await recipeViewedModel.findOneAndUpdate(
      { auth0Id },
      { $pull: { recipes: { id: recipe.id } } }
    );

    // Then add the recipe with current timestamp at the beginning of the array
    const existingView = await recipeViewedModel.findOneAndUpdate(
      { auth0Id },
      {
        $push: {
          recipes: {
            $each: [{ ...recipe, viewedAt: new Date() }],
            $position: 0,
          },
        },
      },
      { upsert: true, new: true }
    );

    return existingView;
  } catch (error) {
    console.error(`[DB] Error marking recipe as viewed:`, error.message);
    throw new Error(`Error marking recipe as viewed: ${error.message}`);
  }
};

// Get user's viewed recipes
const getViewedRecipes = async (auth0Id) => {
  try {
    console.log(`[DB] Getting viewed recipes for ${auth0Id}`);
    const viewedRecipes = await recipeViewedModel.findOne({ auth0Id });
    return viewedRecipes || [];
  } catch (error) {
    console.error(`[DB] Error getting viewed recipes:`, error.message);
    throw new Error(`Error getting viewed recipes: ${error.message}`);
  }
};

// Get count of user's viewed recipes
const getViewedRecipesCount = async (auth0Id) => {
  try {
    console.log(`[DB] Getting viewed recipes count for ${auth0Id}`);
    const viewedRecipes = await recipeViewedModel.findOne({ auth0Id });
    const count = viewedRecipes?.recipes?.length || 0;
    return count;
  } catch (error) {
    console.error(`[DB] Error getting viewed recipes count:`, error.message);
    throw new Error(`Error getting viewed recipes count: ${error.message}`);
  }
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
  getFavoritesRecipes,
  setFavoritesRecipes,
  removeFavoritesRecipes,

  // Recipes Search History methods
  recipesSearchHistoryModel,
  createRecipesSearchHistory,
  removeRecipesSearchHistory,
  recipeViewedModel,
  setRecipeViewed,
  getViewedRecipes,
  getViewedRecipesCount,
};
