import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { callNodeHelloWorld } from './apiServer/api';
import LandingPage from './pages/LandingPage';
import BookingAppointment from './pages/BookingAppointment';
import VehiclePage from './pages/VehiclePage';
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
      <Routes>
        <Route path="/" element={<VehiclePage />} />
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/booking-appointment" element={<BookingAppointment />} /> */}
      </Routes>
    </div>
  )

}
export default App;
