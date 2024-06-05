import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardImage } from "react-bootstrap-icons";
import ShoppingListSummary from "./ShoppingListSummary";
import FridgeSummary from "./FridgeSummary";
import Modal from "react-modal";
import Typewriter from "typewriter-effect";
import Login from "../Login";
import Register from "../Register";

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
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (!userInfo.userName)
    return (
      <>
        {" "}
        <div className="before-login-background">
          <div className="before-login-content">
            <Typewriter
              options={{
                strings: [
                  "Manage your ingredients with Fridge",
                  "Login or Register to start",
                ],
                autoStart: true,
                loop: true,
              }}
            />
            <button
              className="confirm-btn start-btn"
              onClick={() => setIsStartOpen(true)}
            >
              Start
            </button>
          </div>
        </div>
        <Modal
          isOpen={isStartOpen}
          onRequestClose={() => setIsStartOpen(false)}
          contentLabel="Start"
          className="auth-modal"
        >
          <div className="home-start-modal">
            <Login onLogin={handleLogin} />
            <p style={{margin:0, textAlign:"center", paddingTop: "5px"}}>or</p>
            <button
              className="confirm-btn register-btn"
              onClick={() => setIsRegisterOpen(true)}
            >
              Register
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={isRegisterOpen}
          onRequestClose={() => setIsRegisterOpen(false)}
          contentLabel="Register"
          className="auth-modal"
        >
          <Register
            onRegister={handleRegister}
            setIsRegisterOpen={setIsRegisterOpen}
          />
        </Modal>
      </>
    );

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
