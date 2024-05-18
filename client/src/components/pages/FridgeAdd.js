import React from "react";

function FridgeAdd({
  formData,
  selections,
  onHandleSubmit,
  onHandleChange,
  onClose,
}) {
  return (
    <div>
      <h2>{formData._id ? "Edit Ingredient" : "Add Ingredient"}</h2>
      <form onSubmit={onHandleSubmit}>
        <label htmlFor="ingredient">Ingredient:</label>
        <select
          className="form-control"
          name="ingredient"
          required
          value={formData.ingredient}
          onChange={onHandleChange}
        >
          <option value="">Please select an ingredient</option>
          {selections.ingredient_list.map((ingredient, index) => (
            <option key={index} value={ingredient._id}>
              {ingredient.name}
            </option>
          ))}
        </select>

        <div className="form-group">
          <label htmlFor="buy_date">Buy Date:</label>
          <input
            type="date"
            name="buy_date"
            required
            value={formData.buy_date}
            onChange={onHandleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exp_date">Expiration Date:</label>
          <input
            type="date"
            name="exp_date"
            required
            value={formData.exp_date}
            onChange={onHandleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default FridgeAdd;