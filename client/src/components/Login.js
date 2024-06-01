import React, { useState } from "react";

const Login = ({ onLogin, setIsLoginOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      setIsLoginOpen(false);
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
      <form onSubmit={handleLogin} className="login-form">
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
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <button type="submit" className="confirm-btn">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;