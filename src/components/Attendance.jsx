import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import "../css/Attendance.css";
import Header from "../components/clientHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            const attendanceRef = collection(db, "AttendanceRecords");

            // ✅ Listen for real-time updates
            const unsubscribe = onSnapshot(attendanceRef, (snapshot) => {
                const moduleWiseData = {};

                snapshot.docs.forEach(docSnapshot => {
                    const record = docSnapshot.data();
                    const docId = docSnapshot.id;

                    // ✅ Extract date & time from timestamp
                    const recordedDateTime = record.inTime ? new Date(record.inTime) : new Date();
                    const dateRecorded = recordedDateTime.toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
                    const timeRecorded = recordedDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    // ✅ Ensure Firestore updates date & time if missing
                    if (!record.dateRecorded || !record.timeRecorded) {
                        const attendanceDoc = doc(db, "AttendanceRecords", docId);
                        updateDoc(attendanceDoc, {
                            dateRecorded,
                            timeRecorded
                        })
                            .then(() => console.log(`✅ Date & Time updated for ${record.name}`))
                            .catch((error) => console.error(`❌ Error updating date & time: ${error}`));
                    }

                    const status = record.status || "Present";
                    const isLate = record.late ? "Late" : "On Time";

                    const entry = {
                        id: docId,
                        ...record,
                        dateRecorded,
                        timeRecorded,
                        status,
                        isLate
                    };

                    // ✅ Ensure module and date keys exist before pushing data
                    if (!moduleWiseData[record.module]) {
                        moduleWiseData[record.module] = {};
                    }
                    if (!moduleWiseData[record.module][dateRecorded]) {
                        moduleWiseData[record.module][dateRecorded] = [];
                    }

                    moduleWiseData[record.module][dateRecorded].push(entry);
                });

                setAttendanceData(moduleWiseData);
            });

            return () => unsubscribe();
        };

        fetchAttendance();
    }, []);

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
                                                        <td
                                                            className={
                                                                entry.status === "Present"
                                                                    ? "status-present"
                                                                    : "status-absent"
                                                            }
                                                        >
                                                            {entry.status}
                                                        </td>
                                                        <td
                                                            className={
                                                                entry.isLate === "Late"
                                                                    ? "status-late"
                                                                    : "status-on-time"
                                                            }
                                                        >
                                                            {entry.isLate}
                                                        </td>
                                                    </tr>
                                                )) || []}
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
