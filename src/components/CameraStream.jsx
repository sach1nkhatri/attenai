import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const CameraStream = ({ cameraType, streamUrl }) => {
    const videoRef = useRef(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io("http://127.0.0.1:5000");
        setSocket(newSocket);

        // Start the camera stream when component loads
        if (cameraType && socket) {
            socket.emit("start_stream", { type: cameraType, url: streamUrl });
        }

        // Listen for incoming video frames
        if (socket) {
            socket.on("video_frame", (data) => {
                if (videoRef.current) {
                    videoRef.current.src = `data:image/jpeg;base64,${data.frame}`;
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.emit("stop_stream");
                socket.disconnect();
            }
        };
    }, [cameraType, streamUrl, socket]);

    return (
        <div>
            <h3>Video Stream</h3>
            <img ref={videoRef} alt="Video Stream" style={{ width: "100%", maxHeight: "400px", border: "1px solid black" }} />
        </div>
    );
};

export default CameraStream;
