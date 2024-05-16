const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoDB_url = process.env.MongoDB;

exports.mongoDB = async () => {
  try {
    await mongoose.connect(mongoDB_url, {});
    console.log("Connected:", mongoose.connection.name);
  } catch (err) {
    console.log("MongoDB connection failed", err);
  }
};
