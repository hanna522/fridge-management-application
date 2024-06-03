import React, { useState, useEffect } from "react";
import {
  getCreateFormFridgeInstance,
  createShoppingList,
  deleteShoppingList,
} from "../../Api";

function ShoppingListAdd({ onShoppingListAdd, onClose}) {
    const [shoppingListCreateForm, setShoppingListCreateForm] = useState({
      ingredient: "",
      possess: false,
    });
    const [ingredientOptions, setIngredientOptions] = useState({
      ingredient_list: [],
    });

    useEffect(() => {
      getCreateFormFridgeInstance()
        .then((res) => {
          setIngredientOptions(res.data);
          console.log("Fetch Shopping List Creating Form");
        })
        .catch((error) => {
          console.error("Error fetching shopping list create form:", error);
        });
    }, []);

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
            possess: selectedIngredient.necessary || false,
          }));
        }
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
        createShoppingList(shoppingListCreateForm)
          .then((res) => {
            console.log("Shopping List created", res.data);
            setShoppingListCreateForm({
              ingredient: "",
              possess: false,
            });
            onClose();
            onShoppingListAdd(res.data.shoppingList); // 대문자 아닐수도
          })
          .catch((error) => {
            console.error("Error creating shopping list item:", error);
          });
    };
    
    return (
      <>
        <div className="modal-heading">
          <h2>Add Shopping List</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
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
            Add Item
          </button>
        </form>
      </>
    );

}