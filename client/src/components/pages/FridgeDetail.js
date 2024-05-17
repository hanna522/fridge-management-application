import React, { useState } from "react";

function FridgeDetail({ item, onEdit, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ingredient: item.ingredient._id,
    buy_date: item.buy_date,
    exp_date: item.exp_date,
    status: item.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
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
            <option value={item.ingredient._id}>{item.ingredient.name}</option>
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
          <p>ingredient: {item.ingredient.name}</p>
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
