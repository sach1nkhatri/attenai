import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import AddModule from "./AddModule";
import "../css/AddSchedules.css";

const AddSchedules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const addSchedule = async (newSchedule) => {
        try {
            const docRef = await addDoc(collection(db, "schedules"), newSchedule);
            console.log("Document written with ID: ", docRef.id);
            setSchedules([...schedules, { ...newSchedule, id: docRef.id }]); // Add locally
        } catch (error) {
            console.error("Error adding schedule: ", error);
        }
    };

    const fetchSchedules = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "schedules"));
            const loadedSchedules = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setSchedules(loadedSchedules);
        } catch (error) {
            console.error("Error fetching schedules: ", error);
        }
    };

    useEffect(() => {
        fetchSchedules(); // Fetch schedules on component mount
    }, []);

    const handleCardClick = (schedule) => {
        navigate("/moduleinfo", { state: { schedule } });
    };

    return (
        <div className="add-schedules-container">
            <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                <Header toggleSidebar={toggleSidebar} />
                <div className="main-content-inner">
                    <AddModule onAddSchedule={addSchedule} />
                    <div className="modules-container">
                        <h2 className="modules-heading">Modules</h2>
                        <div className="schedule-cards-horizontal">
                            {schedules.map((schedule) => (
                                <div
                                    className="card-horizontal"
                                    key={schedule.id}
                                    onClick={() => handleCardClick(schedule)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <p><strong>Module:</strong> {schedule.module}</p>
                                    <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                                    <p><strong>Working Days:</strong> {schedule.workingDays.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddSchedules;