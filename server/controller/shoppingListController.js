const ShoppingList = require("../model/shoppinglist");
const Ingredient = require("../model/ingredient");

// GET all shopping list items for a specific user
exports.getAllShoppingList = async (req, res) => {
  try {
    const allShoppingList = await ShoppingList.find({ user: req.user._id }) // Fetch only items for the logged-in user
      .populate("ingredient")
      .exec();
    return res.status(200).json({
      shopping_list: allShoppingList,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// GET a single shopping list item by ID
exports.getOneShoppingList = async (req, res) => {
  try {
    const item = await ShoppingList.findById(req.params.id)
      .populate("ingredient")
      .exec();
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// GET create a new shopping list item
exports.getShoppingListCreateForm = async (req, res) => {
  try {
    const allIngredient = await Ingredient.find().populate("category").exec();
    return res.status(200).json({
      ingredient_list: allIngredient,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// POST create a new shopping list item
exports.createShoppingList = async (req, res) => {
  try {
    const newItem = new ShoppingList({
      ...req.body,
      user: req.user._id, // Associate with the logged-in user
    });
    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// PUT update an existing shopping list item by ID
exports.updateShoppingList = async (req, res) => {
  try {
    const updatedItem = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        user: req.user._id, // Ensure the user association is maintained
      },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};

// DELETE a shopping list item by ID
exports.deleteShoppingList = async (req, res) => {
  try {
    const deletedItem = await ShoppingList.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};
