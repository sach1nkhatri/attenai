import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("✅ Logged-in user:", currentUser.uid);
                setUser(currentUser);
            } else {
                console.error("❌ No user logged in.");
                setUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // ✅ Fetch Attendance Data for ALL Users
    useEffect(() => {
        if (!user) {
            console.warn("⚠️ Waiting for user authentication...");
            return;
        }

        console.log(`📡 Fetching attendance for all users...`);

        const attendanceRef = collection(db, "AttendanceRecords");
        const q = query(
            attendanceRef,
            orderBy("timeRecorded", "desc") // ✅ Fetch newest records first
        );

        // ✅ Listen for real-time updates
        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.warn("⚠️ No attendance records found in Firestore.");
                setAttendanceData({});
                return;
            }

            console.log(`✅ Firestore returned ${snapshot.docs.length} documents.`);
            const moduleWiseData = {};

            snapshot.docs.forEach(docSnapshot => {
                const record = docSnapshot.data();
                console.log(`📄 Retrieved record: ${JSON.stringify(record)}`);

                if (!record.module || !record.timeRecorded) {
                    console.warn(`⚠️ Skipping record: Missing 'module' or 'timeRecorded'`);
                    return;
                }

                // ✅ Convert Firestore Timestamp to Nepal Time (UTC+5:45)
                let dateRecorded = "Unknown Date";
                let formattedTime = "Unknown Time";

                if (record.timeRecorded?.seconds) {
                    const utcTimestamp = new Date(record.timeRecorded.seconds * 1000); // Convert Firestore timestamp (UTC)

                    // ✅ Manually Adjust UTC Time to Nepal Time (UTC+5:45)
                    const nepalTime = new Date(utcTimestamp.getTime() + (5 * 60 + 45) * 60 * 1000);

                    // ✅ Extract Date & Time
                    dateRecorded = nepalTime.toISOString().split("T")[0]; // Extract date
                    formattedTime = nepalTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }); // ✅ Display in HH:MM AM/PM format
                } else if (typeof record.timeRecorded === "string") {
                    dateRecorded = record.timeRecorded.split(" ")[0];
                    formattedTime = record.timeRecorded.split(" ")[1];
                }

                if (!moduleWiseData[record.module]) {
                    moduleWiseData[record.module] = {};
                }
                if (!moduleWiseData[record.module][dateRecorded]) {
                    moduleWiseData[record.module][dateRecorded] = [];
                }

                moduleWiseData[record.module][dateRecorded].push({
                    ...record,
                    formattedTime
                });
            });

            console.log("✅ Final Processed Attendance Data:", moduleWiseData);
            setAttendanceData(moduleWiseData);
        }, (error) => {
            console.error("❌ Firestore Query Error:", error.code, error.message);
        });

        return () => unsubscribeFirestore();
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`attendance-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
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
                                                {attendanceData[moduleName]?.[date]?.map((entry, index) => {
                                                    let lateStatus = "On Time"; // Default status

                                                    // ✅ Check if the user is late based on the schedule
                                                    const scheduledTime = new Date();
                                                    scheduledTime.setHours(9, 0, 0); // 🔹 Replace with actual scheduled time (e.g., 9:00 AM)

                                                    if (entry.timeRecorded?.seconds) {
                                                        const utcTimestamp = new Date(entry.timeRecorded.seconds * 1000);
                                                        const nepalTime = new Date(utcTimestamp.getTime() + (5 * 60 + 45) * 60 * 1000);

                                                        if (nepalTime > scheduledTime) {
                                                            lateStatus = "Late"; // ✅ Mark as "Late" if checked in after scheduled time
                                                        }
                                                    }

                                                    return (
                                                        <tr key={entry.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{entry.name}</td>
                                                            <td>{entry.formattedTime}</td> {/* ✅ Shows time in correct local format */}
                                                            <td className={entry.status === "Present" ? "status-present" : "status-absent"}>
                                                                {entry.status}
                                                            </td>
                                                            <td className={lateStatus === "Late" ? "status-late" : "status-on-time"}>
                                                                {lateStatus} {/* ✅ Correctly displays Late/On Time */}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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
