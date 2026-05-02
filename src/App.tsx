import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { callNodeHelloWorld } from './apiServer/api';
import LandingPage from './pages/LandingPage';
import BookingAppointment from './pages/BookingAppointment';
import VehiclePage from './pages/VehiclePage';
import ServiceSelection from './pages/ServiceSelectionPage';
import { CartProvider } from './context/CartContext';
import CartSidebar from './Components/CartSidebar';

const AppContent: React.FC = () => {
  const [nodeResponse, setNodeResponse] = useState<string>();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    testApiCall();
  },[]);

  const testApiCall = async () => {
    let response = await callNodeHelloWorld();
    setNodeResponse(response?.data.message);
  }

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Routes>
        <Route path="/select-vehicle" element={<VehiclePage onCartClick={() => setIsCartOpen(true)} />} />
        <Route path="/" element={<ServiceSelection onCartClick={() => setIsCartOpen(true)} />} />
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/booking-appointment" element={<BookingAppointment />} /> */}
      </Routes>
    </>
  )
}

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className='App'>
        <AppContent />
      </div>
    </CartProvider>
  )
}

export default App;
