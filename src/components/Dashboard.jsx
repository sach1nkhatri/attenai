import React, { useState, useEffect } from "react";
import Sidebar from "./DashboardSidebar";
import CameraFeed from "./CameraFeed";
import DashboardOverview from "./DashboardOverview";
import ClientHeader from "./clientHeader";
import Insights from "./Insights";
import RecentActivity from "../components/RecentActivity";
import { db } from "../firebaseConfig"; // ✅ Import Firebase
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import "../css/Dashboard.css";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [dashboardData, setDashboardData] = useState({ present: 0, absent: 0, averageArrival: "", onTimeRate: 0 });

    useEffect(() => {
        // ✅ Fetch recent activities (last 5)
        const activitiesRef = collection(db, "AttendanceRecords");
        const q = query(activitiesRef, orderBy("inTime", "desc"), limit(5));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newActivities = snapshot.docs.map(doc => ({
                name: doc.data().name,
                time: new Date(doc.data().inTime).toLocaleString(),
                status: doc.data().outTime ? "Checked Out" : "Checked In"
            }));
            setActivities(newActivities);
        });

        return () => unsubscribe(); // ✅ Unsubscribe on unmount
    }, []);

    useEffect(() => {
        // ✅ Fetch dashboard overview stats (modify this based on your data structure)
        const dashboardRef = collection(db, "DashboardStats");
        const unsubscribe = onSnapshot(dashboardRef, (snapshot) => {
            if (!snapshot.empty) {
                const stats = snapshot.docs[0].data();
                setDashboardData({
                    present: stats.present || 0,
                    absent: stats.absent || 0,
                    averageArrival: stats.averageArrival || "",
                    onTimeRate: stats.onTimeRate || 0
                });
            }
        });

        return () => unsubscribe(); // ✅ Unsubscribe on unmount
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container"> {/* ✅ Wrap everything in a separate container */}
            <div className="dashboard-grid">
                <ClientHeader toggleSidebar={toggleSidebar} />
                <DashboardOverview
                    present={dashboardData.present}
                    absent={dashboardData.absent}
                    averageArrival={dashboardData.averageArrival}
                    onTimeRate={dashboardData.onTimeRate}
                />

                <CameraFeed />
                <RecentActivity activities={activities} />
                <Insights />
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}></div>
            </div>

            {/* ✅ Footer placed outside of `.dashboard-grid` */}
            <footer className="dash-footer">
                <p>
                    &copy; 2025 AttenAi | Developed By{' '}
                    <a href="https://sachin.bio/" target="_blank" rel="noopener noreferrer">
                        Sachin Khatri
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
