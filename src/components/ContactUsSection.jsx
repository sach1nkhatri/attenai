import React, { useState } from "react";
import { db } from "../firebaseConfig"; // ✅ Import Firebase Config
import { collection, addDoc } from "firebase/firestore"; // ✅ Firestore functions
import "../css/contactUsSection.css"; // Import the CSS file

const ContactUsSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState(""); // ✅ Status message for user feedback

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const contactRef = collection(db, "ContactMessages"); // ✅ Reference to 'ContactMessages' collection
            await addDoc(contactRef, {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                timestamp: new Date() // ✅ Add timestamp
            });

            setStatus("Message sent successfully! ✅"); // ✅ Success feedback
            setFormData({ name: "", email: "", message: "" }); // ✅ Clear form

        } catch (error) {
            console.error("Error saving contact message:", error);
            setStatus("❌ Failed to send message. Please try again.");
        }
    };

    return (
        <section id="contact-us" className="contact-us-section">
            <div className="section-container">
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button">Send</button>
                </form>
                {status && <p className="status-message">{status}</p>} {/* ✅ Display status */}
            </div>
        </section>
    );
};

export default ContactUsSection;
