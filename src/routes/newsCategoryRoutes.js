const express = require("express");
const router = express.Router();
const Category = require("../models/newsCategoryModel"); // Import the Category model

// Route: GET /api/categories/:categoryId
router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
