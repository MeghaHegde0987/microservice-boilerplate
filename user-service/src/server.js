const express = require("express");
require("dotenv").config(); // Load environment variables first
const mongoose = require("mongoose");
const app = express();
const logger = require("./utils/logger");
const routes = require("./routes/route.js");
const initDB = require("./db/db-init");

// Middleware
app.use(express.json());

// Routes
app.use(routes);

// Health Check
app.use("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "User Service" });
});

const PORT = process.env.PORT || 5002;

async function startServer() {
  try {
    // 1. Initialize DB (Connect + Seed)
    await initDB(); 
    logger.info("Database initialized successfully.");

    // 2. Start the Express server
    const server = app.listen(PORT, () => {
      logger.info(`User service running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // 3. Graceful Shutdown (Essential for 2026 production environments)
    const shutdown = async () => {
      logger.info("Shutting down gracefully...");
      server.close(async () => {
        await mongoose.connection.close();
        logger.info("Closed out remaining connections.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (err) {
    logger.error("Critical failure during startup", { error: err.message });
    process.exit(1); 
  }
}

// Global listeners for unhandled errors
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

startServer();
