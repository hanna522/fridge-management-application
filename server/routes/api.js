const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const IngredientInstance = require("../model/ingredientInstance");
const Category = require("../model/category");
const ShoppingList = require("../model/shoppinglist");
const { getHome } = require("../controller/homeController");
const { getCategory } = require("../controller/categoryController");
const { getAllShoppingList, getOneShoppingList, createShoppingList, getShoppingListCreateForm, updateShoppingList, deleteShoppingList } = require("../controller/shoppingListController");
const {
  getIngredientInstanceCreateForm,
  createIngredientInstance,
  getIngredientInstance,
  updateIngredientInstance,
  getIngredientInstanceUpdateForm,
  deleteIngredientInstance,
} = require("../controller/ingredientinstanceController");

//// HOME ROUTES ////
router.get("/home", getHome);

/// CATEGORY ROUTES ///
router.get("/category", getCategory)

/// SHOPPING LIST ROUTES ///
router.get("/shoppinglist", getAllShoppingList);
router.get('/shoppinglist/:id', getOneShoppingList);

router.get("/shoppinglist/create", getShoppingListCreateForm);
router.post("/shoppinglist/create", createShoppingList);

router.put('/shoppinglist/:id', updateShoppingList);

router.delete('/shoppinglist/:id', deleteShoppingList);

/// INGREDIENT INSTANCE ROUTES ///
router.get("/fridgeinstance/create", getIngredientInstanceCreateForm);
router.post("/fridgeinstance/create", createIngredientInstance);

router.get("/fridgeinstance", getIngredientInstance);

router.get("/fridgeinstance/:id/update", getIngredientInstanceUpdateForm);
router.put("/fridgeinstance/:id/update", updateIngredientInstance);

router.delete("/fridgeinstance/:id/delete", deleteIngredientInstance);

module.exports = router;