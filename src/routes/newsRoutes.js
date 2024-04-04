const express = require("express");
const router = express.Router();
const News = require("../models/newsModel");

// Route: POST /api/articles
router.post("/", async (req, res) => {
  try {
    const requiredFields = ["title", "content", "author", "category"];
    const missingFields = requiredFields.filter((field) => !req.body[field]); // Check for missing fields

    if (missingFields.length > 0) {
      return res.status(200).json({
        message: `These fields are required: ${missingFields.join(", ")}`,
        status: "error",
      });
    }

    const newNews = new News(req.body);
    await newNews.save();
    res
      .status(201)
      .json({ message: "News created successfully", status: "success" });
  } catch (error) {
    console.error("Error creating News:", error);
    res
      .status(500)
      .json({ message: "Something Went Wrong !", status: "error" });
  }
});

// Route: GET /api/articles
// router.get("/", async (req, res) => {
//   try {
//     const news = await News.find();

//     // Increment view count for all Newss
//     await News.updateMany({}, { $inc: { views: 1 } });

//     res.status(200).json(news);
//   } catch (error) {
//     console.error("Error fetching articles:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// router.get("/", async (req, res) => {
//   try {
//     // Fetch news with populated user objects
//     const populatedNews = await News.find().populate({
//       path: "author",
//       select: "name profilePicture", // Include only name and email fields
//     });

//     // Increment view count for each fetched News
//     await Promise.all(
//       populatedNews.map(async (news) => {
//         await News.findByIdAndUpdate(news._id, { $inc: { views: 1 } });
//       })
//     );

//     res.status(200).json(populatedNews);
//   } catch (error) {
//     console.error("Error fetching articles:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    console.log('req', req.query)
    const sortBy = req.query.sortBy || "views"; // Default to sorting by views
    const order = req.query.order || "desc"; // Default to descending order
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const populatedNews = await News.find()
      .populate({
        path: "author",
        select: "name profilePicture",
      })
      .sort({ [sortBy]: order }) // Apply sorting
      .skip(skip) // Skip documents based on pagination
      .limit(limit); // Limit the number of documents returned

    const totalNewsCount = await News.countDocuments({}); // Count all documents

    const totalPages = Math.ceil(totalNewsCount / limit); // Calculate total pages

    await Promise.all(
      populatedNews.map(async (news) => {
        await News.findByIdAndUpdate(news._id, { $inc: { views: 1 } });
      })
    );

    res.status(200).json({
      data: populatedNews,
      status: "success",
      type: req.query.sortBy,
      pagination: {
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(200).json({ message: "Internal server error", status: "error" });
  }
});

// Route: GET /api/articles/:articleId
router.get("/:articleId", async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Find the article by ID and increment view count
    const article = await News.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route: PUT /api/articles/:articleId
router.put("/:articleId", async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const { title, content, imageUrl, tags } = req.body;

    // Find the article by ID and update it
    const updatedArticle = await News.findByIdAndUpdate(
      articleId,
      {
        title,
        content,
        imageUrl,
        tags,
        $inc: { views: 1 },
        $inc: { version: 1 },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route: DELETE /api/articles/:articleId
router.delete("/:articleId", async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Find the article by ID and delete it
    const deletedArticle = await News.findByIdAndDelete(articleId);

    if (!deletedArticle) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
