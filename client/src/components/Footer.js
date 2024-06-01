// src/components/Fridge.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footer">
        <p>MERN Stack Project ❤️ Hangyeol Kim</p>
        <a href="https://github.com/hanna522/with-my-fridge">@Github</a>
      </div>
    </>
  );
}

export default Footer;
