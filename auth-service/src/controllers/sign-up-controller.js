const { User } = require("../db/schema-model");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const axios = require("axios");

const signupController = async (req, res) => {
  let newUser; // Keep track for potential rollback
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user in Auth DB
    newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // 2. Call User Service internally to create profile
    try {
      await axios.post(
        `${process.env.USER_SERVICE_URL}/internal/users`,
        {
          authUserId: newUser._id,
          email,
          name,
        },
        {
          headers: { "x-internal-secret": process.env.INTERNAL_API_SECRET },
          timeout: 5000 // Best practice 2026: Always set a timeout for inter-service calls
        }
      );
    } catch (apiError) {
      // ROLLBACK: If User Service fails, remove the record from Auth DB
      if (newUser) await User.findByIdAndDelete(newUser._id);
      
      logger.error("User Service profile creation failed, rolling back auth user:", apiError.message);
      return res.status(502).json({ message: "Failed to initialize user profile. Please try again." });
    }

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });

  } catch (error) {
    logger.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signupController;
