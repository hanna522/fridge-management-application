const express = require('express');
const router = express.Router();

// Home date endpoint
router.get('/home', (req, res) => {
  const homeDate = { message: "Welcome to the Home API!" };
  res.json(homeDate);
})

router.get('/fridge', (req, res) => {
  const fridgeData = { items: ["Milk", "Eggs", "Butter"] };
  res.json(fridgeData);
})

module.exports = router