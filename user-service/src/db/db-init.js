const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust path to your model file

const MONGODB_URI = "mongodb://127.0.0.1:27017/your_database_name";

const initialUsers = [
  {
    authUserId: new mongoose.Types.ObjectId(), // Generating a fake ID for testing
    email: "admin@example.com",
    name: "System Admin",
    roles: ["ADMIN"],
    preferences: { theme: "dark" }
  },
  {
    authUserId: new mongoose.Types.ObjectId(),
    email: "user@example.com",
    name: "John Doe",
    roles: ["USER"],
    preferences: { theme: "light" }
  }
];

async function initDB() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 2. Clear existing users (Optional - use only for fresh dev environments)
    // await User.deleteMany({});

    // 3. Insert users
    for (const userData of initialUsers) {
      // upsert: true ensures it updates if email exists, or creates if it doesn't
      await User.findOneAndUpdate(
        { email: userData.email }, 
        userData, 
        { upsert: true, new: true }
      );
    }

    console.log("Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

module.exports = initDB();
