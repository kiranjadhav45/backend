// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./src/config/connect");
const userRoutes = require("./src/routes/userRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
// Load environment variables from .env file

// Create Express app
const app = express();

// Parse JSON bodies
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('server is running')
})

// MongoDB connection
app.use("/v1/api/users", userRoutes);
app.use("/v1/api/news", newsRoutes);
connectDB();
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
