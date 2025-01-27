import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import "../css/Moduleinfo.css";

const ModuleInfo = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { schedule } = location.state || {};
    const [students, setStudents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState({
        name: "",
        id: "",
        photo: null,
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Fetch students for the current module
    useEffect(() => {
        const fetchStudents = async () => {
            if (schedule?.id) {
                const docRef = doc(db, "schedules", schedule.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStudents(data.students || []);
                }
            }
        };

        fetchStudents();
    }, [schedule]);

    const handleAddStudent = async () => {
        if (newStudentData.name.trim() && newStudentData.id.trim()) {
            // Add the new student locally
            const newStudent = { ...newStudentData, photo: null }; // photo will be a URL if needed
            const updatedStudents = [...students, newStudent];
            setStudents(updatedStudents);

            // Reset modal form
            setNewStudentData({ name: "", id: "", photo: null });
            setShowAddModal(false);

            // Update Firestore
            if (schedule?.id) {
                const docRef = doc(db, "schedules", schedule.id);
                await updateDoc(docRef, { students: updatedStudents });
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <div className="module-info-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="module-header">
                {schedule ? (
                    <>
                        <h1>Module Information</h1>
                        <p>
                            <strong>Module:</strong> {schedule.module}
                        </p>
                        <p>
                            <strong>Time:</strong> {schedule.startTime} - {schedule.endTime}
                        </p>
                        <p>
                            <strong>Working Days:</strong> {schedule.workingDays.join(", ")}
                        </p>
                    </>
                ) : (
                    <h1>No Module Information Available</h1>
                )}
            </div>
            <div className="module-info-content">
                <div className="dashboard-main-body">
                    {isSidebarOpen && <DashboardSidebar showDetails={false} />}
                    <div className="main-content">
                        <h2>Student List</h2>
                        <button className="add-btn" onClick={() => setShowAddModal(true)}>
                            Add Student
                        </button>
                        <div className="student-container">
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <div key={index} className="student-item">
                                        <div className="student-row">
                                            <img
                                                src={
                                                    student.photo ||
                                                    "https://via.placeholder.com/50"
                                                }
                                                alt="Student"
                                                className="student-photo"
                                            />
                                        </div>
                                        <div className="student-row">
                                            <p>
                                                <strong>Name:</strong> {student.name}
                                            </p>
                                        </div>
                                        <div className="student-row">
                                            <p>
                                                <strong>ID:</strong> {student.id}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No students added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Student</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStudentData.name}
                            onChange={(e) =>
                                setNewStudentData({ ...newStudentData, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="ID"
                            value={newStudentData.id}
                            onChange={(e) =>
                                setNewStudentData({ ...newStudentData, id: e.target.value })
                            }
                        />
                        <input
                            type="file"
                            onChange={(e) =>
                                setNewStudentData({
                                    ...newStudentData,
                                    photo: e.target.files[0],
                                })
                            }
                        />
                        <button className="save-btn" onClick={handleAddStudent}>
                            Save
                        </button>
                        <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleInfo;
