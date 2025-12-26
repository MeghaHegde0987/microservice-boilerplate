const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // Use environment variable for the target service
  const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth-service:5001";

  app.use(
    "/",
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/" },
      onProxyReq(proxyReq, req, res) {
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      onError(err, req, res) {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy error");
      },
    })
  );
};
