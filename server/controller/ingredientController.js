const { body, validationResult } = require("express-validator");
const Ingredient = require("../model/ingredient");
const Category = require("../model/category");

/// Create ///
// GET request for creating an ingredient instance. NOTE This must come before routes that display ingredient instances
exports.getIngredientCreateForm = async (req, res) => {
  try {
    const allIngredients = await Ingredient.find({ user: req.user._id })
      .populate("category")
      .sort({ name: 1 })
      .exec();
    const allCategory = await Category.find().sort({ name: 1 }).exec();
    return res.status(200).json({
      ingredient_list: allIngredients,
      category_list: allCategory,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// Handle ingredient instance create on POST
exports.createIngredient = [
  body("name").isLength({ min: 1 }).escape(),
  body("category").isLength({ min: 1 }).escape(),
  body("rec_exp_date").toInt(),

  async (req, res) => {
    const errors = validationResult(req);

    const category = await Category.findById(req.body.category).exec();
    if (!category) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const ingredient = new Ingredient({
      name: req.body.name,
      category: req.body.category,
      rec_exp_date: req.body.rec_exp_date,
      user: req.user._id, // Associate with the logged-in user
    });

    if (!errors.isEmpty()) {
      const allIngredients = await Ingredient.find()
        .populate("category")
        .sort({ name: 1 })
        .exec();
      const allCategory = await Category.find().sort({ name: 1 }).exec();

      return res.status(400).json({
        ingredient_list: allIngredients,
        category_list: allCategory,
        ingredient: ingredient,
        errors: errors.array(),
      });
    } else {
      await ingredient.save();
      const addedIngredient = await ingredient.populate("category");
      res.status(201).json({
        message: "Ingredient created successfully",
        ingredient: addedIngredient,
      });
    }
  },
];

// GET request for list of all ingredient instances for a specific user
exports.getIngredient = async (req, res) => {
  try {
    const allIngredients = await Ingredient.find({
      user: req.user._id,
    }) // Fetch only instances for the logged-in user
      .populate("category")
      .sort({ name: 1 });
    return res.status(200).json({
      data: allIngredients,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// Display ingredient update form on GET
exports.getIngredientUpdateForm = async (req, res) => {
  try {
    const [ingredient, allIngredients] = await Promise.all([
      Ingredient.findById(req.params.id).populate("category").exec(),
      Ingredient.find({ user: req.user._id }),
    ]);
    return res.status(200).json({
      ingredient_list: allIngredients,
      selected_ingredient: ingredient._id,
      ingredient: ingredient,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// PUT ingredient
exports.updateIngredient = [
  body("name").isLength({ min: 1 }).escape(),
  body("category").isLength({ min: 1 }).escape(),
  body("rec_exp_date").toInt(),

  async (req, res) => {
    const errors = validationResult(req);

    const ingredient = new Ingredient({
      name: req.body.name,
      category: req.body.category,
      rec_exp_date: req.body.rec_exp_date,
      _id: req.params.id,
      user: req.user._id, // Ensure the user association is maintained
    });

    if (!errors.isEmpty()) {
      const allIngredients = await Ingredient.find().sort({ name: 1 }).exec();

      return res.status(400).json({
        ingredient_list: allIngredients,
        selected_ingredient: ingredient._id,
        ingredient: ingredient,
        errors: errors.array(),
      });
    } else {
      const updatedIngredient = await Ingredient.findByIdAndUpdate(
        req.params.id,
        ingredient,
        { new: true }
      ).populate("category");
      res.status(200).json({
        message: "Ingredient updated successfully",
        ingredient: updatedIngredient,
      });
    }
  },
];

// Delete Ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
