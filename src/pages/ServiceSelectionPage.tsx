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
  const [searchTerm, setSearchTerm] = useState('');
  const [estimatingIndex, setEstimatingIndex] = useState<number | null>(null);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [estimates, setEstimates] = useState<{ [key: number]: { value: string; source: 'ai' | 'database' } }>({});
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    { name: 'Bronze', price: '119.95', features: ['Service 1', 'Service 2', 'Service 3'] },
    { name: 'Silver', price: '159.95', features: ['All the Service Bronze features', 'Service 4', 'Service 5'], popular: true },
    { name: 'Gold', price: '319.95', features: ['All the Service Silver features', 'Service 6', 'Service 7'] },
  ];

  const servicesData = {
    Maintenance: {
      'Maintenance': [
        { title: 'Oil & Filter Change', price: '49.99', desc: 'Complete oil and filter replacement with synthetic or conventional oil. Includes fluid level checks and disposal of old oil.' },
        { title: 'Tire Rotation', price: '39.99', desc: 'Professional tire rotation to ensure even wear and extend tire lifespan. Includes balancing and pressure adjustment.' },
        { title: 'Fluid Top-up', price: '29.99', desc: 'Top up essential fluids including coolant, brake fluid, power steering, and windshield washer fluid.' },
        { title: 'Battery Check & Service', price: '34.99', desc: 'Battery health diagnostics, terminal cleaning, and charging. Includes inspection for corrosion and secure connections.' },
        { title: 'Air Filter Replacement', price: '24.99', desc: 'Engine air filter and cabin air filter replacement for improved air flow and cabin quality.' },
      ],
      'Inspection/Diagnosis': [
        { title: 'Computer Diagnostic Scan', price: '79.99', desc: 'Full vehicle diagnostic scan to identify any error codes or performance issues. Includes detailed report.' },
        { title: 'Brake Inspection', price: '54.99', desc: 'Comprehensive brake system inspection including pads, rotors, calipers, and fluid condition.' },
        { title: 'Engine Inspection', price: '89.99', desc: 'Complete engine system inspection covering spark plugs, belts, hoses, and fluid levels.' },
        { title: 'Transmission Check', price: '99.99', desc: 'Transmission fluid analysis and system inspection for smooth shifting and proper operation.' },
        { title: 'Suspension Inspection', price: '74.99', desc: 'Thorough suspension system check including shocks, struts, springs, and alignment assessment.' },
      ],
      'Performance': [
        { title: 'Engine Performance Tuning', price: '149.99', desc: 'Engine optimization for improved horsepower, torque, and fuel efficiency. Includes ECU tuning.' },
        { title: 'Suspension Upgrade', price: '299.99', desc: 'Upgrade to performance suspension components for better handling and ride quality.' },
        { title: 'Brake System Upgrade', price: '249.99', desc: 'Upgrade to high-performance brake pads and rotors for improved stopping power.' },
        { title: 'Exhaust System Upgrade', price: '399.99', desc: 'Custom performance exhaust system for increased power and improved sound.' },
        { title: 'Fuel System Cleaning', price: '89.99', desc: 'Professional fuel injector and intake valve cleaning for optimal fuel economy and performance.' },
      ],
      'Modification': [
        { title: 'Custom Wheels Installation', price: '199.99', desc: 'Professional installation of custom wheels including tire mounting and balancing.' },
        { title: 'Body Kit Installation', price: '449.99', desc: 'Installation of custom body kit including front/rear bumpers, side skirts, and wings.' },
        { title: 'Window Tint Application', price: '149.99', desc: 'Professional UV-protective window tinting for style and vehicle interior protection.' },
        { title: 'Custom Paint Service', price: '349.99', desc: 'Professional custom paint job with color matching and protective clear coat.' },
        { title: 'Interior Customization', price: '299.99', desc: 'Upgrade interior with custom seats, steering wheel, dashboard, and accent lighting.' },
      ],
    },
    Detailing: {
      'Maintenance': [
        { title: 'Basic Wash & Dry', price: '29.99', desc: 'Professional hand wash with quality soap and protective drying to prevent water spots.' },
        { title: 'Undercarriage Wash', price: '39.99', desc: 'Deep clean of undercarriage to remove salt, dirt, and debris from hard-to-reach areas.' },
        { title: 'Carpet & Mat Cleaning', price: '54.99', desc: 'Professional interior carpet and floor mat cleaning using eco-friendly solutions.' },
        { title: 'Seat Conditioning', price: '44.99', desc: 'Deep cleaning and conditioning of leather or fabric seats to restore appearance and protection.' },
      ],
      'Inspection/Diagnosis': [
        { title: 'Paint Condition Assessment', price: '49.99', desc: 'Professional paint depth measurement and condition analysis to identify damage or wear.' },
        { title: 'Interior Inspection', price: '44.99', desc: 'Thorough assessment of interior condition including upholstery, trim, and dashboard.' },
        { title: 'Protective Coating Inspection', price: '39.99', desc: 'Evaluation of existing sealants and protective coatings to determine reapplication needs.' },
      ],
      'Performance': [
        { title: 'Premium Wax & Polish', price: '89.99', desc: 'Multi-stage polishing with premium carnauba or ceramic wax for exceptional shine and protection.' },
        { title: 'Clay Bar Treatment', price: '69.99', desc: 'Removes embedded contaminants from paint surface for ultra-smooth finish before waxing.' },
        { title: 'Headlight Restoration', price: '79.99', desc: 'Professional headlight polishing to remove oxidation and restore clarity and brightness.' },
      ],
      'Modification': [
        { title: 'Custom Vinyl Wrap', price: '299.99', desc: 'Professional application of custom vinyl wrap for unique exterior design and protection.' },
        { title: 'LED Light Upgrade', price: '149.99', desc: 'Installation of LED lighting upgrades for modern look and improved visibility.' },
        { title: 'Interior LED Ambient Lighting', price: '199.99', desc: 'Custom LED accent lighting installation throughout interior for personalized ambiance.' },
      ],
    },
  };

  const allCategoryServices = servicesData[activeCategory as keyof typeof servicesData] || {};
  const currentServices = allCategoryServices[activeTab as keyof typeof allCategoryServices] || [];

  // Get all services from all tabs in the current category for searching
  const allServicesInCategory = Object.values(allCategoryServices).flat();

  const filteredServices = (searchTerm ? allServicesInCategory : currentServices).filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetEstimate = async (index: number, service: any) => {
    if (!vehicle) return;

    setEstimatingIndex(index);
    try {
      const response = await fetch('/api/services/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle: {
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            trim: vehicle.trim,
          },
          serviceTitle: service.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get estimate');
      }

      const data = await response.json();
      setVehicleId(data.vehicleId); // Store the vehicle ID from the response
      setEstimates(prev => ({
        ...prev,
        [index]: {
          value: data.estimate,
          source: data.source || 'ai'
        }
      }));
    } catch (error) {
      console.error('Error getting estimate:', error);
      setEstimates(prev => ({
        ...prev,
        [index]: {
          value: 'Error loading estimate',
          source: 'ai'
        }
      }));
    } finally {
      setEstimatingIndex(null);
    }
  };

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
              <p className="text-gray-500 text-sm">{vehicle?.trim || ''}</p>
              {vehicleId && (
                <p className="text-xs text-green-600 font-medium mt-2">✓ Vehicle ID: {vehicleId}</p>
              )}
            </div>
            <button onClick={() => navigate('/select-vehicle')} className="text-xs font-medium border-b border-black pb-0.5 ml-auto">← Edit</button>
          </div>

          {/* Cart Card */}
          <div className="w-full md:w-64 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-base">Your Cart</h2>
            {selectedPackage ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">{selectedPackage}</p>
                <p className="text-xs text-gray-500">
                  ${packages.find(p => p.name === selectedPackage)?.price}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Empty</p>
            )}
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
              <div key={pkg.name} className={`bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col transition-all ${pkg.popular ? 'ring-2 ring-[#D4F49B]' : ''} ${selectedPackage === pkg.name ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
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
                <button
                  onClick={() => setSelectedPackage(selectedPackage === pkg.name ? null : pkg.name)}
                  className={`w-full py-3 rounded-xl font-bold border transition-colors ${
                    selectedPackage === pkg.name
                      ? 'bg-blue-500 text-white border-blue-500'
                      : pkg.popular
                      ? 'bg-[#D4F49B] border-[#D4F49B] hover:bg-lime-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                  {selectedPackage === pkg.name ? 'Remove Package' : 'Select Package'}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredServices.length > 0 ? (
              filteredServices.map((s, i) => (
                <div key={i} className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-4">
                  <div className="md:max-w-3xl">
                    <h4 className="font-bold text-lg mb-2">{s.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {i === 0 ? (
                      <div className="flex flex-col items-end gap-2">
                        {estimates[i] ? (
                          <div className="flex flex-col items-end gap-1">
                            <div className="font-bold text-lg md:text-xl text-green-600">{estimates[i].value}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              estimates[i].source === 'database'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {estimates[i].source === 'database' ? '🔄 Cached' : '🤖 AI Estimate'}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGetEstimate(i, s)}
                            disabled={estimatingIndex !== null}
                            className="px-4 py-2 bg-[#D4F49B] text-black font-semibold text-sm rounded hover:bg-lime-400 transition-colors disabled:opacity-50"
                          >
                            {estimatingIndex === i ? 'Loading...' : 'Get Estimate'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="font-bold text-lg md:text-xl">${s.price}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 md:p-8 text-center text-gray-600">
                <p>No services found matching your search.</p>
              </div>
            )}
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