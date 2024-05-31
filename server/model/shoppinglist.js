const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
  possess: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ShoppingListSchema.virtual("url").get(function () {
  return `/api/shoppinglist/${this._id}`;
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
