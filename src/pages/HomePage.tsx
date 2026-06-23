import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Home.css";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Fresh Cow Milk
            <span> Delivered Every Day 🥛</span>
          </h1>

          <p>
            Enjoy pure farm-fresh cow milk rich in calcium, protein, and
            essential nutrients. Manage customers, track milk delivery,
            generate reports, and simplify your dairy business.
          </p>

          <div className="hero-buttons">

            <button
              className="learn-btn"
              onClick={() =>
                document
                  .getElementById("benefits")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-images">
          <img
            className="cow-img"
            src="/cow.png"
            alt="Fresh Dairy Cow"
          />
        </div>
      </section>

      {/* STATS SECTION */}

      <section className="stats-section">
        <div className="stat-card">
          <h2>500+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-card">
          <h2>1500+</h2>
          <p>Liters Delivered Daily</p>
        </div>

        <div className="stat-card">
          <h2>99%</h2>
          <p>Customer Satisfaction</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>System Availability</p>
        </div>
      </section>

      {/* COW MILK BENEFITS */}

      <section
        id="benefits"
        className="benefits-section"
      >
        <h2>Benefits of Cow Milk</h2>

        <div className="benefit-grid">

          <div className="benefit-card">
            <h3>🦴 Strong Bones</h3>
            <p>
              Rich in calcium and phosphorus
              for stronger bones and teeth.
            </p>
          </div>

          <div className="benefit-card">
            <h3>💪 High Protein</h3>
            <p>
              Supports muscle growth and
              body repair naturally.
            </p>
          </div>

          <div className="benefit-card">
            <h3>🛡️ Better Immunity</h3>
            <p>
              Packed with vitamins and
              minerals to boost immunity.
            </p>
          </div>

          <div className="benefit-card">
            <h3>⚡ Natural Energy</h3>
            <p>
              Provides healthy energy to
              keep you active all day.
            </p>
          </div>

        </div>
      </section>

      {/* WHY USE OUR SYSTEM */}

      <section className="features-section">

        <h2>Why Choose Our Milk Management System?</h2>

        <div className="feature-grid">

          <div className="feature-card">
            🚚
            <h3>Daily Delivery Tracking</h3>
            <p>
              Track milk delivery records
              with ease.
            </p>
          </div>

          <div className="feature-card">
            👥
            <h3>Customer Management</h3>
            <p>
              Manage customer details and
              subscriptions efficiently.
            </p>
          </div>

          <div className="feature-card">
            📊
            <h3>Monthly Reports</h3>
            <p>
              Generate detailed reports and
              billing statements.
            </p>
          </div>

          <div className="feature-card">
            📱
            <h3>Mobile Friendly</h3>
            <p>
              Access your dairy business
              from anywhere.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta-section">

        <h2>
          Ready To Grow Your Dairy Business?
        </h2>

        <p>
          Join hundreds of customers using
          our Milk Management System.
        </p>

        <button
          className="cta-btn"
          onClick={() => navigate("/login")}
        >
          Login Now
        </button>

      </section>
    </>
  );
}

export default HeroSection;