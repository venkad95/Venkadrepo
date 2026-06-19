import React, { useState } from "react";
import '../assets/styles/Header.css';

type HeaderProps = {
    title: string;
  };
function Header({title}) {
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
        </nav>
      </header>
    );
  }
  
  export default Header;    