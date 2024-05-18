const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IngredientInstanceSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient", require: true },
  buy_date: { type: Date, required: true },
  exp_date: {type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Fresh", "Alive", "Dying", "Dead", "Unknown"],
    default: "Unknown"
  }
});

IngredientInstanceSchema.virtual("url").get(function() {
  return `/api/ingredientinstance/${this._id}`;
})

// use pre-save hook for conditional status
IngredientInstanceSchema.pre("save", function (next) {
  const currentDate = new Date();
  const status_ratio =
    (this.exp_date - currentDate) / (this.exp_date - this.buy_date);
  if (status_ratio < 0) {
    this.status = "Dead";
  } else if (status_ratio < 0.2) {
    this.status = "Dying";
  } else if (status_ratio < 0.5) {
    this.status = "Alive";
  } else {
    this.status = "Fresh";
  }
  next();
});

module.exports = mongoose.model("IngredientInstance", IngredientInstanceSchema);