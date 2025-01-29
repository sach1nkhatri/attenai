import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import "../css/Moduleinfo.css";

const ModuleInfo = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { schedule } = location.state || {};
    const [students, setStudents] = useState([]);
    const [registeredAttendees, setRegisteredAttendees] = useState([]); // Fetch attendees
    const [searchUID, setSearchUID] = useState(""); // Search input for UID
    const [selectedStudent, setSelectedStudent] = useState(""); // Selected UID
    const [showAddModal, setShowAddModal] = useState(false);

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

    // Fetch Registered Attendees from Firestore
    useEffect(() => {
        const fetchAttendees = async () => {
            const attendeesRef = collection(db, "Attendee");
            const attendeeSnapshot = await getDocs(attendeesRef);
            const attendeesList = attendeeSnapshot.docs.map(doc => ({
                id: doc.id, // UID as the ID
                ...doc.data()
            }));
            setRegisteredAttendees(attendeesList);
        };

        fetchAttendees();
    }, []);

    const handleAddStudent = async () => {
        if (!selectedStudent) {
            alert("Please select a student to add.");
            return;
        }

        // Find student details from the Attendee list
        const studentToAdd = registeredAttendees.find((student) => student.uid === selectedStudent);

        if (!studentToAdd) {
            alert("Selected student not found.");
            return;
        }

        // Prevent duplicate entries
        if (students.some(student => student.uid === studentToAdd.uid)) {
            alert("This student is already added to the module.");
            return;
        }

        const newStudent = {
            name: studentToAdd.name,
            uid: studentToAdd.uid, // Use UID instead of manually entered ID
        };

        const updatedStudents = [...students, newStudent];
        setStudents(updatedStudents);

        setShowAddModal(false);
        setSelectedStudent("");
        setSearchUID(""); // Reset search field

        // Update Firestore
        if (schedule?.id) {
            const docRef = doc(db, "schedules", schedule.id);
            await updateDoc(docRef, { students: updatedStudents });
        }
    };

    const handleDeleteStudent = async (uid) => {
        if (!window.confirm("Are you sure you want to remove this student?")) return;

        const updatedStudents = students.filter(student => student.uid !== uid);
        setStudents(updatedStudents);

        // Update Firestore
        if (schedule?.id) {
            const docRef = doc(db, "schedules", schedule.id);
            await updateDoc(docRef, { students: updatedStudents });
        }
    };

    return (
        <div className="module-info-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="module-header">
                {schedule ? (
                    <>
                        <h1>Module Information</h1>
                        <p><strong>Module:</strong> {schedule.module}</p>
                        <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                        <p><strong>Working Days:</strong> {schedule.workingDays.join(", ")}</p>
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
                                            <p><strong>Name:</strong> {student.name}</p>
                                        </div>
                                        <div className="student-row">
                                            <p><strong>UID:</strong> {student.uid}</p>
                                        </div>
                                        <div className="student-row">
                                            <button className="delete-btn" onClick={() => handleDeleteStudent(student.uid)}>
                                                Remove
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

                        {/* Search Bar for UID */}
                        <input
                            type="text"
                            placeholder="Search by UID"
                            value={searchUID}
                            onChange={(e) => setSearchUID(e.target.value)}
                        />

                        {/* Filtered Dropdown Showing UID & Name */}
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            <option value="">Select Student</option>
                            {registeredAttendees
                                .filter((student) =>
                                    student.uid.toLowerCase().includes(searchUID.toLowerCase())
                                )
                                .map((student) => (
                                    <option key={student.uid} value={student.uid}>
                                        {student.name} (UID: {student.uid})
                                    </option>
                                ))}
                        </select>

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
