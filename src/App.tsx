import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { callNodeHelloWorld } from './apiServer/api';
import LandingPage from './pages/LandingPage';
import BookingAppointment from './pages/BookingAppointment';

const App: React.FC = () => {

  const [nodeResponse, setNodeResponse] = useState<string>();

  useEffect(() => {
    testApiCall();
  },[]);
  
  const testApiCall = async () => {
    let response = await callNodeHelloWorld();
    setNodeResponse(response?.data.message);
  }
  
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking-appointment" element={<BookingAppointment />} />
        </Routes>
      </Router>
    </div>
  )
  
}
export default App;
