
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
                    <p>Learn more about ChilliesAudioWorks and our mission to provide quality music education in Kathmandu.</p>
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