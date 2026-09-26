import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BookingAppointment from './pages/BookingAppointment';
import VehiclePage from './pages/VehiclePage';
import ServiceSelection from './pages/ServiceSelectionPage';
import { CartProvider } from './context/CartContext';
import CartSidebar from './Components/CartSidebar';
import AppointmentSummary from './pages/bookingappointment/appointmentSummary';

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Routes>
        <Route path="/" element={<VehiclePage onCartClick={() => setIsCartOpen(true)} />} />
        <Route path="/select-services" element={<ServiceSelection onCartClick={() => setIsCartOpen(true)} />} />
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/booking-appointment" element={<BookingAppointment />} />
        {/* <Route path="/manage-appointment" element={<AppointmentSummary />} /> */}
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
