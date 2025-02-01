import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { db } from "../firebaseConfig"; // ✅ Firestore import
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import "../css/Insights.css";

// Import Chart.js modules
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Insights = () => {
    const [selectedModule, setSelectedModule] = useState(""); // ✅ Track selected module
    const [modules, setModules] = useState([]); // ✅ Store module list
    const [chartType, setChartType] = useState("pie"); // ✅ Track selected chart type
    const [attendanceStats, setAttendanceStats] = useState({
        checkedIn: 0,
        late: 0,
        absent: 0
    });

    // ✅ Fetch all available modules from Firestore (Created by the User)
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const moduleRef = collection(db, "schedules");
                const moduleSnapshot = await getDocs(moduleRef);
                const moduleList = moduleSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().module
                }));
                setModules(moduleList);
            } catch (error) {
                console.error("❌ Error fetching modules:", error);
            }
        };

        fetchModules();
    }, []);

    // ✅ Fetch attendance for the selected module (Real-Time Updates)
    useEffect(() => {
        if (!selectedModule) return;

        console.log(`📡 Fetching attendance for module: ${selectedModule}`);

        const attendanceRef = collection(db, "AttendanceRecords");
        const q = query(attendanceRef, where("module", "==", selectedModule));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.warn("⚠️ No attendance records found for this module.");
                setAttendanceStats({ checkedIn: 0, late: 0, absent: 0 }); // ✅ Prevents old data from showing
                return;
            }

            let checkedInCount = 0;
            let lateCount = 0;
            let absentCount = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === "Checked In" || data.status === "Present") checkedInCount++;
                else if (data.status === "Late") lateCount++;
                else if (data.status === "Absent") absentCount++;
            });

            console.log("✅ Attendance Stats Updated:", { checkedInCount, lateCount, absentCount });

            setAttendanceStats({
                checkedIn: checkedInCount,
                late: lateCount,
                absent: absentCount
            });
        });

        return () => unsubscribe(); // ✅ Unsubscribe on unmount
    }, [selectedModule]);

    // ✅ Chart Data (Ensure Data Always Renders)
    const chartData = {
        labels: ["Checked In", "Late", "Absent"],
        datasets: [
            {
                data: attendanceStats.checkedIn || attendanceStats.late || attendanceStats.absent
                    ? [attendanceStats.checkedIn, attendanceStats.late, attendanceStats.absent]
                    : [1, 1, 1], // ✅ Prevents Chart.js from breaking if no data
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                borderWidth: 2,
                hoverOffset: 10
            },
        ],
    };

    // ✅ Bar Chart Options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#eeeeee"
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false, // Hide legend in bar chart for cleaner UI
            }
        }
    };

    return (
        <div className="insights-container">
            <h2>Insights</h2>

            {/* 📌 Module Selection Dropdown */}
            <div className="controls">
                <div className="module-selector">
                    <label>Select Module:</label>
                    <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                        <option value="">All Modules</option>
                        {modules.map((module) => (
                            <option key={module.id} value={module.name}>
                                {module.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 📌 Chart Type Toggle */}
                <div className="chart-toggle">
                    <label>Chart Type:</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="pie">Pie Chart</option>
                        <option value="bar">Bar Chart</option>
                    </select>
                </div>
            </div>

            {/* 📌 Display the selected chart dynamically */}
            <div className="charts">
                <div className="chart">
                    <h3>Attendance Overview ({selectedModule || "All Modules"})</h3>
                    {chartType === "pie" ? (
                        <Pie data={chartData} />
                    ) : (
                        <div className="bar-chart-container">
                            <Bar data={chartData} options={barOptions} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
