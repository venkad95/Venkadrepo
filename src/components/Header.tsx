import React, { useState } from "react";
import '../assets/styles/Header.css';
import api from "../services/api";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  title: string;
};
const Header = ({ title }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {

      await api.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

    } catch (error) {
      console.log(error);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        {title}
      </div>
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;    