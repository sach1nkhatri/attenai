import React, { useState } from "react";
import "../css/Attendance.css";
import Header from "../components/clientHeader";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

const Attendance = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([
        { id: 1, class: "34 A", date: "2025-01-15", status: "Present" },
        { id: 2, class: "34 A", date: "2025-01-14", status: "Absent" },
        { id: 3, class: "34 B", date: "2025-01-13", status: "Present" },
        { id: 4, class: "35 C", date: "2025-01-12", status: "Absent" },
        { id: 5, class: "36 A", date: "2025-01-11", status: "Present" },
    ]);

    const [newEntry, setNewEntry] = useState({ class: "", date: "", status: "" });

    const handleAdd = () => {
        if (newEntry.class && newEntry.date && newEntry.status) {
            setData([...data, { id: data.length + 1, ...newEntry }]);
            setNewEntry({ class: "", date: "", status: "" });
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
            item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.date.includes(searchTerm)
    );

    const groupedData = filteredData.reduce((acc, item) => {
        const classNumber = item.class.split(' ')[0];
        if (!acc[classNumber]) acc[classNumber] = [];
        acc[classNumber].push(item);
        return acc;
    }, {});

    return (
        <div className="attendance-page">
            <DashboardSidebar />
            <div className="main-content">
                <Header />
                <div className="content">
                    <header className="attendance-header">
                        <h1>Attendance</h1>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input animated-input"
                        />
                    </header>
                    <div className="add-section animated-section">
                        <input
                            type="text"
                            placeholder="Class"
                            value={newEntry.class}
                            onChange={(e) => setNewEntry({ ...newEntry, class: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newEntry.date}
                            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                        />
                        <select
                            value={newEntry.status}
                            onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
                        >
                            <option value="">Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                        <button onClick={handleAdd} className="add-button animated-button">Add</button>
                    </div>
                    <div className="attendance-tables animated-tables">
                        {Object.keys(groupedData).map((classNumber) => (
                            <div key={classNumber} className="table-container">
                                <h2>Class {classNumber}</h2>
                                <table className="attendance-table">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Class</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupedData[classNumber].map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.class}</td>
                                            <td>{item.date}</td>
                                            <td className={item.status.toLowerCase() === "present" ? "status-present" : "status-absent"}>{item.status}</td>
                                            <td>
                                                <button onClick={() => handleDelete(item.id)} className="delete-button animated-delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Attendance;