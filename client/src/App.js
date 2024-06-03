import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  fetchFridgeInstances,
  fetchCategories,
  fetchShoppingList,
  login,
  register,
  logout,
  getUserInfo,
} from "./Api";
import Home from "./components/homes/Home";
import ShoppingList from "./components/shoppinglists/ShoppingList";
import Fridge from "./components/fridges/Fridge";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [items, setItems] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [categories, setCategories] = useState({ category_list: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: "", userName: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.token) {
      setUser(storedUser);
      fetchShoppingListData();
      fetchUserData();
      setIsLoggedIn(true);
      fetchData();
      fetchCategory();
    }
  }, []);

    useEffect(() => {
      console.log("Updated Shopping Lists: ", shoppingLists);
    }, [shoppingLists]);

  const fetchUserData = () => {
    getUserInfo()
      .then((response) => {
        console.log("User name response:", response);
        setUserInfo(response);
      })
      .catch((error) => {
        console.error("Error fetching user name:", error);
      });
  };

  const fetchData = () => {
    fetchFridgeInstances()
      .then((res) => {
        setItems(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const fetchShoppingListData = () => {
    fetchShoppingList()
      .then((res) => {
        console.log(res.data.data);
        setShoppingLists(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error);
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

  const handleShoppingListUpdate = (updatedList) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list._id === updatedList._id ? updatedList : list
      )
    );
  };

  const handleShoppingListDelete = (id) => {
    setShoppingLists((prevLists) =>
      prevLists.filter((list) => list._id !== id)
    );
  };

  const handleShoppingListAdd = (newList) => {
    setShoppingLists((prevLists) => [...prevLists, newList]);
  };

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
      fetchData();
      fetchShoppingListData();
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
    setUserInfo({ email: "", userName: "" });
    setIsLoggedIn(false);
    setItems([]);
    setShoppingLists([]);
    setCategories({ category_list: [] });
  };

  return (
    <Router>
      <Navbar
        userInfo={userInfo}
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
                userInfo={userInfo}
                items={items || []}
                shoppingLists={shoppingLists || []}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
                onShoppingListUpdate={handleShoppingListUpdate}
                onShoppingListAdd={handleShoppingListAdd}
                onShoppingListDelete={handleShoppingListDelete}
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
          <Route path="/analysis" element={<ShoppingList />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
