// src/components/Fridge.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Navbar() {

  return (
    <ul>
      <li>
        <Link to="/api/home">Home</Link>
      </li>
      <li>
        <Link to="/api/fridge">Fridge</Link>
      </li>
      <li>
        <Link to="/api/meal">Meal</Link>
      </li>
      <li>
        <Link to="/api/mypage">My Page</Link>
      </li>
    </ul>
  );
}

export default Navbar;
