const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
  verificationCode: { type: String },
  verificationAttempts: { type: Number, default: 3 },
});

module.exports = mongoose.model("User", UserSchema);
