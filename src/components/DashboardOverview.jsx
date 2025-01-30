import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import Card from "../components/DashboardCard"; // Reusable card component
import "../css/DashboardOverview.css";

// Import images
import PresentLogo from "../assets/PresentLogo.png";
import AverageArrivalLogo from "../assets/ClockIcon.png";
import LateArrivalsLogo from "../assets/WarningLogo.png";
import OnTimeRateLogo from "../assets/OntimeRate.png";

const DashboardOverview = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [presentCount, setPresentCount] = useState(0);
    const [lateCount, setLateCount] = useState(0);
    const [averageArrival, setAverageArrival] = useState("N/A");
    const [onTimeRate, setOnTimeRate] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Fetch available modules from Firebase
        const fetchModules = async () => {
            const modulesRef = collection(db, "schedules");
            const snapshot = await getDocs(modulesRef);
            const moduleList = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().module
            }));
            setModules(moduleList);
        };
        fetchModules();
    }, []);

    useEffect(() => {
        if (!selectedModule) return;

        const attendanceRef = collection(db, "AttendanceRecords");
        const q = query(attendanceRef, where("module", "==", selectedModule));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
            setAttendanceData(data);
            calculateDashboardMetrics(data);
        });

        return () => unsubscribe();
    }, [selectedModule]);

    const calculateDashboardMetrics = (data) => {
        if (!data.length) return;

        const totalPresent = data.length;
        let totalLate = 0;
        let arrivalTimes = [];

        data.forEach(entry => {
            const scheduledTime = entry.scheduledTime; // Time from Firebase
            const arrivalTime = entry.inTime; // When the user checked in

            if (scheduledTime && arrivalTime) {
                const [scheduledHour, scheduledMinute] = scheduledTime.split(":").map(Number);
                const [arrivalHour, arrivalMinute] = arrivalTime.split(":").map(Number);

                if (arrivalHour > scheduledHour || (arrivalHour === scheduledHour && arrivalMinute > scheduledMinute)) {
                    totalLate++;
                }
                arrivalTimes.push(`${arrivalHour}:${arrivalMinute}`);
            }
        });

        // Calculate Average Arrival Time
        if (arrivalTimes.length) {
            const avgArrivalTime = calculateAverageTime(arrivalTimes);
            setAverageArrival(avgArrivalTime);
        }

        setPresentCount(totalPresent);
        setLateCount(totalLate);
        setOnTimeRate(((totalPresent - totalLate) / totalPresent) * 100);
    };

    const calculateAverageTime = (times) => {
        const minutes = times.map(time => {
            const [hour, minute] = time.split(":").map(Number);
            return hour * 60 + minute;
        });

        const avgMinutes = minutes.reduce((sum, m) => sum + m, 0) / minutes.length;
        const avgHour = Math.floor(avgMinutes / 60);
        const avgMinute = Math.round(avgMinutes % 60);

        return `${String(avgHour).padStart(2, "0")}:${String(avgMinute).padStart(2, "0")}`;
    };

    return (
        <div className="dashboard-overview">
            <div className="overview-header">
                <div>
                    <h2 className="dashboard-title">Dashboard Overview</h2>
                    <p className="dashboard-date">{currentTime.toLocaleDateString()}</p>
                </div>
                <button className="export-button" onClick={() => setShowModal(true)}>Select Module</button>
            </div>
            <div className="overview-cards">
                <Card title="Present Today" value={`${presentCount}`} imageSrc={PresentLogo} />
                <Card title="Average Arrival" value={averageArrival} imageSrc={AverageArrivalLogo} />
                <Card title="Late Arrivals" value={`${lateCount}`} imageSrc={LateArrivalsLogo} />
                <Card title="On Time Rate" value={`${onTimeRate.toFixed(2)}%`} imageSrc={OnTimeRateLogo} />
            </div>

            {/* Module Selection Popup */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Select a Module</h2>
                        <ul>
                            {modules.map((module) => (
                                <li key={module.id} onClick={() => {
                                    setSelectedModule(module.name);
                                    setShowModal(false);
                                }}>
                                    {module.name}
                                </li>
                            ))}
                        </ul>
                        <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
