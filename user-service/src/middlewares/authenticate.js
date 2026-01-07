const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.sub,       // Auth Service should include sub = user id
      email: decoded.email,
      role: decoded.role,    // optional
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
