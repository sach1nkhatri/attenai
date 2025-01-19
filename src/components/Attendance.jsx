import React, { useState } from "react";
import "../css/Attendance.css";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

const Attendance = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([
        { id: 1, classNum: "34", section: "A", date: "2025-01-15", status: "Present" },
        { id: 2, classNum: "34", section: "B", date: "2025-01-14", status: "Absent" },
        { id: 3, classNum: "34", section: "C", date: "2025-01-13", status: "Present" },
        { id: 4, classNum: "35", section: "A", date: "2025-01-12", status: "Absent" },
        { id: 5, classNum: "35", section: "B", date: "2025-01-11", status: "Present" },
        { id: 6, classNum: "36", section: "A", date: "2025-01-10", status: "Present" },
    ]);

    const [newEntry, setNewEntry] = useState({ classNum: "", section: "", date: "", status: "" });

    const handleAdd = () => {
        if (newEntry.classNum && newEntry.section && newEntry.date && newEntry.status) {
            setData([...data, { id: data.length + 1, ...newEntry }]);
            setNewEntry({ classNum: "", section: "", date: "", status: "" });
        } else {
            alert("Please fill in all fields before adding an entry.");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const filteredData = data.filter(
        (item) =>
            item.classNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.date.includes(searchTerm)
    );

    const groupedData = filteredData.reduce((groups, item) => {
        if (!groups[item.classNum]) {
            groups[item.classNum] = [];
        }
        groups[item.classNum].push(item);
        return groups;
    }, {});

    return (
        <div className="attendance-page">
            <DashboardSidebar />

            <div className="main-content">
                <Header />
                <div className="content">
                    <header className="attendance-header">
                        <h1>Attendance</h1>
                    </header>

                    <div className="attendance-tools">
                        {/* Search Bar */}
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by class or date"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Add Entry Section */}
                        <div className="add-section">
                            <h2>Add New Entry</h2>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Class Number"
                                    value={newEntry.classNum}
                                    onChange={(e) =>
                                        setNewEntry({ ...newEntry, classNum: e.target.value })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Section"
                                    value={newEntry.section}
                                    onChange={(e) =>
                                        setNewEntry({ ...newEntry, section: e.target.value })
                                    }
                                />
                                <input
                                    type="date"
                                    value={newEntry.date}
                                    onChange={(e) =>
                                        setNewEntry({ ...newEntry, date: e.target.value })
                                    }
                                />
                                <select
                                    value={newEntry.status}
                                    onChange={(e) =>
                                        setNewEntry({ ...newEntry, status: e.target.value })
                                    }
                                >
                                    <option value="">Status</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                                <button onClick={handleAdd} className="add-button">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Tables - Grouped by Class Number */}
                    <div className="attendance-tables">
                        {Object.keys(groupedData).length > 0 ? (
                            Object.keys(groupedData).map((classGroup) => (
                                <div key={classGroup} className="table-container">
                                    <h2>Class {classGroup}</h2>
                                    <table className="attendance-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Class</th>
                                            <th>Section</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {groupedData[classGroup].map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.classNum}</td>
                                                <td>{item.section}</td>
                                                <td>{item.date}</td>
                                                <td
                                                    className={
                                                        item.status.toLowerCase() === "present"
                                                            ? "status-present"
                                                            : "status-absent"
                                                    }
                                                >
                                                    {item.status}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="delete-button"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <p>No attendance records found.</p>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Attendance;
