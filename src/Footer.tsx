import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-start">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-black">APEX Auto Hub</h3>
            </div>
            <div className="flex items-start gap-8">
              <RouterLink
                to="/features"
                className="text-base font-medium text-gray-500 hover:text-black transition"
              >
                Features
              </RouterLink>
              <RouterLink
                to="/learn"
                className="text-base font-medium text-gray-500 hover:text-black transition"
              >
                Learn more
              </RouterLink>
              <RouterLink
                to="/support"
                className="text-base font-medium text-gray-500 hover:text-black transition"
              >
                Support
              </RouterLink>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a
              href="#facebook"
              className="w-6 h-6 bg-gray-500 rounded hover:bg-gray-700 transition"
              aria-label="Facebook"
            />
            <a
              href="#twitter"
              className="w-6 h-6 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
              aria-label="Twitter"
            />
            <a
              href="#instagram"
              className="w-6 h-6 bg-gray-500 rounded hover:bg-gray-700 transition"
              aria-label="Instagram"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;