const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = `mongodb+srv://kiranjadhav3444:32QDTcNtYQJFo6CR@cluster0.vx9by2h.mongodb.net/testing?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
};

module.exports = connectDB;
