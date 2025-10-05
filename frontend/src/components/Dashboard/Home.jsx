import React, { useState, useMemo } from "react";
import "./css/Home.css";

// === Calendar helper functions ===
function getMonthDays(year, month) {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    return days;
}
function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
function formatDateFull(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// === Dummy Calendar Events ===
const calendarEvents = [
    { date: "2025-10-06", title: "OST – Computer Networks", type: "upcoming" },
    { date: "2025-10-07", title: "Submit CN Lab File", type: "due" },
    { date: "2025-10-09", title: "Assignment: OS Lab Report", type: "upcoming" },
    { date: "2025-10-10", title: "DBMS Mini Project Demo", type: "completed" },
    { date: "2025-10-11", title: "Holiday: Ganesh Chaturthi", type: "upcoming" },
    { date: "2025-10-14", title: "Mid-Term Evaluation", type: "due" },
    { date: "2025-10-20", title: "Mini Project Submission", type: "upcoming" },
    { date: "2025-10-28", title: "Internal Assessment 2", type: "upcoming" },
    { date: "2025-10-31", title: "Halloween Celebration 🎃", type: "holiday" },
];


// === Activity Heatmap ===
const today = new Date("2025-10-07");
function getPastYearDays() {
    const arr = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        arr.push(d);
    }
    return arr;
}
const yearlyActivity = getPastYearDays().map((date, i) => {
    let completed = 0;
    if (i > 350) completed = 3;
    else if (i > 320) completed = 2;
    else if (i % 7 === 0) completed = 1;
    else completed = 0;
    return {
        date: date.toISOString().slice(0, 10),
        completed,
    };
});

// === Announcements ===
const initialAnnouncements = [
    {
        id: 1,
        faculty: "Prof. Mansi Kambli",
        date: "2025-10-05T09:00",
        text: "Holiday declared on Monday 🏖️",
    },
    {
        id: 2,
        faculty: "Prof. Bhakti Palkar",
        date: "2025-10-04T14:30",
        text: "Upload your CN lab file before Friday!",
    },
    {
        id: 3,
        faculty: "Prof. Nirmala Baloorkar",
        date: "2025-10-03T11:00",
        text: "OST Test for DBMS will be held on 10th Oct.",
    },
];

// === Grades Data ===
const gradesData = [
    { course: "Computer Networks", lab: 40, theory: 38 },
    { course: "Software Engineering", lab: 45, theory: 42 },
    { course: "Operating Systems", lab: 35, theory: 30 },
    { course: "DBMS", lab: 25, theory: 20 },
];
function getGradeStatus(avg) {
    if (avg >= 80)
        return { color: "#4caf50", emoji: "🟢", label: "Excellent" };
    if (avg >= 50)
        return { color: "#ffc107", emoji: "🟡", label: "Average" };
    return { color: "#ff5252", emoji: "🔴", label: "Needs Improvement" };
}

