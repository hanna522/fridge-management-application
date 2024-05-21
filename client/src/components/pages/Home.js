// src/components/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home({ items }) {
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/home")
      .then((res) => {
        setHomeData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  
  return (
    <>
      <h1>{homeData.message || "Loading..."}</h1>

      <div class="home-meal-container">
        <h2 className="home-heading">Meal</h2>
        <p>Galbijjim</p>
      </div>

      <div class="home-fridge-container">
        <h2 className="home-heading">My Fridge</h2>
        <div className="fridge-graph">
          <p></p>
        </div>
        <p>{items.length} items</p>
        <ul className="home-fridge-card-container">
          {items.slice(0, 10).map((item, index) => (
            <li className="home-fridge-card">
              <p>{item.ingredient.name}</p>
              <p className={"status-" + item.status}> </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
