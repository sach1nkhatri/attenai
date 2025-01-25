import React from "react";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router
import "../css/pricingSection.css";

const PricingSection = () => {
    const navigate = useNavigate();

    const handleSubscribe = (plan) => {
        navigate("/billing", { state: { plan } }); // Pass selected plan details to the billing page
    };

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
                        <p className="plan-price">रू500 / Month</p>
                        <button className="subscribe-button" onClick={() => handleSubscribe("Basic Plan")}>
                            Subscribe
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Standard Plan</h3>
                        <p>Ideal for medium-sized organizations.</p>
                        <ul>
                            <li>Up to 50 Users</li>
                            <li>Advanced Attendance Analytics</li>
                            <li>Priority Email Support</li>
                        </ul>
                        <p className="plan-price">रू1,000 / Month</p>
                        <button className="subscribe-button" onClick={() => handleSubscribe("Standard Plan")}>
                            Subscribe
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Premium Plan</h3>
                        <p>Best for large organizations with custom needs.</p>
                        <ul>
                            <li>Unlimited Users</li>
                            <li>Real-Time Insights</li>
                            <li>24/7 Dedicated Support</li>
                        </ul>
                        <p className="plan-price">रू5,000 / Month</p>
                        <button className="subscribe-button" onClick={() => handleSubscribe("Premium Plan")}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
