const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IngredientInstanceSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient", require: true },
  buy_date: { type: Date, required: true },
  exp_date: {type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Fresh", "Alive", "Dying", "Dead"],
    default: "Unknown"
  }
});

IngredientInstanceSchema.virtual("url").get(function() {
  return `/api/ingredientinstance/${this._id}`;
})

module.exports = mongoose.model("IngredientInstance", IngredientInstanceSchema);