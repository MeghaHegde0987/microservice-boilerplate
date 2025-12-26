const mongoose = require("mongoose");
const logger = require("../utils/logger");

const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/auth_service";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected (server)");
  } catch (err) {
    logger.error("MongoDB connection failed", { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

module.exports = connectDB;
