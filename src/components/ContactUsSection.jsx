import React from "react";
import "../css/contactUsSection.css"; // Import the CSS file

const ContactUsSection = () => {
    return (
        <section id="contact-us" className="contact-us-section">
            <div className="section-container">
                <h2>Contact Us</h2>
                <form action="#" method="post" className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" className="submit-button">Send</button>
                </form>
            </div>
        </section>
    );
};

export default ContactUsSection;
