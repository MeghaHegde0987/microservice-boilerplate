const User = require("../db/models/user-model");
const logger = require("../utils/logger");

// Internal user creation - called by Auth Service
const createUserInternal = async (req, res) => {
  console.log(req.body);
  try {
    // Check internal secret
    const secret = req.headers["x-internal-secret"];
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { authUserId, email, name } = req.body;
    if (!authUserId || !email) {
      return res.status(400).json({ message: "authUserId and email required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ authUserId });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user profile
    const newUser = await User.create({
      authUserId,
      email,
      name,
      roles: ["USER"], // default role
      status: "ACTIVE",
    });

    return res.status(201).json({
      message: "User profile created",
      userId: newUser._id,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports =  createUserInternal ;
