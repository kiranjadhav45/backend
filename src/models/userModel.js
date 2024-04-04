const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
  userRole: { type: String, default: 'consumer' },
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