// === MAIN COMPONENT ===
export default function Home() {
    const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
    const [calendarYear, setCalendarYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [showMore, setShowMore] = useState({});

    const monthDays = useMemo(
        () => getMonthDays(calendarYear, calendarMonth),
        [calendarMonth, calendarYear]
    );
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

    const eventsForDate = (date) =>
        calendarEvents.filter((ev) => isSameDay(new Date(ev.date), date));

    const prevMonth = () => {
        if (calendarMonth === 0) {
            setCalendarMonth(11);
            setCalendarYear((y) => y - 1);
        } else setCalendarMonth((m) => m - 1);
        setSelectedDate(null);
    };
    const nextMonth = () => {
        if (calendarMonth === 11) {
            setCalendarMonth(0);
            setCalendarYear((y) => y + 1);
        } else setCalendarMonth((m) => m + 1);
        setSelectedDate(null);
    };

    const dismissAnnouncement = (id) =>
        setAnnouncements((anns) => anns.filter((a) => a.id !== id));

    const getHeatmapColor = (val) => {
        if (val >= 3) return "#b28704";
        if (val === 2) return "#ffc107";
        if (val === 1) return "#ffe082";
        return "#e0e0e0";
    };

    return (
        <div className="home-container">
            {/* === Top Greeting === */}
            <div className="home-topbar">
                <h1 className="home-greeting">Welcome Back, <span>User</span> 👋</h1>
                <div className="home-searchbar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            {/* === Dashboard Cards === */}
            <div className="home-cards-row">
                <div className="home-stat-card">
                    <div className="stat-card-icon">📘</div>
                    <div className="stat-card-info">
                        <div className="stat-card-label">Enrolled Courses</div>
                        <div className="stat-card-value">06</div>
                    </div>
                </div>
                <div className="home-stat-card">
                    <div className="stat-card-icon">📊</div>
                    <div className="stat-card-info">
                        <div className="stat-card-label">Attendance</div>
                        <div className="stat-card-value">92%</div>
                    </div>
                </div>
                <div className="home-stat-card">
                    <div className="stat-card-icon">🧠</div>
                    <div className="stat-card-info">
                        <div className="stat-card-label">Performance Overview</div>
                        <div className="stat-card-value">84%</div>
                    </div>
                </div>
            </div>

            {/* === Calendar Section === */}
            <section className="home-section home-card">
                <div className="home-section-title-row">
                    <h2 className="home-section-title">Upcoming Activities Calendar</h2>
                    <div className="calendar-nav">
                        <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
                        <span className="calendar-nav-label">
                            {new Date(calendarYear, calendarMonth).toLocaleString(undefined, {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-grid-header">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="calendar-grid-cell calendar-grid-header-cell">{d}</div>
                        ))}
                    </div>
                    <div className="calendar-grid-body">
                        {[...Array(firstDayOfWeek)].map((_, i) => (
                            <div key={"empty" + i} className="calendar-grid-cell calendar-grid-empty" />
                        ))}
                        {monthDays.map((date) => {
                            const events = eventsForDate(date);
                            const isToday = isSameDay(date, today);
                            return (
                                <div
                                    key={date.toISOString()}
                                    className={
                                        "calendar-grid-cell calendar-grid-day" +
                                        (isToday ? " calendar-today" : "") +
                                        (selectedDate && isSameDay(date, selectedDate)
                                            ? " calendar-selected"
                                            : "")
                                    }
                                    onMouseEnter={() => setSelectedDate(date)}
                                    onMouseLeave={() => setSelectedDate(null)}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <span>{date.getDate()}</span>
                                    <div className="calendar-event-dots">
                                        {events.map((ev, i) => (
                                            <span
                                                key={i}
                                                className={`calendar-event-dot calendar-event-dot-${ev.type}`}
                                                title={ev.title}
                                            />
                                        ))}
                                    </div>
                                    {selectedDate && isSameDay(date, selectedDate) && events.length > 0 && (
                                        <div className="calendar-tooltip">
                                            <div className="calendar-tooltip-date">{formatDateFull(date)}</div>
                                            {events.map((ev, i) => (
                                                <div key={i} className="calendar-tooltip-event">
                                                    <span className={`calendar-tooltip-dot calendar-event-dot-${ev.type}`} />
                                                    <span>{ev.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* === Activity Tracker === */}
            <section className="home-section home-card">
                <h2 className="home-section-title">Submission Activity Tracker</h2>
                <div className="heatmap-grid">
                    {yearlyActivity.map((d) => (
                        <div
                            key={d.date}
                            className="heatmap-cell"
                            style={{ background: getHeatmapColor(d.completed) }}
                            title={
                                d.completed > 0
                                    ? `${d.completed} Assignments Submitted on ${formatDateFull(d.date)}`
                                    : `No activity on ${formatDateFull(d.date)}`
                            }
                        />
                    ))}
                </div>
                <div className="heatmap-legend">
                    <span className="legend-label">No activity</span>
                    <span className="legend-box" style={{ background: "#e0e0e0" }} />
                    <span className="legend-box" style={{ background: "#ffe082" }} />
                    <span className="legend-box" style={{ background: "#ffc107" }} />
                    <span className="legend-box" style={{ background: "#b28704" }} />
                    <span className="legend-label">High</span>
                </div>
            </section>

            {/* === Announcements === */}
            <section className="home-section home-card">
                <h2 className="home-section-title">Announcements from Faculty</h2>
                <div className="announcements-list">
                    {announcements.map((a) => (
                        <div key={a.id} className="announcement-card">
                            <div className="announcement-header">
                                <span className="announcement-faculty">{a.faculty}</span>
                                <span className="announcement-date">{formatDateFull(a.date)}</span>
                                <span className="announcement-dismiss" onClick={() => dismissAnnouncement(a.id)}>✕</span>
                            </div>
                            <div className="announcement-text">
                                {a.text.length > 60 && !showMore[a.id]
                                    ? (
                                        <>
                                            {a.text.slice(0, 60)}...
                                            <span className="announcement-showmore" onClick={() => setShowMore(s => ({ ...s, [a.id]: true }))}>Show More</span>
                                        </>
                                    )
                                    : a.text}
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="announcement-empty">No announcements.</div>
                    )}
                </div>
            </section>

            {/* === Grades Overview === */}
            <section className="home-section home-card">
                <h2 className="home-section-title">Grades Overview</h2>
                <div className="grades-table-card">
                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Lab CA (50)</th>
                                <th>Theory CA (50)</th>
                                <th>Average (%)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesData.map((g) => {
                                const avg = Math.round(((g.lab + g.theory) / 100) * 100);
                                const status = getGradeStatus(avg);
                                return (
                                    <tr key={g.course}>
                                        <td>{g.course}</td>
                                        <td>{g.lab}</td>
                                        <td>{g.theory}</td>
                                        <td>
                                            <div className="grades-progress-cell">
                                                <span>{avg}%</span>
                                                <span className="grades-progress-bar-bg">
                                                    <span
                                                        className="grades-progress-bar"
                                                        style={{
                                                            width: `${avg}%`,
                                                            background: status.color,
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="grades-status-tag" style={{ background: status.color }}>
                                                {status.emoji} {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
