import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Auth
import { db } from "../firebaseConfig"; // Import Firestore
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import AddModule from "./AddModule";
import "../css/AddSchedules.css";

const AddSchedules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [schedules, setSchedules] = useState([]); // ✅ Stores user's schedules
    const navigate = useNavigate();
    const auth = getAuth(); // ✅ Get the logged-in user

    // ✅ Toggle Sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // ✅ Add a new schedule and store `createdBy` field
    const addSchedule = async (newSchedule) => {
        const user = auth.currentUser; // ✅ Get the logged-in user
        if (!user) {
            console.error("❌ User is not logged in.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "schedules"), {
                ...newSchedule,
                createdBy: user.uid, // ✅ Store UID of creator
            });

            console.log("✅ Schedule saved with ID:", docRef.id);

            // ✅ Update UI after adding a schedule
            setSchedules([...schedules, { ...newSchedule, id: docRef.id }]);
        } catch (error) {
            console.error("❌ Error adding schedule:", error);
        }
    };

    // ✅ Fetch only schedules created by the logged-in user
    const fetchSchedules = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("❌ No logged-in user.");
            return;
        }

        try {
            const schedulesRef = collection(db, "schedules");
            const q = query(schedulesRef, where("createdBy", "==", user.uid)); // ✅ Filter by user UID
            const querySnapshot = await getDocs(q);

            const userSchedules = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSchedules(userSchedules);
            console.log("✅ Schedules created by user:", userSchedules);
        } catch (error) {
            console.error("❌ Error fetching schedules:", error);
        }
    };

    // ✅ Fetch schedules when user logs in
    useEffect(() => {
        fetchSchedules();
    }, [auth.currentUser]); // ✅ Refetch if the user changes

    // ✅ Handle clicking on a schedule card
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
                        <h2 className="modules-heading">Your Modules</h2>
                        <div className="schedule-cards-horizontal">
                            {schedules.length > 0 ? (
                                schedules.map((schedule) => (
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
                                ))
                            ) : (
                                <p>No schedules found. Create one to get started!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddSchedules;
