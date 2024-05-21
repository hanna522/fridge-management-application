// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import Profile from "./profile.jpeg"; // 이미지 파일 가져오기

function Navbar() {
  return (
    <div className="navbar-container">
      <Link to="/api/mypage" className="navbar-profile-link">
        <img src={Profile} alt="Profile" className="navbar-profile-image" />
        <p className="navbar-username">UserName</p>
      </Link>
      <ul className="navbar-list">
        <li className="navbar-list-item">
          <Link to="/api/home" className="navbar-link">
            Home
          </Link>
        </li>
        <li className="navbar-list-item">
          <Link to="/api/fridge" className="navbar-link">
            Fridge
          </Link>
        </li>
        <li className="navbar-list-item">
          <Link to="/api/meal" className="navbar-link">
            Meal
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
