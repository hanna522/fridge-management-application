const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const mongoDB_url = process.env.MongoDB;

const Category = require("../model/category");

async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  console.log(`Added Category: ${name}`);
}

async function createCategories() {
  try {
    const existingCategories = await Category.find().exec();
    if (existingCategories.length === 0) {
      console.log("Adding Categories");
      await Promise.all([
        categoryCreate(0, "Meat"),
        categoryCreate(1, "Vegetable"),
        categoryCreate(2, "Grain"),
        categoryCreate(3, "Fruit"),
        categoryCreate(4, "Instant"),
        categoryCreate(5, "Snack"),
        categoryCreate(6, "etc"),
      ]);
      console.log("Initial categories have been added.");
    } else {
      console.log("Categories already exist.");
    }
  } catch (err) {
    console.error("Error initializing categories:", err);
  }
}

exports.mongoDB = async () => {
  try {
    await mongoose.connect(mongoDB_url, {});
    console.log("Connected:", mongoose.connection.name);
    await createCategories();
    console.log("Initialized categories");
  } catch (err) {
    console.log("MongoDB connection failed", err);
  }
};
