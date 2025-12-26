const express = require("express");
require("dotenv").config();
const connectDB = require("./db/db-connection.js");
const routes = require("./routes/route.js");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB(); 

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Auth Service is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
