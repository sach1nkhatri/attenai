
import React, { useState, useEffect } from 'react';
import '../css/aboutUsSection.css';
import realtime from "../assets/rti.png";
import secureandr from "../assets/sar.jpg";
import attandance from "../assets/attendance.jpg";

function AboutUs() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [realtime, secureandr, attandance];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [images.length]);

    return (
        <section className="about-us-section" id="about-us">
            <div className="about-us-content">
                <div className="about-us-text">
                    <h2>About Us</h2>
                    <p>AttenAI is an advanced attendance management platform designed to leverage cutting-edge AI technology for seamless face recognition and real-time attendance tracking. Built for organizations of all sizes, it offers robust solutions such as automated user recognition, detailed analytics, and secure data handling. With features like subscription-based plans, intuitive dashboards, and real-time insights, AttenAI simplifies workforce management while enhancing efficiency and accuracy. Perfect for schools, offices, and enterprises aiming for smart attendance solutions!.</p>
                </div>
                <div className="about-us-slider">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            className={`slider-image ${index === currentIndex ? 'active' : ''}`}
                            src={image}
                            alt={`Slide ${index}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AboutUs;