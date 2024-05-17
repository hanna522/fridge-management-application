import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "react-bootstrap-icons";

function FridgeDetail({ item, onEdit, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateElements, setUpdateElements] = useState({
    ingredient_list: [],
    selected_ingredient: "",
    ingredientinstance: "",
  });
  const [formData, setFormData] = useState({
    ingredient: item.ingredient._id,
    buy_date: item.buy_date.split("T")[0], // assuming the date is in ISO format
    exp_date: item.exp_date.split("T")[0],
    status: item.status,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5050/api/fridgeinstance/${item._id}/update`)
      .then((res) => {
        setUpdateElements(res.data);
        console.log("Update Fridge Instance");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [item._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios
      .put(
        `http://localhost:5050/api/fridgeinstance/${item._id}/update`,
        formData
      )
      .then((res) => {
        console.log("Fridge instance updated:", res.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating fridge instance:", error);
      });
  };

  return (
    <div>
      <h2>Ingredient Details</h2>
      {isEditing ? (
        <div>
          <label htmlFor="ingredient">Ingredient:</label>
          <select
            className="form-control"
            name="ingredient"
            required
            value={formData.ingredient}
            onChange={handleChange}
          >
            {updateElements.ingredient_list.map((ingredient) => (
              <option key={ingredient._id} value={ingredient._id}>
                {ingredient.name}
              </option>
            ))}
          </select>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              className="form-control"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Fresh">Fresh</option>
              <option value="Alive">Alive</option>
              <option value="Dying">Dying</option>
              <option value="Dead">Dead</option>
              <option value="Unknown">Unknown</option>
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

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Ingredient: {item.ingredient.name}</p>
          <p>Status: {item.status}</p>
          <p>Buy Date: {new Date(item.buy_date).toLocaleDateString()}</p>
          <p>Expiration Date: {new Date(item.exp_date).toLocaleDateString()}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default FridgeDetail;
