import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchFridgeInstances } from "./Api";
import Home from './components/pages/Home';
//import MealPlan from "./components/pages/MealPlan";
//import MyPage from "./components/pages/MyPage";
//import Recipe from "./components/pages/Recipe";
import Fridge from "./components/pages/Fridge";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
//import NotFoundPage from '/components/pages/NotFoundPage';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
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
      <Routes>
        <Route path="/api/" element={<Home items={items || []} />} />
        <Route path="/api/home" element={<Home items={items || []} />} />
        <Route path="/api/fridge" element={<Fridge items={items} onItemUpdate={handleItemUpdate} onItemDelete={handleItemDelete} onItemAdd={handleItemAdd} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;