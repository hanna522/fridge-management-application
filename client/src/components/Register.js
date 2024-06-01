import React, { useState } from "react";
import { register } from "../Api";

const Register = ({ onRegister, setIsRegisterOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await onRegister(email, password, groupName);
      setIsRegisterOpen(false);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message
          : err.message;
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister} className="login-form">
        <label htmlFor="email" className="login-form-content">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        <label htmlFor="password" className="login-form-content">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <label htmlFor="password" className="login-form-content">
          Group Name
          <input
            id="text"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            required
          />
        </label>
        <button type="submit" className="confirm-btn">
          Register
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
