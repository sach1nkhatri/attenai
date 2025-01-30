import React from "react";
import "../css/RecentActivity.css";

const RecentActivity = ({ activities }) => {
    // ✅ Sort by time (latest first) and show only the last 5
    const recentActivities = [...activities]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

    return (
        <div className="recent-activity">
            <h2 className="recent-activity-title">Recent Activity</h2>
            <ul className="activity-list">
                {recentActivities.map((activity, index) => (
                    <li key={index} className="activity-item">
                        <div className="activity-info">
                            <div className="activity-avatar">
                                {activity.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="activity-name">{activity.name}</h3>
                                <p className="activity-time">
                                    {new Date(activity.time).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`activity-status ${
                                activity.status === "Checked In" ? "status-checked" : "status-late"
                            }`}
                        >
                            {activity.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivity;
