const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const IngredientInstance = require("../model/ingredientInstance");
const Category = require("../model/category");
const ShoppingList = require("../model/shoppinglist");
const { getHome } = require("../controller/homeController");
const { getCategory } = require("../controller/categoryController");
const {
  getAllShoppingList,
  getOneShoppingList,
  createShoppingList,
  getShoppingListCreateForm,
  updateShoppingList,
  deleteShoppingList,
} = require("../controller/shoppingListController");
const {
  getIngredientInstanceCreateForm,
  createIngredientInstance,
  getIngredientInstance,
  updateIngredientInstance,
  getIngredientInstanceUpdateForm,
  deleteIngredientInstance,
} = require("../controller/ingredientinstanceController");
const { register, login, getUserInfo: getUserInfo } = require("../controller/authController");
const { getIngredientCreateForm, createIngredient, getIngredient, deleteIngredient, getIngredientUpdateForm, updateIngredient } = require("../controller/ingredientController");

router.post("/register", register);
router.post("/login", login);

router.get("/user/:id", auth, getUserInfo);

//// HOME ROUTES ////
router.get("/home", getHome);

/// CATEGORY ROUTES ///
router.get("/category", getCategory);

/// SHOPPING LIST ROUTES ///
router.get("/shoppinglist", auth, getAllShoppingList);
router.get("/shoppinglist/:id", auth, getOneShoppingList);

router.get("/shoppinglist/create", auth, getShoppingListCreateForm);
router.post("/shoppinglist/create", auth, createShoppingList);

router.put("/shoppinglist/:id", auth, updateShoppingList);

router.delete("/shoppinglist/:id", auth, deleteShoppingList);

/// INGREDIENT INSTANCE ROUTES ///
router.get("/fridgeinstance/create", auth, getIngredientInstanceCreateForm);
router.post("/fridgeinstance/create", auth, createIngredientInstance);

router.get("/fridgeinstance", auth, getIngredientInstance);

router.get("/fridgeinstance/:id/update", auth, getIngredientInstanceUpdateForm);
router.put("/fridgeinstance/:id/update", auth, updateIngredientInstance);

router.delete("/fridgeinstance/:id/delete", auth, deleteIngredientInstance);

/// INGREDIENT ROUTES ///
router.get("/ingredient/create", auth, getIngredientCreateForm);
router.post("/ingredient/create", auth, createIngredient);

router.get("/ingredient", auth, getIngredient);

router.get("/ingredient/:id/update", getIngredientUpdateForm);
router.put("ingredient/:id/update", updateIngredient);

router.delete("/ingredient/:id/", auth, deleteIngredient);

module.exports = router;
