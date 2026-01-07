const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config");

module.exports = function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.headers["x-user-id"] = decoded.userId;
    req.headers["x-user-roles"] = decoded.roles?.join(",") || "";

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

