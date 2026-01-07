const User = require("../db/models/user-model");
const logger = require("../utils/logger");

// GET /profile - Get current user profile
const getProfile = async (req, res) => {
  try {
    // x-user-id was injected by the Gateway after verifying JWT
    const authUserId = req.headers["x-user-id"];

    const user = await User.findOne({ authUserId }).select("-__v");
    
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    logger.error("Get Profile Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports =  getProfile;

