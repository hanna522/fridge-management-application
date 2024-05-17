import React from "react";

function FridgeCard({ item, onViewDetail }) {
  return (
    <li onClick={() => onViewDetail(item)} style={{ cursor: "pointer" }}>
      <p>
        <b>{item.ingredient.name}</b>
      </p>
      <p>{item.status}</p>
      <p>{new Date(item.buy_date).toLocaleDateString()}</p>
      <p>{new Date(item.exp_date).toLocaleDateString()}</p>
    </li>
  );
}

export default FridgeCard;
