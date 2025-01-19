import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import "../css/Moduleinfo.css";

const Moduleinfo = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { schedule } = location.state || {};
    const [students, setStudents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [newStudentData, setNewStudentData] = useState({
        name: "",
        id: "",
        photo: null,
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAddStudent = () => {
        if (newStudentData.name.trim() && newStudentData.id.trim()) {
            setStudents([...students, { ...newStudentData }]);
            setNewStudentData({ name: "", id: "", photo: null });
            setShowAddModal(false);
        }
    };

    const handleUpdateStudent = () => {
        if (currentStudent !== null) {
            const updatedStudents = students.map((student, index) =>
                index === currentStudent ? { ...newStudentData } : student
            );
            setStudents(updatedStudents);
            setCurrentStudent(null);
            setNewStudentData({ name: "", id: "", photo: null });
            setShowUpdateModal(false);
        }
    };

    const handleDeleteStudent = (index) => {
        setStudents(students.filter((_, i) => i !== index));
    };

    const openUpdateModal = (index) => {
        setCurrentStudent(index);
        setNewStudentData(students[index]);
        setShowUpdateModal(true);
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
                            <strong>Working Days:</strong> {schedule.workingDays}
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
                                                    student.photo
                                                        ? URL.createObjectURL(student.photo)
                                                        : "https://via.placeholder.com/50"
                                                }
                                                alt="Student"
                                                className="student-photo"
                                            />
                                        </div>
                                        <div className="student-row">
                                            <p><strong>Name:</strong> {student.name}</p>
                                        </div>
                                        <div className="student-row">
                                            <p><strong>ID:</strong> {student.id}</p>
                                        </div>
                                        <div className="student-actions">
                                            <button
                                                className="update-btn"
                                                onClick={() => openUpdateModal(index)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteStudent(index)}
                                            >
                                                Delete
                                            </button>
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
                                setNewStudentData({ ...newStudentData, photo: e.target.files[0] })
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
            {/* Update Modal */}
            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Student</h3>
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
                                setNewStudentData({ ...newStudentData, photo: e.target.files[0] })
                            }
                        />
                        <button className="save-btn" onClick={handleUpdateStudent}>
                            Save
                        </button>
                        <button className="cancel-btn" onClick={() => setShowUpdateModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moduleinfo;
