import React, { useState, useMemo } from "react";
import "./css/Assignments.css";

// Status color mapping
const STATUS = {
    PENDING: "Pending",
    SUBMITTED: "Submitted",
    COMPLETED: "Completed",
};
const STATUS_COLORS = {
    [STATUS.PENDING]: "#ff5252",    // red
    [STATUS.SUBMITTED]: "#ffc107",  // yellow
    [STATUS.COMPLETED]: "#4caf50",  // green
};

const initialAssignments = [
    {
        id: 1,
        title: "Operating Systems Lab Report",
        teacher: "Bhakti Palkar",
        due: "2024-10-10",
        status: STATUS.PENDING,
        description: "Write a detailed report on process scheduling algorithms.",
    },
    {
        id: 2,
        title: "Computer Networks Assignment 2",
        teacher: "Mansi Kambli",
        due: "2024-10-12",
        status: STATUS.SUBMITTED,
        description: "Answer questions on TCP/IP and subnetting.",
    },
    {
        id: 3,
        title: "DBMS Mini Project",
        teacher: "Nirmala Baloorkar",
        due: "2024-10-15",
        status: STATUS.COMPLETED,
        description: "Build a mini project using MySQL and present ER diagrams.",
    },
    {
        id: 4,
        title: "Web Tech Quiz",
        teacher: "Ravi Sharma",
        due: "2024-10-18",
        status: STATUS.PENDING,
        description: "Complete the online quiz on HTML/CSS/JS basics.",
    },
    {
        id: 5,
        title: "AI Assignment",
        teacher: "Priya Desai",
        due: "2024-10-20",
        status: STATUS.PENDING,
        description: "Submit solutions for search algorithms.",
    },
    {
        id: 6,
        title: "Maths Worksheet",
        teacher: "Anil Kumar",
        due: "2024-10-22",
        status: STATUS.COMPLETED,
        description: "Solve all problems in worksheet 5.",
    },
];

function getCompletion(assignments) {
    const completed = assignments.filter(a => a.status === STATUS.COMPLETED).length;
    const total = assignments.length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
}

function getSummary(assignments) {
    return {
        pending: assignments.filter(a => a.status === STATUS.PENDING).length,
        completed: assignments.filter(a => a.status === STATUS.COMPLETED).length,
        submitted: assignments.filter(a => a.status === STATUS.SUBMITTED).length,
        total: assignments.length,
        percent: getCompletion(assignments),
    };
}

function getIndicatorColor(percent) {
    if (percent < 50) return "#ff5252";
    if (percent < 80) return "#ffc107";
    return "#4caf50";
}

