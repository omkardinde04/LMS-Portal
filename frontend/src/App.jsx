import React from 'react';
import './App.css';
import {Routes , Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage';
import LoginPage from './pages/Loginpage';
import Dashboard from './pages/Dashboard';
import Facultydashboard from './pages/Facultydashboard';
import UploadAssignment from './components/Plagerism/UploadAssignment';
import ViewReport from './components/Plagerism/ViewReport';



function App() {
  return (

    <>
    <Routes>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/*' element={<Dashboard/>}/>
      <Route path='/faculty-dashboard' element={<Facultydashboard />} />
      <Route path="/upload-assignment" element={<UploadAssignment />} />
      <Route path="/report/:id" element={<ViewReport />} />
    </Routes>
      
    
    </>
    
  );
}

export default App;