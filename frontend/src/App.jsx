import React from 'react';
import './App.css';
import {Routes , Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage';
import LoginPage from './pages/Loginpage';
import Dashboard from './pages/Dashboard';



function App() {
  return (

    <>
    <Routes>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/*' element={<Dashboard/>}/>
    </Routes>
      
    
    </>
    
  );
}

export default App;