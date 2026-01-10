import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="text-2xl font-bold text-black">APEX Auto Hub</div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <RouterLink
              to="/services"
              className="text-sm font-medium text-black hover:text-gray-600 transition"
            >
              Services
            </RouterLink>
            <RouterLink
              to="/pricing"
              className="text-sm font-medium text-black hover:text-gray-600 transition"
            >
              Pricing
            </RouterLink>
            <RouterLink
              to="/contact"
              className="text-sm font-medium text-black hover:text-gray-600 transition"
            >
              Contact
            </RouterLink>

            {/* Book Now Button */}
            <button className="px-4 py-3 bg-lime-300 hover:bg-lime-400 text-black text-xs font-medium rounded transition">
              Book Now
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
