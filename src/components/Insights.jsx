import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import "../css/Insights.css";

// Import Chart.js modules
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Insights = () => {
    // Data for Pie Chart
    const pieData = {
        labels: ["Checked In", "Late", "Absent"],
        datasets: [
            {
                data: [60, 20, 20], // Example data
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                borderWidth: 1,
            },
        ],
    };

    // Data for Bar Chart




    return (
        <div className="insights-container">
            <h2>Insights</h2>
            <div className="charts">
                {/* Pie Chart */}
                <div className="chart">
                    <h3>Attendance Overview</h3>
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default Insights;
