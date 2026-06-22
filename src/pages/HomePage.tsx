import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Home.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <div className="hero-section">

        <div className="hero-text">
          <h1>Fresh Milk Management System 🥛</h1>
          <p>
            Manage daily milk delivery, track clients, monitor liters, and
            generate reports easily with our smart system.
          </p>

          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1516467508483-a7212febe31a"
            alt="Cow Milk"
          />
        </div>

      </div>

      {/* INFO SECTION */}
      <div className="info-section">

        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1595433707802-1d8f1f7f7f7f"
            alt="Milk Bottle"
          />
          <h3>Pure & Fresh Milk</h3>
          <p>We ensure high quality milk delivery every day.</p>
        </div>

        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1604908176997-125f25cc500f"
            alt="Cow Farm"
          />
          <h3>Farm Fresh Collection</h3>
          <p>Direct from farms to customers without delay.</p>
        </div>

        <div className="info-card">
          <img
            src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
            alt="Milk Glass"
          />
          <h3>Healthy Lifestyle</h3>
          <p>Milk provides strength, energy, and better health.</p>
        </div>

      </div>

    </div>
  );
};

export default HomePage;