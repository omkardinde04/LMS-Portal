import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Assignments from "../components/Dashboard/Assignments";
import Sidebar from "../components/Dashboard/Sidebar";
import '../components/Dashboard/css/Dashboard.css'
import Home from "../components/Dashboard/Home";
import Course from "../components/Dashboard/Course";
import VirtualMeet from "../components/Dashboard/Meet/VirtualMeet";

function Dashboard() {
    return (
        <>

            <div className="app-container">

                <Sidebar />

                <main className="main-content">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/courses" element={<Course />} />
                        <Route path="/meet" element={<VirtualMeet/>} />
                    </Routes>
                </main>
            </div>



        </>
    );
}

export default Dashboard;