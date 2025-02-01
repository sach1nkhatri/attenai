import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import "../css/RecentActivity.css";

const RecentActivity = () => {
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        console.log("📡 Fetching recent activity...");

        const attendanceRef = collection(db, "AttendanceRecords");
        const q = query(
            attendanceRef,
            orderBy("timeRecorded", "desc"), // ✅ Sort by latest first
            where("status", "==", "Present") // ✅ Filter only attendance-related logs
        );

        // ✅ Listen for real-time updates from Firestore
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.warn("⚠️ No recent activity found.");
                setRecentActivities([]);
                return;
            }

            const recentData = snapshot.docs
                .map(doc => {
                    const data = doc.data();

                    // ✅ Convert Firestore timestamp to Nepal Time (UTC+5:45)
                    let localTime = "Unknown Time";
                    if (data.timeRecorded?.seconds) {
                        const utcTimestamp = new Date(data.timeRecorded.seconds * 1000); // Convert Firestore timestamp (UTC)

                        // ✅ Manually Adjust UTC Time to Nepal Time (UTC+5:45)
                        const nepalTime = new Date(utcTimestamp.getTime() + (5 * 60 + 45) * 60 * 1000);

                        // ✅ Format time correctly (HH:MM AM/PM, DD MMM YYYY)
                        localTime = nepalTime.toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        });
                    }

                    return {
                        id: doc.id,
                        name: data.name,
                        time: localTime,
                        status: data.status
                    };
                })
                .slice(0, 5); // ✅ Show only the last 5 records

            console.log("✅ Recent Activity Data:", recentData);
            setRecentActivities(recentData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="recent-activity">
            <h2 className="recent-activity-title">Recent Activity</h2>
            <ul className="activity-list">
                {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                        <li key={activity.id || index} className="activity-item">
                            <div className="activity-info">
                                <div className="activity-avatar">
                                    {activity.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="activity-name">{activity.name}</h3>
                                    <p className="activity-time">{activity.time}</p>
                                </div>
                            </div>
                            <span
                                className={`activity-status ${
                                    activity.status === "Present" ? "status-checked" : "status-late"
                                }`}
                            >
                                {activity.status}
                            </span>
                        </li>
                    ))
                ) : (
                    <p className="no-activity">No recent attendees found.</p>
                )}
            </ul>
        </div>
    );
};

export default RecentActivity;
