import React, { useState } from "react";
import "./css/Course.css";

const coursesData = [
    {
        id: 1,
        name: "Computer Networks",
        code: "CN-401",
        faculty: "Prof. Mansi Kambli",
        progress: 70,
        icon: "📡",
        materials: [
            { title: "Unit 1 - Introduction to CN.pdf", type: "pdf", link: "#" },
            { title: "Unit 2 - Routing Algorithms.pdf", type: "pdf", link: "#" },
            { title: "CN Summary Notes.docx", type: "docx", link: "#" },
        ],
    },
    {
        id: 2,
        name: "Software Engineering",
        code: "SE-402",
        faculty: "Prof. Bhakti Palkar",
        progress: 85,
        icon: "💻",
        materials: [
            { title: "Module 1 - SDLC.pdf", type: "pdf", link: "#" },
            { title: "Module 2 - UML Notes.docx", type: "docx", link: "#" },
        ],
    },
    {
        id: 3,
        name: "Operating Systems",
        code: "OS-403",
        faculty: "Prof. Nirmala Baloorkar",
        progress: 60,
        icon: "🖥️",
        materials: [
            { title: "Unit 1 - Processes.pdf", type: "pdf", link: "#" },
            { title: "Lab Manual.docx", type: "docx", link: "#" },
        ],
    },
    {
        id: 4,
        name: "DBMS",
        code: "DB-404",
        faculty: "Prof. Ravi Sharma",
        progress: 90,
        icon: "🗄️",
        materials: [
            { title: "ER Diagrams.pdf", type: "pdf", link: "#" },
            { title: "SQL Practice.docx", type: "docx", link: "#" },
        ],
    },
    {
        id: 5,
        name: "Artificial Intelligence",
        code: "AI-405",
        faculty: "Prof. Priya Desai",
        progress: 50,
        icon: "🤖",
        materials: [
            { title: "AI Basics.pdf", type: "pdf", link: "#" },
            { title: "Search Algorithms.docx", type: "docx", link: "#" },
        ],
    },
    {
        id: 6,
        name: "Mathematics IV",
        code: "MA-406",
        faculty: "Prof. Anil Kumar",
        progress: 80,
        icon: "📐",
        materials: [
            { title: "Laplace Transforms.pdf", type: "pdf", link: "#" },
            { title: "Practice Problems.docx", type: "docx", link: "#" },
        ],
    },
];

const fileTypeIcon = {
    pdf: "📄",
    docx: "📝",
    doc: "📝",
    ppt: "📊",
    pptx: "📊",
    xls: "📊",
    xlsx: "📊",
    default: "📁",
};

export default function Course() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [search, setSearch] = useState("");

    const filteredCourses = coursesData.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.faculty.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="courses-page">
            <div className="courses-header">
                <h1>Courses</h1>
                {!selectedCourse && (
                    <input
                        className="courses-search"
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                )}
            </div>

            {/* Courses Grid */}
            {!selectedCourse && (
                <div className="courses-grid">
                    {filteredCourses.map((course) => (
                        <div
                            className="course-card"
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            tabIndex={0}
                        >
                            <div className="course-icon">{course.icon || "📘"}</div>
                            <div className="course-info">
                                <div className="course-title">{course.name}</div>
                                <div className="course-faculty">{course.faculty}</div>
                                <div className="course-code">{course.code}</div>
                                <div className="course-progress-bar-bg">
                                    <div
                                        className="course-progress-bar"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                                <div className="course-progress-label">
                                    {course.progress}% Completed
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCourses.length === 0 && (
                        <div className="courses-empty">No courses found.</div>
                    )}
                </div>
            )}

            {/* Course Detail View */}
            {selectedCourse && (
                <div className="course-detail-modal">
                    <div className="course-detail-header">
                        <button
                            className="back-btn"
                            onClick={() => setSelectedCourse(null)}
                        >
                            ← Back to Courses
                        </button>
                        <div className="course-detail-title">
                            {selectedCourse.icon} {selectedCourse.name}
                        </div>
                        <div className="course-detail-faculty">
                            {selectedCourse.faculty} | {selectedCourse.code}
                        </div>
                    </div>
                    <div className="course-materials-section">
                        <div className="materials-title">Notes & Study Materials</div>
                        <div className="materials-list">
                            {selectedCourse.materials.map((mat, idx) => (
                                <div className="material-card" key={idx}>
                                    <span className="material-icon">
                                        {fileTypeIcon[mat.type] || fileTypeIcon.default}
                                    </span>
                                    <span className="material-title">{mat.title}</span>
                                    <button
                                        className="download-btn"
                                        onClick={() => window.open(mat.link, "_blank")}
                                    >
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
