import React, { useState, useRef, useEffect } from "react";
import "../css/CameraFeed.css"; // Import the CSS file

// Import images for camera controls
import playPauseIcon from "../assets/playpause.png";
import fullscreenIcon from "../assets/fullscreen.png";
import standardScreenIcon from "../assets/standardscreen.png";

const CameraFeed = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoSize, setVideoSize] = useState("standard"); // State to track video size

    useEffect(() => {
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
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!isFullscreen) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                } else if (videoRef.current.mozRequestFullScreen) {
                    videoRef.current.mozRequestFullScreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                    videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                    videoRef.current.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const toggleVideoSize = (size) => {
        setVideoSize(size); // Update the video size based on the selected option
    };

    return (
        <div className={`camera-container ${videoSize}`}>
            <video ref={videoRef} width="100%" height="auto" autoPlay />
            {/* Camera Controls */}
            <div className="camera-controls">
                <div className="control-icons">
                    {/* Play/Pause */}
                    <img
                        src={playPauseIcon}
                        alt="Play/Pause"
                        onClick={togglePlay}
                        className="control-icon"
                    />
                    {/* Standard size */}
                    <img
                        src={standardScreenIcon}
                        alt="Standard"
                        onClick={() => toggleVideoSize("standard")}
                        className="control-icon"
                    />
                    {/* Full-screen size */}
                    <img
                        src={fullscreenIcon}
                        alt="Full-Screen"
                        onClick={() => toggleVideoSize("full-screen")}
                        className="control-icon"
                    />
                </div>
            </div>
        </div>
    );
};

export default CameraFeed;
