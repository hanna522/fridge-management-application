import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
//import MealPlan from "./components/pages/MealPlan";
//import MyPage from "./components/pages/MyPage";
//import Recipe from "./components/pages/Recipe";
import Fridge from "./components/pages/Fridge";
import Navbar from './components/Navbar';
//import Footer from "./components/Footer";
//import NotFoundPage from '/components/pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/api/" element={<Home />} />
        <Route path="/api/home" element={<Home />} />
        <Route path="/api/fridge" element={<Fridge />} />
      </Routes>
    </Router>
  );
}

export default App;
