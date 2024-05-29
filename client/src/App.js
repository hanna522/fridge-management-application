import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchFridgeInstances, fetchCategories } from "./Api";
import Home from "./components/homes/Home";
import MealPlan from "./components/pages/MealPlan";
//import MyPage from "./components/pages/MyPage";
//import Recipe from "./components/pages/Recipe";
import Fridge from "./components/fridges/Fridge";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
//import NotFoundPage from '/components/pages/NotFoundPage';

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({ category_list: [] });

  useEffect(() => {
    fetchData();
    fetchCategory();
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

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/api/"
            element={<Home items={items || []} categories={categories} />}
          />
          <Route
            path="/api/home"
            element={
              <Home
                items={items || []}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
              />
            }
          />
          <Route
            path="/api/fridge"
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
          <Route path="/api/meal" element={<MealPlan />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
