import React from "react";
import "../assets/styles/About.css"

const Contact = () => {
    return (
        <section className="contact-section">
    
            <h2>Contact Us</h2>
    
            <div className="contact-grid">
    
                <div className="contact-card">
                    <h3>📍 Address</h3>
                    <p>
                        Milk Management System
                        <br />
                        Panruti, Tamil Nadu
                    </p>
                </div>
    
                <div className="contact-card">
                    <h3>📞 Phone</h3>
                    <p>+91 99448 50913</p>
                </div>
    
                <div className="contact-card">
                    <h3>📧 Email</h3>
                    <p>support@milkmanagement.com</p>
                </div>
    
                <div className="contact-card">
                    <h3>⏰ Working Hours</h3>
                    <p>Monday - Sunday</p>
                    <p>6:00 AM - 8:00 PM</p>
                </div>
    
            </div>
    
        </section>
    )
}
export default Contact;