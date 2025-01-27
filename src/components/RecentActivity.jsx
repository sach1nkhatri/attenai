import React from "react";
import "../css/RecentActivity.css";

const RecentActivity = ({ activities }) => {
    return (
        <div className="recent-activity">
            <h2 className="recent-activity-title">Recent Activity</h2>
            <ul className="activity-list">
                {activities.map((activity, index) => (
                    <li key={index} className="activity-item">
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
