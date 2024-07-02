import React from "react";
import ShoppingListSummary from "./ShoppingListSummary";
import FridgeSummary from "./FridgeSummary";
import Modal from "react-modal";
import LoggedOut from "../LoggedOut"

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
  onShoppingListDelete,
  handleLogin,
  handleRegister,
}) {

  if (!userInfo.userName) return <LoggedOut handleLogin={handleLogin} handleRegister={handleRegister}/>

  return (
    <>
      {/** Intro Section */}
      <div className="home-message-container">
        <h1>Hello, {userInfo.userName}!</h1>
        <p></p>
        <p></p>
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

/**
  <button>
    <CardImage /> upload receipt
  </button>
 */