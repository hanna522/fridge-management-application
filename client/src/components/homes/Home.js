import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardImage } from "react-bootstrap-icons";
import ShoppingListSummary from "./ShoppingListSummary";
import FridgeSummary from "./FridgeSummary";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Home({
  userInfo,
  items,
  shoppingLists,
  categories,
  onItemUpdate,
  onItemDelete,
  onItemAdd,
  onShoppingListUpdate,
  onShoppingListAdd,
  onShoppingListDelete
}) {
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
      {/** Intro Section */}

      <div className="home-message-container">
        <h1>Hello, {userInfo.userName}</h1>
        <button>
          <CardImage /> upload receipt
        </button>
      </div>

      {/** Shopping List Summary Section */}

      <ShoppingListSummary
        allShoppingLists={shoppingLists}
        allItems={items}
        onShoppingListUpdate={onShoppingListUpdate}
        onShoppingListAdd={onShoppingListAdd}
        onShoppingListDelete={onShoppingListDelete}
      />

      {/** My Fridge Summary Section */}
      <FridgeSummary
        allItems={items}
        allCategories={categories}
        onItemUpdate={onItemUpdate}
        onItemAdd={onItemAdd}
        onItemDelete={onItemDelete}
      />
    </>
  );
}

export default Home;
