// src/components/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FridgeCard from "./FridgeCard";

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

  const linkToFridge = (item) => {
    return <Link to={`/api/fridge/`}></Link>
  };
  
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
        <h2>Fridge</h2>
        <ul>
          {items.map((item, index) => (
            <FridgeCard
              key={index}
              item={item}
              onViewDetail={linkToFridge}
            />
          ))}
        </ul>
        <Link to={`/api/fridge/`}>
          <p>{"More"}</p>
        </Link>
      </div>
    </>
  );
}

export default Home;
