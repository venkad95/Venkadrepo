import React, { useEffect, useState } from "react";
import '../assets/styles/Header.css';
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-toastify";

type HeaderProps = {
  title: string;
};
const Header = ({ title }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setLoading(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logout succesfully!!");
      navigate("/login");

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  if(loading) return <Loader/>
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
         {localStorage.getItem('token') && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
}

export default Header;    