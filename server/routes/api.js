const express = require('express');
const router = express.Router();

const Ingredient = require('../model/ingredient');
const IngredientInstance = require('../model/ingredientInstance');

/// HOME ROUTES ///

// GET home page
router.get("/home", (req, res) => {
  const homeDate = { message: "Welcome to the Home API!" };
  res.json(homeDate);
});

/// FRIDGE ROUTES ///

// GET all ingredient instances
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

module.exports = router;

/*
router.get('/home', (req, res) => {
  const homeDate = { message: "Welcome to the Home API!" };
  res.json(homeDate);
})

router.get('/fridge', (req, res) => {
  const fridgeData = { items: ["Milk", "Eggs", "Butter"] };
  res.json(fridgeData);
})

module.exports = router
*/