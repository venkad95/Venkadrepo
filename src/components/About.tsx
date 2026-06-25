import React from "react";
import "../assets/styles/About.css";

const About = () => {
    return (
        <section className="about-section">

            <div className="about-content">

                <h2>About Us</h2>

                <p>
                    We are dedicated to providing fresh and healthy cow milk directly
                    from trusted dairy farms. Our Milk Management System helps dairy
                    owners manage customers, deliveries, billing, and reports with ease.
                </p>

                <p>
                    Our mission is to connect dairy businesses with modern technology
                    while ensuring customers receive fresh and nutritious milk every day.
                </p>

            </div>
            <div className="about-image">
                <img
                    src="/public/milk.png"
                    alt="Dairy Farm"
                />
            </div>

        </section>
    )
}
export default About;