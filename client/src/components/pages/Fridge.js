// src/components/Fridge.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Fridge() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/fridge")
      .then((response) => {
        setItems(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default Fridge;
