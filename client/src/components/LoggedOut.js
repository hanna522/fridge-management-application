import React, { useState } from "react";
import Modal from "react-modal";
import Typewriter from "typewriter-effect";
import Login from "./Login";
import Register from "./Register";

Modal.setAppElement("#root");

function LoggedOutPage({ handleLogin, handleRegister }) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <div className="before-login-background">
        <div className="before-login-content">
          <Typewriter
            options={{
              strings: [
                "Manage your ingredients with Fridge",
                "Login or Register to start",
              ],
              autoStart: true,
              loop: true,
            }}
          />
          <button
            className="confirm-btn start-btn"
            onClick={() => setIsStartOpen(true)}
          >
            Start
          </button>
        </div>
      </div>
      <Modal
        isOpen={isStartOpen}
        onRequestClose={() => setIsStartOpen(false)}
        contentLabel="Start"
        className="auth-modal"
      >
        <div className="home-start-modal">
          <Login onLogin={handleLogin} />
          <p style={{ margin: 0, textAlign: "center", paddingTop: "5px" }}>
            or
          </p>
          <button
            className="confirm-btn register-btn"
            onClick={() => setIsRegisterOpen(true)}
          >
            Register
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isRegisterOpen}
        onRequestClose={() => setIsRegisterOpen(false)}
        contentLabel="Register"
        className="auth-modal"
      >
        <Register
          onRegister={handleRegister}
          setIsRegisterOpen={setIsRegisterOpen}
        />
      </Modal>
    </>
  );
}

export default LoggedOutPage;
