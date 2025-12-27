const { createLogger, format, transports } = require("winston");

/**
 * Create a logger for a specific service
 * @param {string} serviceName - Name of the microservice
 */
const createServiceLogger = (serviceName) => {
  return createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta: { service: serviceName },
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.errors({ stack: true }), 
      format.json() 
    ),
    transports: [
      new transports.Console() // Console transport is captured by Docker → Loki
    ],
    exitOnError: false,
  });
};

module.exports = createServiceLogger;
