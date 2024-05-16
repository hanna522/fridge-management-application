const express = require('express');
const router = express.Router();

const Ingredient = require('../model/ingredient');

/// HOME ROUTES ///

// GET home page
router.get("/home", (req, res) => {
  const homeDate = { message: "Welcome to the Home API!" };
  res.json(homeDate);
});

/// FRIDGE ROUTES ///

// GET all ingredients
router.get("/fridge", async (req, res) => {
  try {
    const allIngredients = await Ingredient.find({}).sort({ status: 1 });
    return res.status(200).json({
      data: allIngredients,
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