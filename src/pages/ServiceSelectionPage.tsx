import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Assuming Union is an SVG/image file in your assets
import Union from '../Assets/Union.svg';

interface VehicleData {
  vin: string;
  make: string;
  model: string;
  trim: string;
  year: string;
}

const ServiceSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, imageBase64 } = (location.state as { vehicle: VehicleData; imageBase64: string }) || { vehicle: null, imageBase64: null };

  const [activeCategory, setActiveCategory] = useState('Maintenance');
  const [activeTab, setActiveTab] = useState('Maintenance');

  const packages = [
    { name: 'Bronze', price: '119.95', features: ['Service 1', 'Service 2', 'Service 3'] },
    { name: 'Silver', price: '159.95', features: ['All the Service Bronze features', 'Service 4', 'Service 5'], popular: true },
    { name: 'Gold', price: '319.95', features: ['All the Service Silver features', 'Service 6', 'Service 7'] },
  ];

  const services = [
    { title: 'Full Check-Up', price: '50.00', desc: 'A comprehensive car service check-up includes a thorough inspection of all essential components. This typically covers the engine, brakes, tires, and fluid levels, ensuring everything is in optimal condition. Regular check-ups help maintain vehicle performance and safety.' },
    { title: 'Oil Service', price: '50.00', desc: 'Get your car running smoothly with our comprehensive oil service. We check and replace your engine oil, ensuring optimal performance and longevity. Trust us to keep your vehicle in top shape!' },
    { title: 'Tire Rotation', price: '50.00', desc: 'Get your car running smoothly with our comprehensive oil service. We check and replace your engine oil, ensuring optimal performance and longevity. Trust us to keep your vehicle in top shape!' },
    { title: 'Changing Tire', price: '50.00', desc: 'Get your car running smoothly with our comprehensive oil service. We check and replace your engine oil, ensuring optimal performance and longevity. Trust us to keep your vehicle in top shape!' },
    { title: 'Coolant Service', price: '50.00', desc: 'Get your car running smoothly with our comprehensive oil service. We check and replace your engine oil, ensuring optimal performance and longevity. Trust us to keep your vehicle in top shape!' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      {/* Hero / Header Section */}
      <div className="bg-[#5C7130] p-4 md:p-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          {/* Car Card */}
          <div className="flex-1 bg-white rounded-xl p-4 flex items-center shadow-sm">
            <div className="w-24 md:w-32 mr-4">
               <img src={imageBase64 || 'https://placehold.co/200x120?text=Vehicle'} alt={`${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`} className="w-full h-auto" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-lg md:text-xl">{vehicle?.year} {vehicle?.make} {vehicle?.model}</h1>
              <p className="text-gray-500 text-sm">{vehicle?.trim || 'Unknown'}</p>
            </div>
            <button onClick={() => navigate('/select-vehicle')} className="text-xs font-medium border-b border-black pb-0.5 ml-auto">← Edit</button>
          </div>

          {/* Cart Card */}
          <div className="w-full md:w-64 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-base">Your Cart</h2>
            <p className="text-gray-400 text-sm">Empty</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Toggle Switch */}
        <div className="inline-flex bg-gray-200 p-1 rounded-lg mb-10">
          {['Maintenance', 'Detailing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === cat ? 'bg-[#D4F49B] shadow-sm' : 'text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Packages Section */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col ${pkg.popular ? 'ring-2 ring-[#D4F49B]' : ''}`}>
                <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Unlock premium benefits with our {pkg.name} level package! Enjoy exclusive access to top-tier services and features designed just for you.
                </p>
                <div className="text-4xl font-extrabold mb-8">${pkg.price}</div>
                <div className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium">
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5.5L4.5 9L13 1" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {feat}
                    </div>
                  ))}
                </div>
                <button className={`w-full py-3 rounded-xl font-bold border transition-colors ${
                  pkg.popular ? 'bg-[#D4F49B] border-[#D4F49B]' : 'bg-white border-gray-200'
                }`}>
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* All Services Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">All Services</h2>

          <div className="bg-[#5C7130] rounded-t-2xl overflow-hidden">
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 md:max-w-md">
                <input
                  type="text"
                  placeholder="Search for a specific service"
                  className="w-full bg-[#4E5E28] border-none text-white text-sm py-2.5 pl-4 pr-10 rounded-md placeholder:text-gray-300 focus:ring-1 focus:ring-lime-200"
                />
                <svg className="absolute right-3 top-3 text-gray-300" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {['Maintenance', 'Inspection/Diagnosis', 'Performance', 'Modification'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab ? 'bg-[#D4F49B] text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#E5E7EB] rounded-b-2xl divide-y divide-gray-300">
            {services.map((s, i) => (
              <div key={i} className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-4">
                <div className="md:max-w-3xl">
                  <h4 className="font-bold text-lg mb-2">{s.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
                <div className="font-bold text-lg md:text-xl">${s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 px-6 md:px-16 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <img src={Union} alt="APEX logo" className="h-5 w-5" />
              <div className="font-semibold text-black text-sm uppercase tracking-wider">APEX Auto Hub</div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#/features" onClick={(e) => e.preventDefault()} className="text-[10px] md:text-xs text-gray-600 hover:text-black font-medium cursor-pointer">Features</a>
              <a href="#/learn" onClick={(e) => e.preventDefault()} className="text-[10px] md:text-xs text-gray-600 hover:text-black font-medium cursor-pointer">Learn More</a>
              <a href="#/support" onClick={(e) => e.preventDefault()} className="text-[10px] md:text-xs text-gray-600 hover:text-black font-medium cursor-pointer">Support</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="M16 11.5v5.5"></path><path d="M8 11.5v5.5"></path><path d="M12 7.5a2 2 0 0 1 2 2v2"></path></svg>
            </a>
            {/* Twitter/X */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.82 1.08A4.48 4.48 0 0 0 16.11 0c-2.63 0-4.73 2.59-4.07 5.08A12.94 12.94 0 0 1 1.64 1.15 4.48 4.48 0 0 0 2.9 7.86 4.41 4.41 0 0 1 .89 7v.06A4.48 4.48 0 0 0 4.48 11a4.52 4.52 0 0 1-2 .08 4.48 4.48 0 0 0 4.18 3.12A9 9 0 0 1 0 19.54a12.75 12.75 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84v-.58A9.18 9.18 0 0 0 23 3z"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceSelectionPage;