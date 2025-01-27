import React, { useState, useEffect } from "react";
import Card from "../components/DashboardCard"; // Reusable card component
import "../css/DashboardOverview.css"
import "../assets/PresentLogo.png"


// Import images
import PresentLogo from "../assets/PresentLogo.png";
import AverageArrivalLogo from "../assets/ClockIcon.png";
import LateArrivalsLogo from "../assets/WarningLogo.png";
import OnTimeRateLogo from "../assets/OntimeRate.png";

const DashboardOverview = ({ present, absent, averageArrival, onTimeRate }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Updates every second
        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    return (
        <div className="dashboard-overview">
            <div className="overview-header">
                <div>
                    <h2 className="dashboard-title">Dashboard Overview</h2>
                    <p className="dashboard-date">{currentTime.toLocaleDateString()}</p>
                </div>
                <button className="export-button">Select Module</button>
            </div>
            <div className="overview-cards">
                <Card
                    title="Present Today"
                    value={`${present}`}
                    imageSrc={PresentLogo} // Use imported image
                />
                <Card
                    title="Average Arrival"
                    value={`${averageArrival}`}
                    imageSrc={AverageArrivalLogo} // Use imported image
                />
                <Card
                    title="Late Arrivals"
                    value={`${absent}`}
                    imageSrc={LateArrivalsLogo} // Use imported image
                />
                <Card
                    title="On Time Rate"
                    value={`${onTimeRate}%`}
                    imageSrc={OnTimeRateLogo} // Use imported image
                />
            </div>
        </div>
    );
};

export default DashboardOverview;
