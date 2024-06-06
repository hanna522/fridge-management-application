import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import {
  fetchShoppingList,
  getCreateFormFridgeInstance,
  createShoppingList,
  deleteShoppingList,
  updateFridgeInstance,
} from "../../Api";
import { CheckCircle, Trash, PencilSquare } from "react-bootstrap-icons";

function ShoppingListAdd({
  ingredientOptions,
  onShoppingListAdd,
  handleCloseModal
}) {
  useEffect(() => {
    getCreateFormFridgeInstance()
      .then((res) => {
        console.log("Fetch Shopping List Creating Form");
      })
      .catch((error) => {
        console.error("Error fetching shopping list create form:", error);
      });
  }, []);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [shoppingListCreateForm, setShoppingListCreateForm] = useState({
    ingredient: "",
    possess: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoppingListCreateForm({ ...shoppingListCreateForm, [name]: value });

    if (name === "ingredient") {
      const selectedIngredient = ingredientOptions.ingredient_list.find(
        (ingredient) => ingredient._id === value
      );
      if (selectedIngredient) {
        setShoppingListCreateForm((prevFormData) => ({
          ...prevFormData,
          possess: true,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createShoppingListData(shoppingListCreateForm);
  };

  const createShoppingListData = (form) => {
    createShoppingList(form)
      .then((res) => {
        console.log("Shopping List created", res.data);
        setShoppingListCreateForm({
          ingredient: "",
          possess: false,
        });
        onShoppingListAdd(res.data);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error creating shopping list item:", error);
      });
  };
  
  return (
    <>
      <div className="modal-heading">
        <h2>Add Shopping List</h2>
        <button type="button" className="close-btn" onClick={handleCloseModal}>
          x
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Ingredient:
          <select
            name="ingredient"
            value={shoppingListCreateForm.ingredient}
            onChange={handleChange}
            required
          >
            <option value="">Select an ingredient</option>
            {ingredientOptions.ingredient_list.map((ingredient) => (
              <option key={ingredient._id} value={ingredient._id}>
                {ingredient.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="confirm-btn">
          Add
        </button>
      </form>
    </>
  );
}

export default ShoppingListAdd;
