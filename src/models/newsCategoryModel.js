const mongoose = require('mongoose');

// Define the category schema
const newsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// Create the Category model based on the schema
const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

module.exports = NewsCategory;
