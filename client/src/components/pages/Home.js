import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CardImage } from "react-bootstrap-icons";

function Home({ items, categories }) {
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

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const filterCategory = (cate) =>
    items.filter((item) => {
      const category = getNestedValue(item, "ingredient.category.name");
      return (
        typeof category === "string" &&
        category.toLowerCase().includes(cate.name.toLowerCase())
      );
    });

  const filterStatus = (status) => {
    return items.filter((item) => item.status === status);
  };

  const getLength = (filtered) => {
    const totalItems = items.length;
    const filteredItems = filterCategory(filtered).length;
    return (filteredItems / totalItems) * 100;
  };

  const getStatusLength = (s) => {
    const totalItems = items.length;
    const filteredItems = filterStatus(s).length;
    return (filteredItems / totalItems) * 100;
  }

  const status = ["Fresh", "Alive", "Dying", "Dead"]

  return (
    <>
      <div className="home-message-container">
        <h1>{homeData.message || "Loading..."}</h1>
        <button>
          <CardImage /> upload receipt
        </button>
      </div>

      <div className="home-meal-container">
        <h2 className="home-heading">Today Menu</h2>
        <p>Galbijjim</p>
      </div>

      <div className="home-fridge-container">
        <h2 className="home-heading">My Fridge</h2>
        
        <div className="fridge-graph">
          {categories.category_list.map((category) => (
            <div
              key={category.name}
              className="fridge-graph-bar"
              style={{ width: `${getLength(category)}%` }}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>

        <div className="fridge-graph">
          {status.map((s)=> (
            <div key={status} className="fridge-graph-bar" style={{width: `${getStatusLength(s)}%`}}>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <p>{items.length} items</p>

        <ul className="home-fridge-card-container">
          {items.map((item, index) => (
            <li key={index} className="home-fridge-card">
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
