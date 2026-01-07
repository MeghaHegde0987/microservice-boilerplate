const { User } = require("../db/schema-model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user and explicitly check if they exist
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: User not found", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login failed: Incorrect password", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate Tokens 
    // IMPORTANT: Changed 'authUserId' to 'sub' to match OIDC standards 
    // and ensured it matches your user-service middleware expectations.
    const tokenPayload = { 
      sub: user._id, 
      email: user.email,
      role: user.role || "USER" 
    };

    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    // 4. Set Cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "Lax", // "Lax" is better for cross-service redirects than "Strict"
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info("User logged in successfully", { authUserId: user._id });

    // 5. Send Response 
    // Include user info so the frontend doesn't have to decode the JWT
    return res.json({ 
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    logger.error("Login Error", { error: err.message });
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signinController;
