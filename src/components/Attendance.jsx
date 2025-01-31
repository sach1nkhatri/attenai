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

    // ✅ Step 1: Track logged-in user
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

    // ✅ Step 2: Fetch Attendance Data for ALL Users
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

                // ✅ Extract date from Firestore timestamp
                let dateRecorded = "Unknown Date";
                let formattedTime = "Unknown Time";

                if (record.timeRecorded?.seconds) {
                    const timestamp = new Date(record.timeRecorded.seconds * 1000);
                    dateRecorded = timestamp.toISOString().split("T")[0];
                    formattedTime = timestamp.toLocaleString(); // ✅ Convert Firestore Timestamp
                } else if (typeof record.timeRecorded === "string") {
                    dateRecorded = record.timeRecorded.split(" ")[0];
                    formattedTime = record.timeRecorded;
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
    }, [user]); // ✅ Fetch only when user is available

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
                                                {attendanceData[moduleName]?.[date]?.map((entry, index) => {
                                                    // ✅ Convert Firestore Timestamp
                                                    let formattedTime = "Unknown Time";
                                                    let lateStatus = "On Time"; // Default status

                                                    if (entry.timeRecorded?.seconds) {
                                                        const timestamp = new Date(entry.timeRecorded.seconds * 1000);
                                                        formattedTime = timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true
                                                        }); // ✅ Only display HH:MM AM/PM

                                                        // ✅ Check if the user is late based on the schedule
                                                        const scheduledTime = new Date(timestamp);
                                                        scheduledTime.setHours(9, 0, 0); // 🔹 Replace with actual scheduled time (e.g., 9:00 AM)

                                                        if (timestamp > scheduledTime) {
                                                            lateStatus = "Late"; // ✅ If the recorded time is after scheduled time, mark as "Late"
                                                        }
                                                    } else if (typeof entry.timeRecorded === "string") {
                                                        formattedTime = entry.timeRecorded.split(" ")[1]; // ✅ Extract only time part
                                                    }

                                                    return (
                                                        <tr key={entry.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{entry.name}</td>
                                                            <td>{formattedTime}</td>
                                                            {/* ✅ Shows only HH:MM AM/PM */}
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
