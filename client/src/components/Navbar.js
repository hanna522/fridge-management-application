// Navbar component
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Profile from "./profile.jpeg";
import { ChevronDown, GearFill } from "react-bootstrap-icons";
import Login from "./Login";
import Register from "./Register";

Modal.setAppElement("#root");

function Navbar({ isLoggedIn, handleRegister, handleLogout, handleLogin }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <div className="navbar-container">
        <Link to="/home" className="navbar-title">
          <span className="mint">Fridge</span>
        </Link>
        {isLoggedIn ? (
          <div
            className="navbar-profile-container"
            onClick={() => setIsProfileOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <img src={Profile} alt="Profile" className="navbar-profile-image" />
            <p className="navbar-username">Account</p>
            <ChevronDown />
          </div>
        ) : (
          <div className="navbar-auth-buttons">
            <button onClick={() => setIsLoginOpen(true)}>Login</button>
            <button onClick={() => setIsRegisterOpen(true)}>Register</button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isLoginOpen}
        onRequestClose={() => setIsLoginOpen(false)}
        contentLabel="Login"
        className="auth-modal"
      >
        <Login onLogin={handleLogin} />
      </Modal>

      <Modal
        isOpen={isRegisterOpen}
        onRequestClose={() => setIsRegisterOpen(false)}
        contentLabel="Register"
        className="auth-modal"
      >
        <Register onRegister={handleRegister} />
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onRequestClose={() => setIsProfileOpen(false)}
        contentLabel="Profile"
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

        <div className="line-with-shadow"></div>

        <ul className="navbar-list">
          <li className="navbar-list-item">
            <Link to="/home" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-list-item">
            <Link to="/fridge" className="navbar-link">
              Fridge
            </Link>
          </li>
          <li className="navbar-list-item">
            <Link to="/shoppinglist" className="navbar-link">
              Shopping List
            </Link>
          </li>
          <li className="navbar-list-item">
            <Link to="/analysis" className="navbar-link">
              Analysis
            </Link>
          </li>
        </ul>

        <button className="confirm-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </Modal>
    </>
  );
}

export default Navbar;
