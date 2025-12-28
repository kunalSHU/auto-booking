import React, { useState } from "react";
import vehicleImage from '../Assets/vehicle_image.png';
import Union from '../Assets/Union.svg';

const VehiclePage: React.FC = () => {
    const [vehicleData, setVehicleData] = useState({
        vin: "",
        make: "",
        model: "",
        trim: "",
        year: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setVehicleData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            {/* Header */}
            <header className="bg-white px-16 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src={Union} alt="APEX logo" className="h-8 w-8" />
                    <div className="text-xl font-semibold text-black">
                        APEX Auto Hub
                    </div>
                </div>
                <nav className="flex items-center gap-6">
                    <span className="text-xs font-medium text-black">
                        Services
                    </span>
                    <span className="text-xs font-medium text-black">
                        Pricing
                    </span>
                    <span className="text-xs font-medium text-black">
                        Contact
                    </span>
                    <button className="px-3 py-3 bg-lime-300 text-black text-xs font-normal rounded-sm hover:bg-lime-400">
                        Book Now
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <div
                style={{
                    background: 'var(--Dynamic-Background, linear-gradient(0deg, rgba(57, 69, 8, 0.50) 0%, rgba(57, 69, 8, 0.50) 100%)) lightgray 50% / cover no-repeat'
                }}
                className="flex-1 flex flex-col items-center justify-start pt-12 px-8"
            >
                {/* Title */}
                <h1 className="text-5xl font-bold text-white text-center mb-12">
                    Tell us about your vehicle
                </h1>

                {/* Form */}
                <div className="bg-white rounded-3xl p-8 w-full max-w-5xl mb-20">
                    <div className="flex gap-4 flex-wrap items-end justify-center">
                        <input
                            type="text"
                            placeholder="VIN Number (Optional)"
                            value={vehicleData.vin}
                            onChange={(e) => handleInputChange("vin", e.target.value)}
                            className="w-38 h-9 px-2 py-3 border-b border-gray-300 text-sm focus:outline-none bg-white flex-shrink-0"
                        />
                        <select
                            value={vehicleData.make}
                            onChange={(e) => handleInputChange("make", e.target.value)}
                            className="px-4 py-3 border-b border-gray-300 text-sm focus:outline-none bg-transparent min-w-max cursor-pointer flex-shrink-0"
                        >
                            <option value="">Select Make</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="Chevrolet">Chevrolet</option>
                        </select>
                        <select
                            value={vehicleData.model}
                            onChange={(e) => handleInputChange("model", e.target.value)}
                            className="px-4 py-3 border-b border-gray-300 text-sm focus:outline-none bg-transparent min-w-max cursor-pointer flex-shrink-0"
                        >
                            <option value="">Select Model</option>
                            <option value="Model A">Model A</option>
                            <option value="Model B">Model B</option>
                        </select>
                        <select
                            value={vehicleData.trim}
                            onChange={(e) => handleInputChange("trim", e.target.value)}
                            className="px-4 py-3 border-b border-gray-300 text-sm focus:outline-none bg-transparent min-w-max cursor-pointer flex-shrink-0"
                        >
                            <option value="">Select Trim</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                        </select>
                        <select
                            value={vehicleData.year}
                            onChange={(e) => handleInputChange("year", e.target.value)}
                            className="px-4 py-3 border-b border-gray-300 text-sm focus:outline-none bg-transparent min-w-max cursor-pointer flex-shrink-0"
                        >
                            <option value="">Select Year</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                        <button className="px-6 py-2 bg-lime-300 text-black font-semibold text-sm rounded hover:bg-lime-800 whitespace-nowrap flex-shrink-0">
                            Select Your Service
                        </button>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="flex justify-center" style={{ marginTop: 'auto' }}>
                    <img
                        src={vehicleImage}
                        alt="Vehicle"
                        style={{
                            width: '1050px',
                            // height: '682.158px',
                            // flexShrink: 0,
                            // aspectRatio: '1050 / 682.16',
                            // borderRadius: '32px',
                            // border: '8px solid #FFF',
                            // backgroundSize: 'cover',
                            // backgroundPosition: '70%',
                            // boxShadow: '0 0 4.4px 0 rgba(0, 0, 0, 0.06), 0 5px 19px 0 rgba(0, 0, 0, 0.08)',
                            // objectFit: 'cover'
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-300 px-16 py-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-8">
                        <img src={Union} alt="APEX logo" className="h-6 w-6" />
                        <div className="font-semibold text-black text-sm">
                            APEX Auto Hub
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-xs text-gray-600 hover:text-black">Features</a>
                            <a href="#" className="text-xs text-gray-600 hover:text-black">Learn More</a>
                            <a href="#" className="text-xs text-gray-600 hover:text-black">Support</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                                <path d="M16 11.5v5.5"></path>
                                <path d="M8 11.5v5.5"></path>
                                <path d="M12 7.5a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="X (Twitter)" className="text-gray-600 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.82 1.08A4.48 4.48 0 0 0 16.11 0c-2.63 0-4.73 2.59-4.07 5.08A12.94 12.94 0 0 1 1.64 1.15 4.48 4.48 0 0 0 2.9 7.86 4.41 4.41 0 0 1 .89 7v.06A4.48 4.48 0 0 0 4.48 11a4.52 4.52 0 0 1-2 .08 4.48 4.48 0 0 0 4.18 3.12A9 9 0 0 1 0 19.54a12.75 12.75 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84v-.58A9.18 9.18 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VehiclePage;
