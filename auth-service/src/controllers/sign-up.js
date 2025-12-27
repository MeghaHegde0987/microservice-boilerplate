const { User } = require("../db/schema-model");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    logger.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signupController;
