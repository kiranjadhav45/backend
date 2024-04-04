const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import the User model
// Route: POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    // Extract user data from the request body
    const { name, username, email, password, mobile, userRole } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "Email is already registered", status: "error" });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      username,
      email,
      password,
      mobile,
      userRole: userRole ? "partner" : "consumer",
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", status: "success" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(200).json({ message: "Bad Request", status: "error" });
  }
});

// Route: POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    // Extract login credentials from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", status: "error" });
    }

    // Check if the password is correct
    if (password !== user.password) {
      return res
        .status(200)
        .json({ message: "Incorrect username or  password", status: "error" });
    }

    res
      .status(200)
      .json({ message: "Login successful", user, status: "success" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(200).json({ message: "Internal server error", status: "error" });
  }
});

// Route: GET /api/users/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", status: "error" });
    }

    res.status(200).json({ user, status: "success" });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(200).json({ message: "Internal server error", status: "error" });
  }
});

// Route: PUT /api/users/:userId
router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, username, email, profilePicture, mobile } = req.body;

    // Find and update the user by userId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePicture, updatedAt: new Date(), mobile },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route: PUT /api/users/:userId/change-password
router.put("/:userId/change-password", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches
    if (currentPassword !== user.password) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
