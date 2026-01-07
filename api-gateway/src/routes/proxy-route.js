const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit"); // Import it here
const authMiddleware = require("../middlewares/auth-middleware");
const logger = require("../utils/logger");

// Define your rate limiter as a constant right here
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { status: 429, message: "Too many requests, please try again later" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

module.exports = (app) => {
  const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://auth-service:5001";
  const USER_SERVICE = process.env.USER_SERVICE_URL || "http://user-service:5002";

  // Apply 'limiter' directly in the route chain
  app.use(
    "/auth",
    limiter, // Added here as inline middleware
    createProxyMiddleware({
      target: AUTH_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/auth": "" },
      onProxyReq: fixRequestBody,
      onError(err, req, res) {
        logger.error("Auth Service Error:", err);
        res.status(502).json({ message: "Auth Service unreachable" });
      },
    })
  );

  app.use(
    "/users",
    limiter, // You can reuse the same constant for other routes
    authMiddleware,
    createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/users": "" },
      onProxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req);
        if (req.headers["x-user-id"]) {
          proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
        }
      },
      // ... onError
    })
  );
};
