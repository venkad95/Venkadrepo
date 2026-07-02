import React, { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  // const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container

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
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setMenuOpen(false); // Close the menu
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);
  
  if(loading) return <Loader/>
  return (
    <header className="header">
      <div className="logo">{title}</div>
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <nav className={`nav ${menuOpen ? "open" : ""}`}
      // ref={menuRef}
      >
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        {localStorage.getItem("token") && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;    