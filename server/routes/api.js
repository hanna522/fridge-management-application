const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");

const Ingredient = require('../model/ingredient');
const IngredientInstance = require('../model/ingredientInstance');
const Category = require("../model/category");

//// HOME ROUTES ////

// GET home page
router.get("/home", (req, res) => {
  const homeDate = { message: "Welcome to the Home API!" };
  res.json(homeDate);
});

/// FRIDGE ROUTES ///

// CREATE //

// GET request for creating an ingredient instance. NOTE This must come before routes that display ingredient instances
router.get("/fridgeinstance/create", async (req, res) => {
  try {
    const allIngredients = await Ingredient.find().sort({title:1}).exec();
    return res.status(200).json({
      ingredient_list: allIngredients,
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
})

// Handle ingredient instance create on POST
router.post("/fridgeinstance/create", [
  body("ingredient").isLength({min:1}).escape(),
  body("buy_date").toDate(),
  body("exp_date").toDate(),
  body("status").escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const ingredientInstance = new IngredientInstance({
      ingredient: req.body.ingredient,
      buy_date: req.body.buy_date,
      exp_date: req.body.exp_date,
      status: req.body.status
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const allIngredients = await Ingredient.find().sort({ name: 1 }).exec();

      return res.status(400).json({
        ingredient_list: allIngredients,
        ingredientInstance: ingredientInstance,
        errors: errors.array()
      });
    } else {
      // Data from form is valid.
      // Save ingredientInstance.
      await ingredientInstance.save();
      res.status(201).json({ message: "Ingredient instance created successfully", ingredientInstance });
    }
  }
])

// READ //

// GET request for list of all ingredient instances
router.get("/fridgeinstance", async (req, res) => {
  try {
    const allIngredientInstance = await IngredientInstance.find({}).populate('ingredient').sort({
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
router.get("/fridgeinstance/update", async (req, res) => {
  try {
    const [ingredientinstance, allIngredient] = await Promise.all([
      IngredientInstance.findById(req.params.id).populate("ingredient").exec(),
      Ingredient.find(),
    ]);
    return res.status(200).json({
      ingredient_list: allIngredient,
      selected_ingredient: ingredientinstance.ingredient._id,
      ingredientinstance: ingredientinstance``
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
});

// Handle ingredient instance update on POST
router.get("/fridgeinstance/update", [
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
        ingredient_list: allIngredient,
        selected_ingredient: ingredientinstance.ingredient._id,
        ingredientinstance: ingredientinstance,
        errors: errors.array(),
      });
    } else {
      await IngredientInstance.findByIdAndUpdate(req.params.id, ingredientInstance, {});
    }

  }
]);


// DELETE //

module.exports = router;