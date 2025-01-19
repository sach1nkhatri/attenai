import React from "react";
import "../css/serviceSection.css"; // Import the CSS file
import realtime from "../assets/rti.png";
import secureandr from "../assets/sar.jpg";
import attandance from "../assets/attendance.jpg";

const MyServicesSection = () => {
    return (
        <section id="my-services" className="my-services-section">
            <div className="section-container">
                <h2>Our Services</h2>
                <p>Explore the various services we offer, from Effortless Attendance, Real-Time Insights, Secure and Reliable systems.</p>
                <div className="services-grid">
                    <div className="service-item">
                        <img src={attandance} alt="Effortless Attendance" className="service-image" />
                        <h3>Effortless Attendance</h3>
                        <p>Automate and simplify your organization's attendance process with our state-of-the-art facial recognition system.</p>
                    </div>
                    <div className="service-item">
                        <img src={realtime} alt="Real-Time Insights" className="service-image" />
                        <h3>Real-Time Insights</h3>
                        <p>Access live reports and insights on attendance patterns for better decision-making.</p>
                    </div>
                    <div className="service-item">
                        <img src={secureandr} alt="Secure & Reliable" className="service-image" />
                        <h3>Secure & Reliable</h3>
                        <p>Experience unmatched accuracy and data security with our advanced computer vision technology.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyServicesSection;
