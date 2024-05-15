require("dotenv").config();

const mongoose = require("mongoose");

mongoDB_url = process.env.MongoDB;

exports.mongoDB = async () => {
  try {
    await mongoose.connect(mongoDB_url);
    console.log("Connected");
  } catch (err) {
    console.log("MongoDB connection failed", err);
  }
};
