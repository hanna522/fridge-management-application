const { body, validationResult } = require("express-validator");
const Ingredient = require("../model/ingredient");
const IngredientInstance = require("../model/ingredientInstance");

/// Create ///
// GET request for creating an ingredient instance. NOTE This must come before routes that display ingredient instances
exports.getIngredientInstanceCreateForm = async (req, res) => {
  try {
    const allIngredients = await Ingredient.find()
      .populate("category")
      .sort({ name: 1 })
      .exec();
    return res.status(200).json({
      ingredient_list: allIngredients,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// Handle ingredient instance create on POST
exports.createIngredientInstance = [
  body("ingredient").isLength({ min: 1 }).escape(),
  body("buy_date").toDate(),
  body("exp_date").toDate(),
  body("status").escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const ingredient = await Ingredient.findById(req.body.ingredient).exec();
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const ingredientInstance = new IngredientInstance({
      ingredient: req.body.ingredient,
      buy_date: req.body.buy_date,
      exp_date: req.body.exp_date,
      status: req.body.status,
      user: req.user._id, // Associate with the logged-in user
    });

    if (!errors.isEmpty()) {
      const allIngredients = await Ingredient.find({})
        .populate("category")
        .sort({ title: 1 })
        .exec();

      return res.status(400).json({
        ingredient_list: allIngredients,
        ingredientInstance: ingredientInstance,
        errors: errors.array(),
      });
    } else {
      await ingredientInstance.save();
      const addedIngredientInstance = await ingredientInstance.populate({
        path: "ingredient",
        populate: { path: "category" },
      });
      res.status(201).json({
        message: "Ingredient instance created successfully",
        ingredientInstance: addedIngredientInstance,
      });
    }
  },
];

// GET request for list of all ingredient instances for a specific user
exports.getIngredientInstance = async (req, res) => {
  try {
    const allIngredientInstance = await IngredientInstance.find({
      user: req.user._id,
    }) // Fetch only instances for the logged-in user
      .populate({
        path: "ingredient",
        populate: { path: "category" },
      })
      .sort({
        status: 1,
      });
    return res.status(200).json({
      data: allIngredientInstance,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// Display ingredient instance update form on GET
exports.getIngredientInstanceUpdateForm = async (req, res) => {
  try {
    const [ingredientinstance, allIngredient] = await Promise.all([
      IngredientInstance.findById(req.params.id)
        .populate({
          path: "ingredient",
          populate: { path: "category" },
        })
        .exec(),
      Ingredient.find(),
    ]);
    return res.status(200).json({
      ingredient_list: allIngredient,
      selected_ingredient: ingredientinstance.ingredient._id,
      ingredientinstance: ingredientinstance,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// PUT ingredient Instance
exports.updateIngredientInstance = [
  body("ingredient").isLength({ min: 1 }).escape(),
  body("buy_date").toDate(),
  body("exp_date").toDate(),
  body("status").escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const ingredientInstance = new IngredientInstance({
      ingredient: req.body.ingredient,
      buy_date: req.body.buy_date,
      exp_date: req.body.exp_date,
      status: req.body.status,
      _id: req.params.id,
      user: req.user._id, // Ensure the user association is maintained
    });

    if (!errors.isEmpty()) {
      const allIngredients = await Ingredient.find().sort({ name: 1 }).exec();

      return res.status(400).json({
        ingredient_list: allIngredients,
        selected_ingredient: ingredientInstance.ingredient._id,
        ingredientinstance: ingredientInstance,
        errors: errors.array(),
      });
    } else {
      const updatedInstance = await IngredientInstance.findByIdAndUpdate(
        req.params.id,
        ingredientInstance,
        { new: true }
      ).populate({
        path: "ingredient",
        populate: { path: "category" },
      });
      res.status(200).json({
        message: "Ingredient instance updated successfully",
        ingredientInstance: updatedInstance,
      });
    }
  },
];

//Delete Ingredient Instance
exports.deleteIngredientInstance = async (req, res) => {
  try {
    const ingredientInstance = await IngredientInstance.findByIdAndDelete(
      req.params.id
    );

    if (!ingredientInstance) {
      return res.status(404).json({ message: "Ingredient instance not found" });
    }

    res
      .status(200)
      .json({ message: "Ingredient instance deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
