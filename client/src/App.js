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
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/api/"
          element={<Home items={items.slice(0, 3) || []} />}
        />
        <Route
          path="/api/home"
          element={<Home items={items.slice(0, 3) || []} />}
        />
        <Route 
          path="/api/fridge" 
          element={<Fridge items={items || []} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;