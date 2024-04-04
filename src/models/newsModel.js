const mongoose = require("mongoose");

// Define the article schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  likes: { type: Number, default: 10 },
  views: { type: Number, default: 10 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
});

// Create the Article model based on the schema
const News = mongoose.model("News", newsSchema);

module.exports = News;
