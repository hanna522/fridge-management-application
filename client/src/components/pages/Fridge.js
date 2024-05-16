// src/components/Fridge.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Fridge() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/fridgeinstance")
      .then((res) => {
        setItems(res.data.data);
        console.log("Fridge Instance:", items);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <p>
              <b>{item.ingredient.name}</b>
            </p>
            <p>{item.status}</p>
            <p>{item.buy_date}</p>
            <p>{item.exp_date}</p>
          </li>
        ))}
      </ul>
      <h2><Link>+</Link></h2>
    </>
  );
}

export default Fridge;
