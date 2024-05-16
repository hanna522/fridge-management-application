// src/components/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
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
    <div>
      <h1>Hello User</h1>
      <h2>Fridge</h2>
      <Link to={`/api/fridge/`}>
        <p>{homeData.message || "Loading..."}</p>
      </Link>
    </div>
  );
}

export default Home;
