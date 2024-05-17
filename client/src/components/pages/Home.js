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
      <div>
        <h2>Meal</h2>
        <Link to={`/api/meal/`}>
          <p>{"More"}</p>
        </Link>
      </div>
      <div>
        <Link to={`/api/fridge/`}>
          <h2>Fridge</h2>
          <ul>
            {items.slice(0, 10).map((item, index) => (
              <li>
                <p>{item.ingredient.name}</p>
                <p>{item.status}</p>
              </li>
            ))}
          </ul>
          <p>{"More"}</p>
        </Link>
      </div>
    </>
  );
}

export default Home;
