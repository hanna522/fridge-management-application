import React from "react";

function FridgeDetail({ item, onEdit, onClose }) {
  return (
    <div>
      <h2>Ingredient Details</h2>
      <p>
        <b>{item.ingredient.name}</b>
      </p>
      <p>Status: {item.status}</p>
      <p>Buy Date: {new Date(item.buy_date).toLocaleDateString()}</p>
      <p>Expiration Date: {new Date(item.exp_date).toLocaleDateString()}</p>
      <button onclick={onEdit}>Edit</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default FridgeDetail;
