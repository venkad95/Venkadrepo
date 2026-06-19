import React from "react";
import '../assets/styles/Footer.css';

function Footer() {
    const year = new Date().getFullYear();
  
    return (
      <footer className="footer">
        <p>© {year} My Business App. All Rights Reserved.</p>
      </footer>
    );
  }
  
  export default Footer;