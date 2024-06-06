import React, { useEffect, useState } from "react";
import { createFridgeInstance, getCreateFormFridgeInstance } from "../../Api";

function FridgeAdd({ onItemAdd, onClose }) {
  const [formData, setFormData] = useState({
    ingredient: "",
    buy_date: "",
    exp_date: "",
    status: "Unknown",
  });
  const [createElements, setCreateElements] = useState({
    ingredient_list: [],
  });
  
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

    if (name === "ingredient") {
      const selectedIngredient = createElements.ingredient_list.find(
        (ingredient) => ingredient._id === value
      );
      if (selectedIngredient) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          buy_date: new Date().toISOString().split("T")[0], // today
          exp_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // today + 7 days
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createFridgeInstance(formData)
      .then((res) => {
        console.log("Fridge instance created:", res.data);
        // reset FormData
        setFormData({
          ingredient: "",
          buy_date: "",
          exp_date: "",
          status: "Unknown",
        });
        onClose();
        onItemAdd(res.data.ingredientInstance);
      })
      .catch((error) => {
        console.error("Error creating fridge instance:", error);
      });
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
        <div className="form-group">
        <label htmlFor="ingredient">Ingredient:</label>
        <select
          className="form-control"
          name="ingredient"
          required
          value={formData.ingredient}
          onChange={handleChange}
        >
          <option value="">Please select an ingredient</option>
          {createElements.ingredient_list.map((ingredient, index) => (
            <option key={index} value={ingredient._id}>
              {ingredient.name}
            </option>
          ))}
        </select>
        </div>
        
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
      </form>
    </>
  );
}

export default FridgeAdd;
