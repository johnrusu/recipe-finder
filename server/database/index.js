const mongoose = require("mongoose");

// constants
const { MONGODB_URI } = require("../constants/index.js");

const initializeDatabase = async () => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Connecting to MongoDB... (attempt ${attempt}/${maxRetries})`
      );

      // Use the connection string directly
      const connectionUri = MONGODB_URI;

      const dbConnection = await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 15000,
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

const themesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  theme: { type: String, required: true },
});

const users = mongoose.model("User", usersSchema, "users-collection");
const Theme = mongoose.model("Theme", themesSchema, "theme-collection");

// User database methods
const createOrUpdateUser = async (userData) => {
  const { auth0Id, email, name } = userData;

  try {
    const existingUser = await users.findOne({ auth0Id });

    if (existingUser) {
      // Update existing user
      existingUser.email = email;
      existingUser.name = name;
      await existingUser.save();
      return existingUser;
    } else {
      // Create new user
      const newUser = new users({
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
    return await users.findOne({ auth0Id });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Themes database methods
const createOrUpdateTheme = async (themeData) => {
  const { theme, userId } = themeData;

  try {
    // Use findOneAndUpdate with upsert to avoid race conditions
    const updatedTheme = await Theme.findOneAndUpdate(
      { userId }, // filter
      { theme }, // update
      {
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
        runValidators: true, // run schema validators
      }
    );

    return updatedTheme;
  } catch (error) {
    throw new Error(`Error creating/updating theme: ${error.message}`);
  }
};

const getThemeByUserId = async (userId) => {
  try {
    const currentTheme = await Theme.findOne({ userId }).sort({ _id: -1 });
    return currentTheme;
  } catch (error) {
    throw new Error(`Error fetching theme: ${error.message}`);
  }
};

const closeDatabase = async () => {
  await mongoose.connection.close();
};

module.exports = {
  initializeDatabase,
  closeDatabase,
  users,
  // User methods
  createOrUpdateUser,
  getUserByAuth0Id,
  // Themes methods
  createOrUpdateTheme,
  getThemeByUserId,
};
