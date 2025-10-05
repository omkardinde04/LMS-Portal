import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FaBook, FaCalendarAlt, FaClipboardList, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./css/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();  
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-top">
        <div className="logo" title="Learnify">
          <div className="logo-mark">L</div>
          <span className="logo-text">Learnify</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <AiOutlineHome className="icon" />
          <span className="label">Home</span>
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaBook className="icon" />
          <span className="label">Courses</span>
        </NavLink>

        <NavLink to="/calendar" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaCalendarAlt className="icon" />
          <span className="label">Calendar</span>
        </NavLink>

        <NavLink to="/assignments" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaClipboardList className="icon" />
          <span className="label">Assignments</span>
          <span className="badge">3</span>
        </NavLink>

        <NavLink to="/students" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaUsers className="icon" />
          <span className="label">Students</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
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
