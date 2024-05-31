// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Profile from "./profile.jpeg"; // 이미지 파일 가져오기
import { ChevronDown, Cursor, GearFill} from "react-bootstrap-icons";
import Login from "./Login";
import Register from "./Register"

Modal.setAppElement("#root");

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="navbar-container">
        <Link to="/api/home" className="navbar-title">
          <span className="mint">Fridge</span>
        </Link>
        <div
          className="navbar-profile-container"
          onClick={() => setIsProfileOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <img src={Profile} alt="Profile" className="navbar-profile-image" />
          <p className="navbar-username">Account</p>
          <ChevronDown></ChevronDown>
        </div>
      </div>
      <Login/>
      <Register/>
      <Modal
        isOpen={isProfileOpen}
        onRequestClose={() => setIsProfileOpen(false)}
        contentLabel="Ingredient Details"
        className="profile-modal"
      >
        <div className="navbar-list-profile">
          <div className="profile-detail">
            <img src={Profile} alt="Profile" className="navbar-profile-image" />
            <div>
              <div className="user-name">
                <h2>UserName</h2>
                <GearFill size={15} />
              </div>
              <p>User's Home</p>
            </div>
          </div>
        </div>

        <div class="line-with-shadow"></div>

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
            <Link to="/api/shoppinglist" className="navbar-link">
              Shopping List
            </Link>
          </li>
          <li className="navbar-list-item">
            <Link to="/api/shoppinglist" className="navbar-link">
              Analysis
            </Link>
          </li>
        </ul>

        <button className="confirm-btn">Sign Out</button>
      </Modal>
    </>
  );
}

export default Navbar;
