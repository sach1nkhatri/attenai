import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import "../css/Moduleinfo.css";
import { query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth(); // ✅ Get current user


const ModuleInfo = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { schedule } = location.state || {};
    const [students, setStudents] = useState([]);
    const [registeredAttendees, setRegisteredAttendees] = useState([]);
    const [searchUID, setSearchUID] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const auth = getAuth(); // ✅ Move `getAuth()` inside the component

    // New state for updating module details
    const [updatedStartTime, setUpdatedStartTime] = useState(schedule?.startTime || "");
    const [updatedEndTime, setUpdatedEndTime] = useState(schedule?.endTime || "");
    const [updatedWorkingDays, setUpdatedWorkingDays] = useState(schedule?.workingDays || []);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // ✅ Fetch students for the current module
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

    // ✅ Fetch Registered Attendees from Firestore
    // ✅ Fetch students for the current module
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

    // ✅ Fetch Attendees Registered by the Logged-in User
    useEffect(() => {
        const fetchAttendees = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.error("❌ No logged-in user.");
                return;
            }

            try {
                const attendeesRef = collection(db, "Attendee");
                const q = query(attendeesRef, where("registeredBy", "==", user.uid)); // ✅ Fetch only attendees added by the logged-in user
                const attendeeSnapshot = await getDocs(q);

                const attendeesList = attendeeSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setRegisteredAttendees(attendeesList);
                console.log("✅ Attendees added by user:", attendeesList);
            } catch (error) {
                console.error("❌ Error fetching registered attendees:", error);
            }
        };

        fetchAttendees();
    }, [auth.currentUser]); // ✅ Fetch attendees when user logs in

    const handleAddStudent = async () => {
        if (!selectedStudent) {
            alert("❌ Please select a student to add.");
            return;
        }

        console.log("🆔 Selected UID:", selectedStudent);
        console.log("📋 Registered Attendees List:", registeredAttendees);

        // 🔍 Find the student in the Attendee list (Only attendees added by the logged-in user)
        const studentToAdd = registeredAttendees.find(student => student.uid === selectedStudent);

        console.log("✅ Found Student:", studentToAdd);

        if (!studentToAdd) {
            alert("❌ Selected student not found or not registered by you.");
            return;
        }

        // ⚠️ Prevent adding the same student multiple times
        if (students.some(student => student.uid === studentToAdd.uid)) {
            alert("⚠️ This student is already added to the module.");
            return;
        }

        // ✅ Create new student object
        const newStudent = {
            name: studentToAdd.name,
            uid: studentToAdd.uid,
        };

        try {
            if (schedule?.id) {
                console.log("📂 Firestore Doc Ref:", schedule.id);

                const docRef = doc(db, "schedules", schedule.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const existingData = docSnap.data();
                    const existingStudents = existingData.students || [];

                    // ⚠️ Ensure we are updating, not replacing
                    const updatedStudents = [...existingStudents, newStudent];

                    console.log("📝 Updating Firestore with students:", updatedStudents);

                    await updateDoc(docRef, { students: updatedStudents });

                    // ✅ Update local state only after Firestore update
                    setStudents(updatedStudents);
                    setShowAddModal(false);
                    setSelectedStudent("");
                    setSearchUID("");

                    console.log("✅ Student added successfully!");
                } else {
                    console.error("❌ Module not found in Firestore.");
                }
            } else {
                console.error("❌ No valid schedule ID provided.");
            }
        } catch (error) {
            console.error("❌ Error updating Firestore:", error);
            alert("❌ Failed to add student. Please try again.");
        }
    };


    const handleDeleteStudent = async (uid) => {
        if (!window.confirm("⚠️ Are you sure you want to remove this student?")) return;

        const updatedStudents = students.filter(student => student.uid !== uid);
        setStudents(updatedStudents);

        if (schedule?.id) {
            try {
                const docRef = doc(db, "schedules", schedule.id);
                await updateDoc(docRef, { students: updatedStudents });
                console.log(`✅ Student with UID ${uid} removed successfully!`);
            } catch (error) {
                console.error("❌ Error removing student from Firestore:", error);
            }
        }
    };

    // ✅ Update module details in Firestore
    const handleUpdateModule = async () => {
        if (!updatedStartTime || !updatedEndTime || updatedWorkingDays.length === 0) {
            alert("❌ Please fill in all fields before updating.");
            return;
        }

        if (schedule?.id) {
            try {
                const docRef = doc(db, "schedules", schedule.id);
                await updateDoc(docRef, {
                    startTime: updatedStartTime,
                    endTime: updatedEndTime,
                    workingDays: updatedWorkingDays
                });
                alert("✅ Module updated successfully!");
                setShowUpdateModal(false);
            } catch (error) {
                console.error("❌ Error updating module:", error);
            }
        }
    };

    return (
        <div className="module-info-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="module-header">
                {schedule ? (
                    <>
                        <h1>Schedule Information</h1>
                        <p><strong>Module:</strong> {schedule.module}</p>
                        <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                        <p><strong>Working Days:</strong> {schedule.workingDays.join(", ")}</p>
                        <button className="update-btn" onClick={() => setShowUpdateModal(true)}>Update Module</button>
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
                                        <p><strong>Name:</strong> {student.name}</p>
                                        <p><strong>UID:</strong> {student.uid}</p>
                                        <button className="delete-btn" onClick={() => handleDeleteStudent(student.uid)}>
                                            Remove
                                        </button>
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
            {showAddModal && (
                <div className="modal-overlay">
                    {console.log("🟢 Add Student Modal is OPEN")}
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
                        <button className="cancel-btn" onClick={() => {
                            console.log("🔴 Closing Add Student Modal"); // Debugging log
                            setShowAddModal(false);
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Update Module Modal */}
            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Module</h3>
                        <input type="time" value={updatedStartTime}
                               onChange={(e) => setUpdatedStartTime(e.target.value)}/>
                        <input type="time" value={updatedEndTime} onChange={(e) => setUpdatedEndTime(e.target.value)}/>
                        <select multiple value={updatedWorkingDays}
                                onChange={(e) => setUpdatedWorkingDays([...e.target.selectedOptions].map(option => option.value))}>
                            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <button onClick={handleUpdateModule}>Save</button>
                        <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
                        <button className="add-btn" onClick={() => {
                            console.log("🟢 Open Add Student Modal"); // Debugging log
                            setShowAddModal(true);
                        }}>
                            Add Student
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleInfo;
