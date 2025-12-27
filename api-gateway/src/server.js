require("dotenv").config();
const express = require("express");
const proxyRoutes = require("./routes/proxy-route.js");
const logger = require("./utils/logger");

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  logger.info(`API Gateway received: ${req.method} ${req.url}`);
  next();
});

proxyRoutes(app);

app.get("/", (req, res) => res.send("API Gateway running!"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`API Gateway running on port ${PORT}`));
