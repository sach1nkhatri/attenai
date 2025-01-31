import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../css/Attendance.css";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    // ✅ Track logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("✅ Logged-in user:", currentUser.uid);
                setUser(currentUser);
            } else {
                console.error("❌ No user logged in.");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ Fetch Attendance Data for Logged-in User
    useEffect(() => {
        if (!user) {
            console.error("❌ No logged-in user found.");
            return;
        }

        const attendanceRef = collection(db, "AttendanceRecords");
        const q = query(attendanceRef, where("uid", "==", user.uid));

        console.log(`📡 Fetching attendance for UID: ${user.uid}`);

        // ✅ Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.warn("⚠️ No attendance records found.");
                setAttendanceData({});
                return;
            }

            const moduleWiseData = {};

            snapshot.docs.forEach(docSnapshot => {
                const record = docSnapshot.data();
                console.log(`📄 Retrieved record: ${JSON.stringify(record)}`);

                // ✅ Extract date from timestamp
                const dateRecorded = record.timeRecorded?.split(" ")[0] || "Unknown Date";

                if (!moduleWiseData[record.module]) {
                    moduleWiseData[record.module] = {};
                }
                if (!moduleWiseData[record.module][dateRecorded]) {
                    moduleWiseData[record.module][dateRecorded] = [];
                }

                moduleWiseData[record.module][dateRecorded].push(record);
            });

            console.log("✅ Final Attendance Data:", moduleWiseData);
            setAttendanceData(moduleWiseData);
        }, (error) => {
            console.error("❌ Firestore Query Error:", error.code, error.message);
        });

        return () => unsubscribe();
    }, [user]); // ✅ Fetch only when user logs in


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`attendance-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
            {/* ✅ Sidebar Overlay */}
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} className="sidebar-overlay" />
            <div className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <div className="content">
                    <header className="attendance-header">
                        <h1>Attendance Records</h1>
                    </header>

                    <div className="attendance-modules">
                        {Object.keys(attendanceData).length > 0 ? (
                            Object.keys(attendanceData).map((moduleName) => (
                                <div key={moduleName} className="module-attendance-container">
                                    {Object.keys(attendanceData[moduleName] || {}).map((date) => (
                                        <div key={`${moduleName}-${date}`} className="module-section">
                                            <h2>Module: {moduleName} | Date: {date}</h2>
                                            <table className="attendance-table">
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                    <th>Late/On Time</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {attendanceData[moduleName]?.[date]?.map((entry, index) => (
                                                    <tr key={entry.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{entry.name}</td>
                                                        <td>{entry.timeRecorded || "Updating..."}</td>
                                                        <td className={entry.status === "Present" ? "status-present" : "status-absent"}>
                                                            {entry.status}
                                                        </td>
                                                        <td className={entry.isLate === "Late" ? "status-late" : "status-on-time"}>
                                                            {entry.isLate}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>No attendance records found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ Transparent Footer Stays at Bottom */}
            <footer className="attendance-footer">
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

export default Attendance;
