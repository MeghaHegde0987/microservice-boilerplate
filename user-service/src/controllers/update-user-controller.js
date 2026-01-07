const User = require("../db/models/user-model");
const logger = require("../utils/logger");

// PATCH /profile - Update current user profile
const updateProfile = async (req, res) => {
  try {
    const authUserId = req.headers["x-user-id"];
    const { name, bio, avatarUrl } = req.body;

    // Find and update. We only allow updating specific fields for security.
    const updatedUser = await User.findOneAndUpdate(
      { authUserId },
      { $set: { name, bio, avatarUrl } },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    logger.error("Update Profile Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateProfile;