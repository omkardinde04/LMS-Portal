import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FaBook, FaCalendarAlt, FaClipboardList, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./css/FacultySidebar.css";

// changed: rename component so it is generic and reusable
export default function DashboardSidebar() {
    const navigate = useNavigate();
    return (
        <aside className="dashboard-sidebar" aria-label="Main navigation">
            <div className="dashboard-sidebar-top">
                <div className="logo" title="Learnify">
                    <div className="logo-mark">L</div>
                    <span className="logo-text">Learnify</span>
                </div>
            </div>

            <nav className="dashboard-sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <AiOutlineHome className="icon" />
                    <span className="label">Home</span>
                </NavLink>

                <NavLink to="#" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <FaBook className="icon" />
                    <span className="label">Courses</span>
                </NavLink>

                <NavLink to="#" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <FaCalendarAlt className="icon" />
                    <span className="label">Calendar</span>
                </NavLink>

                <NavLink to="#" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <FaClipboardList className="icon" />
                    <span className="label">Assignments</span>
                    <span className="badge">3</span>
                </NavLink>

                <NavLink to="#" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <FaUsers className="icon" />
                    <span className="label">Students</span>
                </NavLink>
            </nav>

            <div className="dashboard-sidebar-bottom">
                <NavLink to="/settings" className="nav-link">
                    <FaCog className="icon" />
                    <span className="label">Settings</span>
                </NavLink>

                <button className="signout" onClick={() => navigate('/')}>
                    <FaSignOutAlt className="icon" />
                    <span className="label">Sign out</span>
                </button>
            </div>
        </aside>
    );
}
