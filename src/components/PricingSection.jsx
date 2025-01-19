import React from "react";
import "../css/pricingSection.css"; // Import the CSS file

const PricingSection = () => {
    return (
        <section id="pricing" className="pricing-section">
            <div className="section-container">
                <h2>Plans and Subscriptions</h2>
                <div className="plans-grid">
                    <div className="plan-card">
                        <h3>Basic Plan</h3>
                        <p>Perfect for small teams or individuals.</p>
                        <ul>
                            <li>Up to 20 Users</li>
                            <li>Basic Attendance Features</li>
                            <li>Email Support</li>
                        </ul>
                        <p className="plan-price">₹500 / Month</p>
                        <button className="subscribe-button">Subscribe</button>
                    </div>
                    <div className="plan-card">
                        <h3>Standard Plan</h3>
                        <p>Ideal for medium-sized organizations.</p>
                        <ul>
                            <li>Up to 50 Users</li>
                            <li>Advanced Attendance Analytics</li>
                            <li>Priority Email Support</li>
                        </ul>
                        <p className="plan-price">₹1,000 / Month</p>
                        <button className="subscribe-button">Subscribe</button>
                    </div>
                    <div className="plan-card">
                        <h3>Premium Plan</h3>
                        <p>Best for large organizations with custom needs.</p>
                        <ul>
                            <li>Unlimited Users</li>
                            <li>Real-Time Insights</li>
                            <li>24/7 Dedicated Support</li>
                        </ul>
                        <p className="plan-price">₹2,000 / Month</p>
                        <button className="subscribe-button">Subscribe</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