export default function Assignments() {
    const [assignments, setAssignments] = useState(initialAssignments);
    const [modal, setModal] = useState({ open: false, type: null, data: null });
    const [filter, setFilter] = useState(null); // null, "Pending", "Completed"

    const summary = useMemo(() => getSummary(assignments), [assignments]);
    const percentColor = getIndicatorColor(summary.percent);

    // Filtered assignments for grid
    const gridAssignments = useMemo(() => {
        if (!filter) return assignments;
        return assignments.filter(a => a.status === filter);
    }, [assignments, filter]);

    // Modal open helpers
    const openSummaryModal = (type) => {
        setModal({ open: true, type: "summary", data: type });
        setFilter(type === STATUS.PENDING ? STATUS.PENDING : type === STATUS.COMPLETED ? STATUS.COMPLETED : null);
    };
    const openAssignmentModal = (assignment) => {
        setModal({ open: true, type: "assignment", data: assignment });
    };
    const closeModal = () => {
        setModal({ open: false, type: null, data: null });
        setFilter(null);
    };

    // File upload handler
    const [uploadedFile, setUploadedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadedFile(file);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
        }
    };

    // Submit assignment
    const handleSubmitAssignment = () => {
        if (!modal.data) return;
        setAssignments(prev =>
            prev.map(a =>
                a.id === modal.data.id
                    ? { ...a, status: STATUS.SUBMITTED }
                    : a
            )
        );
        closeModal();
        setUploadedFile(null);
    };

    // Modal assignment details
    const modalAssignment =
        modal.type === "assignment"
            ? assignments.find(a => a.id === modal.data.id)
            : null;

    return (
        <div className="assignments-dashboard">
            {/* Summary Cards */}
            <div className="summary-section">
                <div
                    className="summary-card"
                    style={{ borderTop: "4px solid #ff5252" }}
                    onClick={() => openSummaryModal(STATUS.PENDING)}
                >
                    <div className="summary-icon" style={{ background: "#ff52521a" }}>📘</div>
                    <div>
                        <div className="summary-title">Pending Assignments</div>
                        <div className="summary-value">{summary.pending}</div>
                    </div>
                </div>
                <div
                    className="summary-card"
                    style={{ borderTop: "4px solid #4caf50" }}
                    onClick={() => openSummaryModal(STATUS.COMPLETED)}
                >
                    <div className="summary-icon" style={{ background: "#4caf501a" }}>✅</div>
                    <div>
                        <div className="summary-title">Completed Assignments</div>
                        <div className="summary-value">{summary.completed}</div>
                    </div>
                </div>
                <div
                    className="summary-card"
                    style={{ borderTop: `4px solid ${percentColor}` }}
                    onClick={() => openSummaryModal("percent")}
                >
                    <div className="summary-icon" style={{ background: "#ffc1071a" }}>📊</div>
                    <div>
                        <div className="summary-title">Work Completion %</div>
                        <div className="summary-value">
                            {summary.percent}%{" "}
                            {summary.percent > 80 ? "🟢" : summary.percent > 50 ? "🟡" : "🔴"}
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${summary.percent}%`,
                                    background: percentColor,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Cards Grid */}
            <div className="assignments-wrapper">
                <h1 className="assignments-heading">
                    Assignments
                    {filter && (
                        <span className="filter-badge">
                            {filter} <span className="filter-clear" onClick={() => setFilter(null)}>✕</span>
                        </span>
                    )}
                </h1>
                <div className="assignments-grid">
                    {gridAssignments.map((a) => (
                        <div
                            key={a.id}
                            className="assignment-card"
                            style={{
                                borderLeft: `6px solid ${STATUS_COLORS[a.status]}`,
                                backgroundColor: "#fff",
                                cursor: "pointer",
                            }}
                            onClick={() => openAssignmentModal(a)}
                        >
                            <div className="assignment-header">
                                <h3 className="assignment-title">{a.title}</h3>
                                <div className="teacher-icon">{a.teacher.charAt(0)}</div>
                            </div>
                            <p className="teacher-name">{a.teacher}</p>
                            <div className="card-footer">
                                <span className="due">
                                    Due {new Date(a.due).toLocaleDateString()}
                                </span>
                                <span className={`status-badge status-${a.status.toLowerCase()}`}>
                                    {a.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modal.open && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-content"
                        onClick={e => e.stopPropagation()}
                        style={{ animation: "modalZoomIn 0.25s" }}
                    >
                        <span className="modal-close" onClick={closeModal}>✕</span>
                        {modal.type === "summary" && (
                            <>
                                <h2>
                                    {modal.data === STATUS.PENDING && "Pending Assignments"}
                                    {modal.data === STATUS.COMPLETED && "Completed Assignments"}
                                    {modal.data === "percent" && "Work Completion Details"}
                                </h2>
                                {modal.data === "percent" ? (
                                    <div style={{ margin: "24px 0" }}>
                                        <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                            {summary.percent}%
                                        </div>
                                        <div className="progress-bar-bg" style={{ margin: "16px 0" }}>
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${summary.percent}%`,
                                                    background: percentColor,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            {summary.completed} completed out of {summary.total} assignments.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="modal-assignments-list">
                                        {assignments
                                            .filter(a => a.status === modal.data)
                                            .map(a => (
                                                <div key={a.id} className="modal-assignment-row">
                                                    <div className="modal-assignment-title">{a.title}</div>
                                                    <div className="modal-assignment-due">
                                                        Due {new Date(a.due).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </>
                        )}
                        {modal.type === "assignment" && modalAssignment && (
                            <>
                                <h2>{modalAssignment.title}</h2>
                                <div className="modal-assignment-meta">
                                    <span>Instructor: <b>{modalAssignment.teacher}</b></span>
                                    <span>Due: <b>{new Date(modalAssignment.due).toLocaleDateString()}</b></span>
                                    <span>Status: <b style={{ color: STATUS_COLORS[modalAssignment.status] }}>{modalAssignment.status}</b></span>
                                </div>
                                <div className="modal-assignment-desc">
                                    {modalAssignment.description || "No description provided."}
                                </div>
                                {modalAssignment.status === STATUS.PENDING || modalAssignment.status === STATUS.SUBMITTED ? (
                                    <div
                                        className={`file-upload-area${dragActive ? " drag-active" : ""}`}
                                        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="file-upload" className="file-upload-label">
                                            {uploadedFile
                                                ? (
                                                    <span>
                                                        <b>{uploadedFile.name}</b> <span className="file-upload-change">(Change)</span>
                                                    </span>
                                                )
                                                : (
                                                    <span>
                                                        Drag & drop file here or <span className="file-upload-browse">Browse</span>
                                                    </span>
                                                )
                                            }
                                        </label>
                                    </div>
                                ) : null}
                                {modalAssignment.status === STATUS.PENDING || modalAssignment.status === STATUS.SUBMITTED ? (
                                    <button
                                        className="submit-btn"
                                        disabled={!uploadedFile || modalAssignment.status === STATUS.SUBMITTED}
                                        onClick={handleSubmitAssignment}
                                    >
                                        {modalAssignment.status === STATUS.SUBMITTED ? "Submitted" : "Submit Assignment"}
                                    </button>
                                ) : null}
                                {modalAssignment.status === STATUS.SUBMITTED && (
                                    <div className="submitted-msg">
                                        <b>Assignment submitted!</b>
                                    </div>
                                )}
                                {modalAssignment.status === STATUS.COMPLETED && (
                                    <div className="submitted-msg">
                                        <b>Assignment marked as completed.</b>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
