import React from "react";
import '../assets/styles/Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>🥛 Milk Management System</p>
      <p>© {year} All Rights Reserved | Fresh • Pure • Healthy Milk</p>
    </footer>
  );
}

export default Footer;