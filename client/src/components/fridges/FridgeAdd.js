import React, { useEffect, useState } from "react";
import { createFridgeInstance, getCreateFormFridgeInstance } from "../../Api";
import IngredientAdd from "../ingredients/IngredientAdd";

function FridgeAdd({ onItemAdd, onClose }) {
  const [formData, setFormData] = useState({
    ingredient: "",
    buy_date: new Date().toISOString().split("T")[0],
    exp_date: "",
    status: "Unknown",
  });
  const [createElements, setCreateElements] = useState({
    ingredient_list: [],
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    getCreateFormFridgeInstance()
      .then((res) => {
        setCreateElements(res.data);
        console.log("Create Fridge Instance", res.data);
      })
      .catch((error) => {
        console.error("Error fetching creating form data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleIngredientChange = (e) => {
    const value = e.target.value;
    setIngredientInput(value);

    const matchedIngredients = createElements.ingredient_list.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredIngredients(matchedIngredients);
    setIsDropdownVisible(true);

    const selectedIngredient = createElements.ingredient_list.find(
      (ingredient) => ingredient.name.toLowerCase() === value.toLowerCase()
    );

    if (selectedIngredient) {
      const expDate = new Date(
        Date.now() + selectedIngredient.rec_exp_date * 24 * 60 * 60 * 1000
      );

      if (!isNaN(expDate.getTime())) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ingredient: selectedIngredient._id,
          exp_date: expDate.toISOString().split("T")[0], // today + recommended expiry days
        }));
        setShowIngredientForm(false);
      }
    }
  };

  const handleIngredientSelect = (ingredient) => {
    if (ingredient === "add") {
      setShowIngredientForm(true);
      setIsDropdownVisible(false);
    } else {
      const expDate = new Date(
        Date.now() + ingredient.rec_exp_date * 24 * 60 * 60 * 1000
      );

      if (!isNaN(expDate.getTime())) {
        setIngredientInput(ingredient.name);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ingredient: ingredient._id,
          exp_date: expDate.toISOString().split("T")[0], // today + recommended expiry days
        }));
        setFilteredIngredients([]);
        setIsDropdownVisible(false);
        setShowIngredientForm(false);
      }
    }
  };

  const handleIngredientAdd = (newIngredient) => {
    const expDate = new Date(
      Date.now() + newIngredient.rec_exp_date * 24 * 60 * 60 * 1000
    );

    if (!isNaN(expDate.getTime())) {
      setCreateElements((prevElements) => ({
        ...prevElements,
        ingredient_list: [...prevElements.ingredient_list, newIngredient],
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        ingredient: newIngredient._id,
        exp_date: expDate.toISOString().split("T")[0], // today + recommended expiry days
      }));
      setShowIngredientForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fridgeInstanceResponse = await createFridgeInstance(formData);
      console.log("Fridge instance created:", fridgeInstanceResponse.data);
      onItemAdd(fridgeInstanceResponse.data.ingredientInstance);
      onClose();
    } catch (error) {
      console.error("Error creating fridge instance:", error);
    }
  };

  return (
    <>
      <div className="modal-heading">
        <h2>{formData._id ? "Edit Ingredient" : "Add Ingredient"}</h2>
        <button type="button" className="close-btn" onClick={onClose}>
          x
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!showIngredientForm && (
          <div className="form-group">
            <label htmlFor="ingredient">Ingredient:</label>
            <input
              type="text"
              name="ingredient"
              value={ingredientInput}
              onChange={handleIngredientChange}
              required
              autoComplete="off"
            />
            {isDropdownVisible && (
              <ul className="ingredient-suggestions">
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ingredient) => (
                    <li
                      key={ingredient._id}
                      onClick={() => handleIngredientSelect(ingredient)}
                    >
                      {ingredient.name}
                    </li>
                  ))
                ) : (
                  <li onClick={() => handleIngredientSelect("add")}>
                    + Add "{ingredientInput}" as new ingredient
                  </li>
                )}
              </ul>
            )}
            <div className="form-group">
              <label htmlFor="buy_date">Buy Date:</label>
              <input
                type="date"
                name="buy_date"
                required
                value={formData.buy_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="exp_date">Expiration Date:</label>
              <input
                type="date"
                name="exp_date"
                required
                value={formData.exp_date}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="confirm-btn">
              Add
            </button>
          </div>
        )}
        {showIngredientForm && (
          <IngredientAdd
            onIngredientAdd={handleIngredientAdd}
            closeForm={() => setShowIngredientForm(false)}
            IngredientName={ingredientInput}
          />
        )}
      </form>
    </>
  );
}

export default FridgeAdd;
