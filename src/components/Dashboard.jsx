import React, { useRef, useEffect } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        // Access the user's webcam
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing the webcam:', error);
            }
        };

        startWebcam();

        return () => {
            // Cleanup: Stop all video streams
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Bad Boy Detector</h1>
            </header>

            <div className="dashboard-main-body">
                <aside className="dashboard-sidebar">
                    <h2>Details</h2>
                    <div className="dashboard-selected-person">Selected Person</div>
                    <div className="dashboard-input-group">
                        <label>Name</label>
                        <input type="text" />
                    </div>
                    <div className="dashboard-input-group">
                        <label>Age</label>
                        <input type="text" />
                    </div>
                    <div className="dashboard-input-group">
                        <label>Address</label>
                        <input type="text" />
                    </div>
                    <div className="dashboard-input-group">
                        <label>Class</label>
                        <input type="text" />
                    </div>
                    <div className="dashboard-buttons">
                        <button>Delete</button>
                        <button>Update</button>
                    </div>
                    <nav className="dashboard-menu">
                        <button>Attendance</button>
                        <button>Unidentified Users</button>
                        <button>Student Details</button>
                        <button>Add Schedule</button>
                        <button>Settings</button>
                    </nav>
                </aside>

                <main className="dashboard-main-content">
                    <div className="dashboard-camera-feed">
                        <video ref={videoRef} autoPlay playsInline className="dashboard-webcam-feed"></video>
                    </div>
                    <div className="dashboard-camera-controls">Camera Controls</div>
                    <div className="dashboard-persons">
                        <div className="dashboard-person-card">
                            <h3>Person 1</h3>
                            <p>Name</p>
                            <p>Age</p>
                            <p>Address</p>
                            <p>Class</p>
                            <p>Time</p>
                        </div>
                        <div className="dashboard-person-card">
                            <h3>Person 2</h3>
                            <p>Name</p>
                            <p>Age</p>
                            <p>Address</p>
                            <p>Class</p>
                            <p>Time</p>
                        </div>
                        <div className="dashboard-person-card">
                            <h3>Person 3</h3>
                            <p>Name</p>
                            <p>Age</p>
                            <p>Address</p>
                            <p>Class</p>
                            <p>Time</p>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="dashboard-footer">
                <p>&copy; 2024 Bad Boy Detector. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
