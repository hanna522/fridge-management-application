import React, { useEffect, useState } from "react";
import { fetchFridgeInstances } from "../../Api";
import Fridge from "./Fridge";
import Home from "./Home";

function MainComponent() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFridgeInstances()
      .then((res) => {
        console.log("Fetched data:", res.data.data);
        setItems(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Fridge App</h1>
      <Home items={items.slice(0, 3) || []} />
      <Fridge items={items || []} />
    </div>
  );
}

export default MainComponent;