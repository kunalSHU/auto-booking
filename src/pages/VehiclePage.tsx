import React, { useState, useEffect } from "react";
import vehicleImage from '../Assets/vehicle_image.png';
import Union from '../Assets/Union.svg';

interface VehicleOption {
    make: string;
    model: string | null;
    model_trim: string | null;
    model_year: number;
}

const VehiclePage: React.FC = () => {
    // State for Mobile Menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [vehicleData, setVehicleData] = useState({
        vin: "",
        make: "",
        model: "",
        trim: "",
        year: "",
    });

    const [showVinScanner, setShowVinScanner] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const streamRef = React.useRef<MediaStream | null>(null);

    const [makes, setMakes] = useState<VehicleOption[]>([]);
    const [models, setModels] = useState<VehicleOption[]>([]);
    const [trims, setTrims] = useState<VehicleOption[]>([]);

    const [loadingMakes, setLoadingMakes] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingTrims, setLoadingTrims] = useState(false);

    const startYear = 1990;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

    useEffect(() => {
        if (!vehicleData.year) {
            setMakes([]); setModels([]); setTrims([]);
            return;
        }
        const fetchMakes = async () => {
            setLoadingMakes(true);
            try {
                const response = await fetch(`/api/vehicle?year=${vehicleData.year}`);
                const data = await response.json();
                setMakes(data);
                setModels([]); setTrims([]);
                setVehicleData((prev) => ({ ...prev, make: "", model: "", trim: "" }));
            } catch (error) { console.error("Error fetching makes:", error); }
            finally { setLoadingMakes(false); }
        };
        fetchMakes();
    }, [vehicleData.year]);

    useEffect(() => {
        if (!vehicleData.year || !vehicleData.make) {
            setModels([]); setTrims([]);
            return;
        }
        const fetchModels = async () => {
            setLoadingModels(true);
            try {
                const response = await fetch(`/api/vehicle?year=${vehicleData.year}&make=${vehicleData.make}`);
                const data = await response.json();
                setModels(data);
                setTrims([]);
                setVehicleData((prev) => ({ ...prev, model: "", trim: "" }));
            } catch (error) { console.error("Error fetching models:", error); }
            finally { setLoadingModels(false); }
        };
        fetchModels();
    }, [vehicleData.year, vehicleData.make]);

    useEffect(() => {
        if (!vehicleData.year || !vehicleData.make || !vehicleData.model) {
            setTrims([]);
            return;
        }
        const fetchTrims = async () => {
            setLoadingTrims(true);
            try {
                const response = await fetch(`/api/vehicle?year=${vehicleData.year}&make=${vehicleData.make}&model=${vehicleData.model}`);
                const data = await response.json();
                setTrims(Array.isArray(data) ? data : [data]);
                setVehicleData((prev) => ({ ...prev, trim: "" }));
            } catch (error) { console.error("Error fetching trims:", error); }
            finally { setLoadingTrims(false); }
        };
        fetchTrims();
    }, [vehicleData.year, vehicleData.make, vehicleData.model]);

    const handleInputChange = (field: string, value: string) => {
        setVehicleData((prev) => ({ ...prev, [field]: value }));
    };

    const handleServiceSelection = async () => {
        try {
            const response = await fetch('/api/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });
            const result = await response.json();
            console.log('Vehicle submission response:', result);
        } catch (error) {
            console.error('Error submitting vehicle data:', error);
        }
    }

    const openVinScanner = async () => {
        setShowVinScanner(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
            setShowVinScanner(false);
        }
    };

    const closeVinScanner = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowVinScanner(false);
    };

    const captureAndDecode = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);

                setIsScanning(true);

                try {
                    // Convert canvas to base64 image
                    const imageBase64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

                    // Send to backend OCR endpoint
                    const response = await fetch('/api/vehicle/scan-vin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: imageBase64 }),
                    });

                    const result = await response.json();

                    console.log('OCR Result:', result);

                    if (result.success && result.vin) {
                        setVehicleData((prev) => ({ ...prev, vin: result.vin }));
                        closeVinScanner();
                    } else {
                        alert(result.error || 'No VIN detected. Please ensure the VIN text is clearly visible.');
                    }
                } catch (error) {
                    console.error('Scan Error:', error);
                    alert('Error scanning VIN. Please try again.');
                } finally {
                    setIsScanning(false);
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-200 overflow-x-hidden">
            {/* Mobile Drawer Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Side Drawer */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col gap-8">
                    <button onClick={() => setIsMenuOpen(false)} className="self-end p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <nav className="flex flex-col gap-6">
                        <span className="text-lg font-medium text-black cursor-pointer border-b pb-2">Services</span>
                        <span className="text-lg font-medium text-black cursor-pointer border-b pb-2">Pricing</span>
                        <span className="text-lg font-medium text-black cursor-pointer border-b pb-2">Contact</span>
                        <button className="w-full py-4 bg-lime-300 text-black font-bold rounded-sm hover:bg-lime-400">
                            Book Now
                        </button>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white px-6 md:px-16 py-4 md:py-6 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <img src={Union} alt="APEX logo" className="h-6 w-6 md:h-8 md:w-8" />
                    <div className="text-lg md:text-xl font-semibold text-black">APEX Auto Hub</div>
                </div>
                <nav className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-xs font-medium text-black cursor-pointer">Services</span>
                        <span className="text-xs font-medium text-black cursor-pointer">Pricing</span>
                        <span className="text-xs font-medium text-black cursor-pointer">Contact</span>
                    </div>
                    <button className="px-3 py-2 md:py-3 bg-lime-300 text-black text-[10px] md:text-xs font-normal rounded-sm hover:bg-lime-400">
                        Book Now
                    </button>
                    {/* Hamburger Button */}
                    <button
                        className="md:hidden flex flex-col gap-1 cursor-pointer p-1"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <div
                style={{ background: 'linear-gradient(0deg, rgba(57, 69, 8, 0.70) 0%, rgba(57, 69, 8, 0.70) 100%), #5a6b10' }}
                className="flex-1 flex flex-col items-center justify-start pt-10 md:pt-20 px-4 md:px-8"
            >
                {/* Responsive Title */}
                <h1 className="text-5xl md:text-5xl font-bold text-white text-center mb-8 md:mb-12 max-w-2xl leading-tight">
                    Tell us about your vehicle
                </h1>

                {/* Form - Optimized for Desktop (Single Row) and Mobile (Stacked) */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-[1100px] mb-12 md:mb-20 shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 items-center justify-between">
                        <div className="relative w-full lg:w-48">
                            <input
                                type="text"
                                placeholder="VIN Number (Optional)"
                                value={vehicleData.vin}
                                onChange={(e) => handleInputChange("vin", e.target.value)}
                                className="w-full h-10 border-b border-gray-300 text-sm focus:outline-none focus:border-lime-500 bg-white pr-10"
                            />
                            <button
                                onClick={openVinScanner}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                title="Scan VIN with camera"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                    <circle cx="12" cy="13" r="3"></circle>
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 xl:gap-6 w-full items-center">
                            <select
                                value={vehicleData.year}
                                onChange={(e) => handleInputChange("year", e.target.value)}
                                className="w-full lg:w-auto min-w-[120px] h-10 border-b border-gray-300 text-sm focus:outline-none bg-transparent cursor-pointer"
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => <option key={year} value={year}>{year}</option>)}
                            </select>

                            <select
                                value={vehicleData.make}
                                onChange={(e) => handleInputChange("make", e.target.value)}
                                disabled={makes.length === 0 || loadingMakes}
                                className="w-full lg:w-auto min-w-[140px] h-10 border-b border-gray-300 text-sm focus:outline-none bg-transparent cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{loadingMakes ? "Loading..." : "Select Make"}</option>
                                {makes.map((make) => <option value={make.make}>{make.make}</option>)}
                            </select>

                            <select
                                value={vehicleData.model}
                                onChange={(e) => handleInputChange("model", e.target.value)}
                                disabled={models.length === 0 || loadingModels}
                                className="w-full lg:w-auto min-w-[140px] h-10 border-b border-gray-300 text-sm focus:outline-none bg-transparent cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{loadingModels ? "Loading..." : "Select Model"}</option>
                                {models.map((model) => <option value={model.model ?? ""}>{model.model}</option>)}
                            </select>

                            <select
                                value={vehicleData.trim}
                                onChange={(e) => handleInputChange("trim", e.target.value)}
                                disabled={trims.length === 0 || loadingTrims}
                                className="w-full lg:w-auto min-w-[140px] h-10 border-b border-gray-300 text-sm focus:outline-none bg-transparent cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{loadingTrims ? "Loading..." : "Select Trim"}</option>
                                {trims.map((trim, index) => <option value={trim.model_trim ?? ""}>{trim.model_trim}</option>)}
                            </select>
                        </div>

                        <button onClick={handleServiceSelection} className="w-full lg:w-auto px-6 py-3 bg-lime-300 text-black font-semibold text-sm rounded hover:bg-lime-400 transition-colors whitespace-nowrap">
                            Select Your Service
                        </button>
                    </div>
                </div>

                {/* VIN Scanner Modal */}
                {showVinScanner && (
                    <div className="fixed inset-0 bg-black/75 z-[100] flex flex-col items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-black">Scan VIN Number</h2>
                                <button
                                    onClick={closeVinScanner}
                                    disabled={isScanning}
                                    className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-64 bg-black rounded-lg object-cover"
                            />

                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={captureAndDecode}
                                    disabled={isScanning}
                                    className="flex-1 px-4 py-3 bg-lime-300 text-black font-semibold rounded hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isScanning ? 'Processing...' : 'Capture & Scan'}
                                </button>
                                <button
                                    onClick={closeVinScanner}
                                    disabled={isScanning}
                                    className="flex-1 px-4 py-3 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="text-xs text-gray-600 text-center">
                                Position the VIN text clearly in front of the camera and tap "Capture & Scan"
                            </p>
                        </div>
                    </div>
                )}

                {/* Responsive Image Grid */}
                <div className="w-full max-w-5xl px-2 md:px-0 mt-auto">
                    <img
                        src={vehicleImage}
                        alt="Vehicle Collage"
                        className="w-full h-auto object-cover rounded-t-2xl md:rounded-t-[32px] border-x-4 border-t-4 md:border-x-8 md:border-t-8 border-white shadow-2xl"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-300 px-6 md:px-16 py-8 md:py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2">
                            <img src={Union} alt="APEX logo" className="h-5 w-5" />
                            <div className="font-semibold text-black text-sm">APEX Auto Hub</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-[10px] md:text-xs text-gray-600 hover:text-black">Features</a>
                            <a href="#" className="text-[10px] md:text-xs text-gray-600 hover:text-black">Learn More</a>
                            <a href="#" className="text-[10px] md:text-xs text-gray-600 hover:text-black">Support</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-500 hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="M16 11.5v5.5"></path><path d="M8 11.5v5.5"></path><path d="M12 7.5a2 2 0 0 1 2 2v2"></path></svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.82 1.08A4.48 4.48 0 0 0 16.11 0c-2.63 0-4.73 2.59-4.07 5.08A12.94 12.94 0 0 1 1.64 1.15 4.48 4.48 0 0 0 2.9 7.86 4.41 4.41 0 0 1 .89 7v.06A4.48 4.48 0 0 0 4.48 11a4.52 4.52 0 0 1-2 .08 4.48 4.48 0 0 0 4.18 3.12A9 9 0 0 1 0 19.54a12.75 12.75 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84v-.58A9.18 9.18 0 0 0 23 3z"></path></svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VehiclePage;