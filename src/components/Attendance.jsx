import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../css/Attendance.css";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            const attendanceRef = collection(db, "AttendanceRecords");

            // Listen for real-time updates
            const unsubscribe = onSnapshot(attendanceRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAttendanceData(data);
            });

            return () => unsubscribe(); // Cleanup listener on unmount
        };

        fetchAttendance();
    }, []);

    return (
        <div className="attendance-page">
            <DashboardSidebar />
            <div className="main-content">
                <Header />
                <div className="content">
                    <header className="attendance-header">
                        <h1>Attendance</h1>
                    </header>

                    {/* Attendance Table */}
                    <div className="attendance-tables">
                        {attendanceData.length > 0 ? (
                            <table className="attendance-table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Module</th>
                                    <th>In Time</th>
                                    <th>Out Time</th>
                                    <th>Attendance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attendanceData.map((entry, index) => (
                                    <tr key={entry.id}>
                                        <td>{index + 1}</td>
                                        <td>{entry.name}</td>
                                        <td>{entry.module}</td>
                                        <td>{entry.inTime || "n/a"}</td>
                                        <td>{entry.outTime || "n/a"}</td>
                                        <td className={entry.status === "Present" ? "status-present" : "status-absent"}>
                                            {entry.status}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No attendance records found.</p>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Attendance;
