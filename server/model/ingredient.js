const mongoose = require('mongoose');
const category = require('category');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {type: String, required: true, maxLength: 50 },
  category: {type: category, required: true},
  rec_exp_date: { type: Number }
});

IngredientSchema.virtual("url").get(function() {
  return `/catalog/ingredient/${this._id}`
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);

module.export = Ingredient;