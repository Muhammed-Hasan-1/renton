const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify logged-in user
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please sign in.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Allow only equipment owners
const authorizeOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({
      message: "Only equipment owners can perform this action",
    });
  }

  next();
};

// Allow only admins
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only administrators can perform this action",
    });
  }

  next();
};

module.exports = {
  authenticateUser,
  authorizeOwner,
  authorizeAdmin,
};