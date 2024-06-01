import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  fetchFridgeInstances,
  fetchCategories,
  login,
  register,
  logout,
} from "./Api";
import Home from "./components/homes/Home";
import ShoppingList from "./components/shoppinglists/ShoppingList";
import Fridge from "./components/fridges/Fridge";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({ category_list: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setIsLoggedIn(true);
      fetchData();
      fetchCategory();
    }
  }, []);

  const fetchData = () => {
      fetchFridgeInstances()
        .then((res) => {
          setItems(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
  };

 const fetchCategory = () => {
     fetchCategories()
       .then((res) => {
         setCategories(res.data);
         console.log("Get Category Data");
       })
       .catch((error) => {
         console.error("Error fetching category data:", error);
       });
 };

  const handleItemUpdate = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handleItemDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const handleItemAdd = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
      fetchData();
      fetchCategory();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (email, password, groupName) => {
    try {
      await register(email, password, groupName);
      await handleLogin(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    setItems([]);
    setCategories({ category_list: [] });
  };

  return (
    <Router>
      <Navbar
        user={user}
        isLoggedIn={isLoggedIn}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home items={items || []} categories={categories} />}
          />
          <Route
            path="/home"
            element={
              <Home
                items={items || []}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
              />
            }
          />
          <Route
            path="/fridge"
            element={
              <Fridge
                items={items}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
              />
            }
          />
          <Route path="/shoppinglist" element={<ShoppingList />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
