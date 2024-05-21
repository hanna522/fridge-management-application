const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const Ingredient = require("../model/ingredient");
const IngredientInstance = require("../model/ingredientInstance");
const Category = require("../model/category");

//// HOME ROUTES ////

// GET home page
router.get("/home", (req, res) => {
  const homeDate = { message: "Hello, User Name" };
  res.json(homeDate);
});

/// CATEGORY ROUTES ///

// GET all category
router.get("/category", async (req, res) => {
  try {
    const allCategory = await Category.find().exec({ name: 1});
    return res.status(200).json({
      category_list: allCategory
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
})

/// INGREDIENT (FRIDGE INSTANCE) ROUTES ///

// CREATE //

// GET request for creating an ingredient instance. NOTE This must come before routes that display ingredient instances
router.get("/fridgeinstance/create", async (req, res) => {
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
});

// Handle ingredient instance create on POST
router.post("/fridgeinstance/create", [
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
      res
        .status(201)
        .json({
          message: "Ingredient instance created successfully",
          ingredientInstance: addedIngredientInstance,
        });
    }
  },
]);

// READ //

// GET request for list of all ingredient instances
router.get("/fridgeinstance", async (req, res) => {
  try {
    const allIngredientInstance = await IngredientInstance.find({})
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
});

// UPDATE //
// Display ingredient instance update form on GET
router.get("/fridgeinstance/:id/update", async (req, res) => {
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
});

// Handle ingredient instance update on PUT
router.put("/fridgeinstance/:id/update", [
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
      res
        .status(200)
        .json({
          message: "Ingredient instance updated successfully",
          ingredientInstance: updatedInstance,
        });
    }
  },
]);

// DELETE //
router.delete("/fridgeinstance/:id/delete", async (req, res) => {
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
});

module.exports = router;