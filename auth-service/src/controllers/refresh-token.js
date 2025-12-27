const logger = require("../utils/logger");

const refreshController = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = refreshController;
