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
  fetchIngredients,
  deleteFridgeInstance,
  deleteShoppingList,
} from "./Api";
import Home from "./components/homes/Home";
import ShoppingList from "./components/shoppinglists/ShoppingList";
import Fridge from "./components/fridges/Fridge";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Analysis from "./components/analysis/Analysis";
import Ingredient from "./components/ingredients/Ingredient";

function App() {
  const [items, setItems] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [categories, setCategories] = useState({ category_list: [] });
  const [ingredients, setIngredients] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const favorite = localStorage.getItem("favoriteItems");
    return favorite ? JSON.parse(favorite) : {};
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: "", userName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setIsLoggedIn(true);
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Updated Shopping Lists: ", shoppingLists);
  }, [shoppingLists]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchData(),
        fetchShoppingListData(),
        fetchIngredientData(),
        fetchCategoryData(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getUserInfo();
      console.log("User name response:", response);
      setUserInfo(response);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetchFridgeInstances();
      setItems(res.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchShoppingListData = async () => {
    try {
      const res = await fetchShoppingList();
      setShoppingLists(res.data.data);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    }
  };

  const fetchIngredientData = async () => {
    try {
      const res = await fetchIngredients();
      console.log("Fetch Ingredient Data:", res.data.data);
      setIngredients(res.data.data);
    } catch (error) {
      console.error("Error fetching ingredient:", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
      console.log("Get Category Data", res.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
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

  const handleIngredientUpdate = (updatedIngredient) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient._id === updatedIngredient._id
          ? updatedIngredient
          : ingredient
      )
    );
  };

  const handleIngredientDelete = async (id) => {
    console.log("Deleting Ingredient and its related items...");
    // Delete related fridge items
    const relatedFridgeItems = items.filter(
      (item) => item.ingredient._id === id
    );
    for (const item of relatedFridgeItems) {
      await deleteFridgeInstance(item._id)
        .then(() => {
          console.log("Fridge instance deleted:", item._id);
        })
        .catch((error) => {
          console.error("Error deleting fridge instance:", error);
        });
    }
    setItems((prevItems) =>
      prevItems.filter((item) => item.ingredient._id !== id)
    );

    // Delete related shopping list items
    const relatedShoppingListItems = shoppingLists.filter(
      (list) => list.ingredient._id === id
    );
    for (const list of relatedShoppingListItems) {
      await deleteShoppingList(list._id)
        .then(() => {
          console.log("Shopping list item deleted:", list._id);
        })
        .catch((error) => {
          console.error("Error deleting shopping list item:", error);
        });
    }
    setShoppingLists((prevLists) =>
      prevLists.filter((list) => list.ingredient._id !== id)
    );

    // Delete the ingredient from favoriteItems
    setFavoriteItems((prevFavorites) => {
      const updatedFavorites = { ...prevFavorites };
      delete updatedFavorites[id];
      localStorage.setItem("favoriteItems", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });

    // Delete the ingredient
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient._id !== id)
    );
  };

  const handleIngredientAdd = (newIngredient) => {
    console.log("Fetching Data with new Ingredient...:", newIngredient);
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      newIngredient.ingredient,
    ]);
  };

  const handleShoppingListDelete = (id) => {
    console.log("Still Trying...");
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
      localStorage.setItem("user", JSON.stringify(userData));
      fetchAllData();
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
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

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
                handleRegister={handleRegister}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
              />
            }
          />
          <Route
            path="/fridge"
            element={
              <Fridge
                userInfo={userInfo}
                items={items}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
              />
            }
          />
          <Route
            path="/shoppinglist"
            element={
              <ShoppingList
                userInfo={userInfo}
                shoppingLists={shoppingLists || []}
                allItems={items}
                categories={categories}
                onShoppingListUpdate={handleShoppingListUpdate}
                onShoppingListAdd={handleShoppingListAdd}
                onShoppingListDelete={handleShoppingListDelete}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
              />
            }
          />
          <Route
            path="/ingredient"
            element={
              <Ingredient
                userInfo={userInfo}
                ingredients={ingredients || []}
                categories={categories}
                onIngredientAdd={handleIngredientAdd}
                onIngredientUpdate={handleIngredientUpdate}
                onIngredientDelete={handleIngredientDelete}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
              />
            }
          />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
