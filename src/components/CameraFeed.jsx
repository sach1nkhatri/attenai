import React from "react";
import Webcam from "react-webcam";
import "../css/CameraFeed.css"; // CameraFeed-specific styles

const CameraFeed = () => {
    const webcamRef = React.useRef(null);

    return (
        <div className="camera-feed-container">
            <h2>Camera Feed</h2>
            <div className="video-container">
                {/* Webcam Feed */}
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{
                        width: "100%",
                        borderRadius: "10px",
                    }}
                />
            </div>
        </div>
    );
};

export default CameraFeed;
