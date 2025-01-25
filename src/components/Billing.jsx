import React from "react";
import { useLocation } from "react-router-dom";
import "../css/billing.css";

const BillingSection = () => {
    const location = useLocation();
    const selectedPlan = location.state?.plan || "No Plan Selected";

    return (
        <div className="billing-section">
            <h2 className="section-title">Billing Information</h2>
            <div className="selected-plan">
                <h3>{selectedPlan}</h3>
            </div>
            <form className="modern-form">
                <div className="grid-two-columns">
                    {/* Personal Details Section */}
                    <div className="left-section">
                        <h3>Personal Details</h3>
                        <div className="input-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" placeholder="Sir Sachin Khatri" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="sachin@example.com" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" placeholder="123 Main St" required />
                        </div>
                        <div className="grid">
                            <div className="input-group">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" name="city" placeholder="Kathmandu" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" name="state" placeholder="Bagmati" required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="zip">Zip Code</label>
                            <input type="text" id="zip" name="zip" placeholder="10001" required />
                        </div>
                    </div>

                    {/* Card Details Section */}
                    <div className="right-section">
                        <h3>Card Details</h3>
                        <div className="input-group">
                            <label htmlFor="cardName">Name on Card</label>
                            <input type="text" id="cardName" name="cardName" placeholder="Sir Sachin Khatri" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="1111-2222-3333-4444" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="expDate">Expiration Date</label>
                            <input type="text" id="expDate" name="expDate" placeholder="MM/YY" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" id="cvv" name="cvv" placeholder="123" required />
                        </div>
                    </div>
                </div>

                <button type="submit" className="checkout-button">Confirm and Subscribe</button>
            </form>
        </div>
    );
};

export default BillingSection;
