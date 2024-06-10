import React, { useEffect, useState } from "react";
import { getIngredientCreateForm, createIngredient } from "../../Api";

function IngredientAdd({ onIngredientAdd, closeForm, IngredientName }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    rec_exp_date: "",
  });
  const [createElements, setCreateElements] = useState({
    category_list: [],
  });

  useEffect(() => {
    getIngredientCreateForm()
      .then((res) => {
        setCreateElements(res.data);
        if (IngredientName) {
          setFormData({
            ...formData,
            name: IngredientName
          })
        }
        console.log("Create Ingredient Form Data", res.data);
      })
      .catch((error) => {
        console.error("Error fetching creating form data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("trying to add the ingredient");
      const newIngredient = await createIngredient(formData);
      console.log("ingredient added: ", formData.name);
      onIngredientAdd(newIngredient.data);
      closeForm();
    } catch (error) {
      console.error("Error saving ingredient:", error);
    }
  };

  return (
    <div>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Category:
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {createElements.category_list &&
            createElements.category_list.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Recommended Expiry Date (days):
        <input
          type="number"
          name="rec_exp_date"
          value={formData.rec_exp_date}
          onChange={handleChange}
          required
        />
      </label>
      <button type="button" onClick={handleSubmit}>
        Save
      </button>
      <button type="button" onClick={closeForm}>
        Cancel
      </button>
    </div>
  );
}

export default IngredientAdd;
