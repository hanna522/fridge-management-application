const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient", require: true },
  possess: {
    type: String,
    required: true,
    enum: ["yes", "no"],
    default: "Unknown",
  },
});

ShoppingListSchema.virtual("url").get(function () {
  return `/api/shoppinglist/${this._id}`;
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
