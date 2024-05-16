console.log(
  "This script populates some test ingredients, categories, and ingredient instances to the database."
);

const userArgs = process.argv.slice(2);

const Ingredient = require("./model/ingredient");
const IngredientInstance = require("./model/ingredientInstance");
const Category = require("./model/category");

const ingredients = [];
const ingredientInstances = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Connected to database:", mongoose.connection.db.databaseName)
  // clear database
  await clearDatabase();
  // add data
  await createCategories();
  await createIngredients();
  await createIngredientInstances();
  mongoose.connection.close();
}

async function clearDatabase() {
  await Category.deleteMany({});
  await Ingredient.deleteMany({});
  await IngredientInstance.deleteMany({});
  console.log("Database cleared.");
}

async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added Category: ${name}`);
}

async function ingredientCreate(index, name, category, rec_exp_date) {
  const ingredient = new Ingredient({
    name: name,
    category: category,
    rec_exp_date: rec_exp_date,
  });
  await ingredient.save();
  ingredients[index] = ingredient;
  console.log(`Added Ingredient: ${name}`);
}

async function ingredientInstanceCreate(
  index,
  ingredient,
  buy_date,
  exp_date,
  status
) {
  const ingredientInstance = new IngredientInstance({
    ingredient: ingredient,
    buy_date: buy_date,
    exp_date: exp_date,
    status: status,
  });
  await ingredientInstance.save();
  ingredientInstances[index] = ingredientInstance;
  console.log(`Added Ingredient Instance: ${ingredient.name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Meat"),
    categoryCreate(1, "Vegetable"),
    categoryCreate(2, "Fruit"),
    categoryCreate(3, "Noodle"),
    categoryCreate(4, "Can/Instant"),
    categoryCreate(5, "Grain"),
  ]);
}

async function createIngredients() {
  console.log("Adding Ingredients");
  await Promise.all([
    ingredientCreate(0, "New York Strip", categories[0], 3),
    ingredientCreate(1, "Pork Belly", categories[0], 3),
    ingredientCreate(2, "Bokchoy", categories[1], 10),
    ingredientCreate(3, "Mushroom", categories[1], 7),
    ingredientCreate(4, "Shin Ramyeon", categories[4], 365),
    ingredientCreate(5, "Rice", categories[5], 180),
    ingredientCreate(6, "Strawberry", categories[2], 7),
    ingredientCreate(7, "Orange", categories[2], 14),
    ingredientCreate(8, "Somein", categories[3], 180),
  ]);
}

async function createIngredientInstances() {
  console.log("Adding Ingredient Instances");
  await Promise.all([
    ingredientInstanceCreate(
      0,
      ingredients[0],
      "2024-05-01",
      "2024-05-08",
      "Fresh"
    ),
    ingredientInstanceCreate(
      1,
      ingredients[1],
      "2024-05-02",
      "2024-05-09",
      "Unknown"
    ),
    ingredientInstanceCreate(2, ingredients[3], "2024-05-01", "2024-05-04", "Alive"),
    ingredientInstanceCreate(3, ingredients[5], "2024-05-01", "2024-05-30", "Dead"),
    ingredientInstanceCreate(4, ingredients[7], "2024-05-03", "2024-05-12", "Dying"),
  ]);
}
