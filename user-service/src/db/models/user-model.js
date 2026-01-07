const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    authUserId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // email format validation
    },
    name: { type: String, trim: true },
    roles: { type: [String], enum: ["USER", "ADMIN"], default: ["USER"] },
    status: { type: String, enum: ["ACTIVE", "SUSPENDED"], default: "ACTIVE" },
    preferences: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
    },
    lastLoginAt: { type: Date },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for soft-delete queries
userSchema.index({ deletedAt: 1 });

module.exports = mongoose.model("User", userSchema);
