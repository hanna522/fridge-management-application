import React, { useState } from "react";
import { register } from "../Api";

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await onRegister(email, password, groupName);
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
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
