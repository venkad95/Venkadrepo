import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/GreetingPage.css";

const GreetingPage = () => {
  const navigate = useNavigate();

  // Get the current hour to display dynamic greetings
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Get the user's first name from localStorage or API
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user.firstName || "Guest";

  return (
    <div className="greeting-page">
      <div className="greeting-container">
        <h1 className="greeting">
          {getGreeting()}, <span className="user-name">Dear {firstName}</span>!
        </h1>
        <p className="subtitle">
          Start your day with the goodness of fresh cow milk. It's healthy, nutritious, and perfect for your family.
        </p>
        <div className="image-container">
          <img
            src="https://example.com/cow-milk-image.jpg" // Replace with your image URL
            alt="Cow Milk"
            className="cow-milk-image"
          />
        </div>
        <div className="advantages">
          <h2>Why Choose Cow Milk?</h2>
          <ul>
            <li>Rich in calcium for strong bones and teeth.</li>
            <li>Boosts immunity with essential vitamins.</li>
            <li>Great source of protein for muscle growth.</li>
            <li>100% natural and fresh.</li>
          </ul>
        </div>
        <button
          className="add-product-btn"
          onClick={() => navigate("/add-product")}
        >
          Enter Today's Milk Purchase
        </button>
      </div>
    </div>
  );
};

export default GreetingPage;