const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 30 }
});

CategorySchema.virtual("url").get(function() {
  return `/api/category/${this._id}`
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;