require("dotenv").config();
const mongoose = require("mongoose");
const { User, Tenant } = require("./schema-model");
const createLogger = require("../../../logger/logger");
const logger = createLogger("auth-service"); // same service name

const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/auth_service";

async function initDB() {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected (init)");

    const defaultTenant = await Tenant.findOne({ name: "Default Tenant" });
    if (!defaultTenant) {
      await Tenant.create({ name: "Default Tenant", domain: "default.com" });
      logger.info("Inserted default tenant");
    }

    logger.info("MongoDB initialized successfully!");
    process.exit(0);
  } catch (err) {
    logger.error("Error initializing MongoDB", { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

initDB();
