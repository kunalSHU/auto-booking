import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import '../styles/VehiclePage.css';

interface VehicleOption {
    make: string;
    model: string | null;
    model_trim: string | null;
    model_year: number;
}

interface VehiclePageProps {
    onCartClick?: () => void;
}

const LOCATIONS = [
    { id: 'loc-scarborough', name: 'Scarborough', region: 'Durham Region East', icon: '🏙️', tag: 'Same-day available' },
    { id: 'loc-pickering', name: 'Pickering', region: 'Durham Region', icon: '🌊', tag: 'Same-day available' },
    { id: 'loc-ajax', name: 'Ajax', region: 'Durham Region West', icon: '🏘️', tag: 'Same-day available' },
];

const VehiclePage: React.FC<VehiclePageProps> = ({ onCartClick }) => {
    const navigate = useNavigate();
    const { items } = useCart();

    // Form State
    const [vehicleData, setVehicleData] = useState({
        vin: "",
        make: "",
        model: "",
        trim: "",
        year: "",
        location: "",
    });

    // To prevent clearing fields when auto-filling from VIN
    const isAutoFilling = React.useRef(false);

    // UI State
    const [isVinOpen, setIsVinOpen] = useState(false);
    const [isVinTooltipOpen, setIsVinTooltipOpen] = useState(false);
    const [isCartDismissed, setIsCartDismissed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDecoding, setIsDecoding] = useState(false);
    const [decodeResult, setDecodeResult] = useState<'success' | 'partial' | 'none'>('none');

    // Data State
    const [makes, setMakes] = useState<VehicleOption[]>([]);
    const [models, setModels] = useState<VehicleOption[]>([]);
    const [trims, setTrims] = useState<VehicleOption[]>([]);

    const [loadingMakes, setLoadingMakes] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingTrims, setLoadingTrims] = useState(false);

    const startYear = 1990;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

    // Fetch Makes when Year changes
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
                
                if (!isAutoFilling.current) {
                    setModels([]); setTrims([]);
                    setVehicleData((prev) => ({ ...prev, make: "", model: "", trim: "" }));
                }
            } catch (error) { console.error("Error fetching makes:", error); }
            finally { setLoadingMakes(false); }
        };
        fetchMakes();
    }, [vehicleData.year]);

    // Fetch Models when Make changes
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
                
                if (!isAutoFilling.current) {
                    setTrims([]);
                    setVehicleData((prev) => ({ ...prev, model: "", trim: "" }));
                }
            } catch (error) { console.error("Error fetching models:", error); }
            finally { setLoadingModels(false); }
        };
        fetchModels();
    }, [vehicleData.year, vehicleData.make]);

    // Fetch Trims when Model changes
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
                
                if (!isAutoFilling.current) {
                    setVehicleData((prev) => ({ ...prev, trim: "" }));
                }
            } catch (error) { console.error("Error fetching trims:", error); }
            finally { setLoadingTrims(false); }
        };
        fetchTrims();
    }, [vehicleData.year, vehicleData.make, vehicleData.model]);

    const handleInputChange = (field: string, value: string) => {
        isAutoFilling.current = false;
        setVehicleData((prev) => ({ ...prev, [field]: value }));
        if (field === 'vin') {
            setDecodeResult('none');
        }
    };

    const handleDecodeVin = async () => {
        if (vehicleData.vin.length < 11) return;

        setIsDecoding(true);
        setDecodeResult('none');
        isAutoFilling.current = true;

        try {
            const response = await fetch('/api/vehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vin: vehicleData.vin }),
            });
            const result = await response.json();
            
            if (result.vehicle) {
                const { make, model, year, trim } = result.vehicle;
                setVehicleData(prev => ({
                    ...prev,
                    make: make || prev.make,
                    model: model || prev.model,
                    year: year?.toString() || prev.year,
                    trim: trim || prev.trim,
                }));
                
                if (make && model && year && trim) {
                    setDecodeResult('success');
                } else if (make || year) {
                    setDecodeResult('partial');
                }
            }
        } catch (error) {
            console.error('Error decoding VIN:', error);
            isAutoFilling.current = false;
        } finally {
            setIsDecoding(false);
            // We keep isAutoFilling.current = true for a short bit so effects can run
            setTimeout(() => { isAutoFilling.current = false; }, 1000);
        }
    };

    const handleContinue = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });
            const result = await response.json();
            
            // Save location to session storage as per template logic
            sessionStorage.setItem('autovivo_vehicle', JSON.stringify({
                ...vehicleData,
                location: vehicleData.location
            }));

            navigate('/', {
                state: {
                    vehicle: result.vehicle,
                    imageBase64: result.imageBase64,
                }
            });
        } catch (error) {
            console.error('Error submitting vehicle data:', error);
            setIsLoading(false);
        }
    };

    const isVehicleComplete = vehicleData.year && vehicleData.make && vehicleData.model && vehicleData.trim;
    const isFormComplete = isVehicleComplete && vehicleData.location;

    const totalCartItems = items.length;

    return (
        <div className="vehicle-page-container">
            {/* NAVIGATION */}
            <nav className="nav" role="navigation" aria-label="Booking navigation">
                <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    AUTO <span>VIVO.</span>
                </a>
                <a href="/" className="nav-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10 3L5 8l5 5"/>
                    </svg>
                    Back to Home
                </a>
            </nav>

            {/* PROGRESS STEPPER */}
            <div className="booking-progress" role="navigation" aria-label="Booking steps">
                <div className="progress-inner">
                    <div className="progress-step active" aria-current="step">
                        <div className="step-bubble" aria-hidden="true">1</div>
                        <div className="step-info">
                            <span className="step-name">Vehicle</span>
                            <span className="step-desc">Make, model & location</span>
                        </div>
                    </div>
                    <div className="progress-line" aria-hidden="true"></div>
                    <div className="progress-step">
                        <div className="step-bubble" aria-hidden="true">2</div>
                        <div className="step-info">
                            <span className="step-name">Service</span>
                            <span className="step-desc">What needs attention?</span>
                        </div>
                    </div>
                    <div className="progress-line" aria-hidden="true"></div>
                    <div className="progress-step">
                        <div className="step-bubble" aria-hidden="true">3</div>
                        <div className="step-info">
                            <span className="step-name">Schedule</span>
                            <span className="step-desc">Pick a time & confirm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="booking-page">
                <header className="page-header anim">
                    <span className="page-eyebrow">Step 1 of 3</span>
                    <h1 className="page-title">Select Your Vehicle</h1>
                    <p className="page-subtitle">Tell us what you're driving and where we should meet you.</p>
                </header>

                {/* PANEL 1 — VEHICLE DETAILS */}
                <section className={`panel anim d1 ${isVehicleComplete ? 'complete' : ''}`} id="vehicle-panel">
                    <div className="panel-header">
                        <div className="panel-title-group">
                            <span className="panel-icon" aria-hidden="true">🚗</span>
                            <h2 className="panel-title">Vehicle Details</h2>
                        </div>
                        <span className="panel-badge" style={{ display: isVehicleComplete ? 'flex' : 'none' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Complete
                        </span>
                    </div>

                    <div className="field-grid-4">
                        {/* Year */}
                        <div className="field">
                            <label className="field-label" htmlFor="sel-year">Year</label>
                            <div className="select-wrap">
                                <select 
                                    className={`field-select ${vehicleData.year ? 'has-value' : ''}`}
                                    id="sel-year"
                                    value={vehicleData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Make */}
                        <div className="field">
                            <label className="field-label" htmlFor="sel-make">Make</label>
                            <div className="select-wrap">
                                <select 
                                    className={`field-select ${vehicleData.make ? 'has-value' : ''}`}
                                    id="sel-make"
                                    value={vehicleData.make}
                                    onChange={(e) => handleInputChange('make', e.target.value)}
                                    disabled={!vehicleData.year || loadingMakes}
                                >
                                    <option value="" disabled>{loadingMakes ? 'Loading...' : 'Make'}</option>
                                    {makes.map(m => <option key={m.make} value={m.make}>{m.make}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Model */}
                        <div className={`field ${!vehicleData.make ? 'field-locked' : ''}`}>
                            <label className="field-label" htmlFor="sel-model">Model</label>
                            <div className="select-wrap">
                                <select 
                                    className={`field-select ${vehicleData.model ? 'has-value' : ''}`}
                                    id="sel-model"
                                    value={vehicleData.model}
                                    onChange={(e) => handleInputChange('model', e.target.value)}
                                    disabled={!vehicleData.make || loadingModels}
                                >
                                    <option value="" disabled>{loadingModels ? 'Loading...' : 'Model'}</option>
                                    {models.map(m => <option key={m.model} value={m.model ?? ""}>{m.model}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Trim */}
                        <div className="field">
                            <label className="field-label" htmlFor="input-trim">Trim</label>
                            <div className="select-wrap">
                                <select 
                                    className={`field-select ${vehicleData.trim ? 'has-value' : ''}`}
                                    id="input-trim"
                                    value={vehicleData.trim}
                                    onChange={(e) => handleInputChange('trim', e.target.value)}
                                    disabled={!vehicleData.model || loadingTrims}
                                >
                                    <option value="" disabled>{loadingTrims ? 'Loading...' : 'Trim'}</option>
                                    {trims.map((t, idx) => <option key={`${t.model_trim}-${idx}`} value={t.model_trim ?? ""}>{t.model_trim}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* VIN Toggle */}
                    <div className="vin-toggle-row">
                        <span className="vin-toggle-label">Know your VIN? Enter it to auto-fill the fields above.</span>
                        <button 
                            className={`btn-vin-toggle ${isVinOpen ? 'open' : ''}`}
                            onClick={() => setIsVinOpen(!isVinOpen)}
                            type="button"
                        >
                            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M2 5l5 5 5-5"/>
                            </svg>
                            {isVinOpen ? 'Hide VIN' : 'Enter VIN'}
                        </button>
                    </div>

                    {/* Collapsible VIN Section */}
                    <div className={`vin-section ${isVinOpen ? 'open' : ''}`} aria-hidden={!isVinOpen}>
                        <div className="vin-label-row">
                            <label className="field-label" htmlFor="vin-input">VIN Number <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,fontFamily:'var(--font-body)',color:'var(--color-neutral-400)'}}>(optional — auto-fills above)</span></label>
                            <button className="vin-where" type="button" onClick={() => setIsVinTooltipOpen(true)}>Where's my VIN?</button>
                        </div>

                        <div className="vin-input-row">
                            <div className="vin-input-wrap">
                                <input
                                    className="field-input"
                                    id="vin-input"
                                    type="text"
                                    maxLength={17}
                                    placeholder="e.g. 1HGCM82633A004352"
                                    value={vehicleData.vin}
                                    onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                                />
                                {vehicleData.vin && (
                                    <button className="vin-clear show" onClick={() => handleInputChange('vin', '')} type="button">✕</button>
                                )}
                            </div>
                            <button 
                                className={`btn-decode ${vehicleData.vin.length === 17 ? 'ready' : ''} ${isDecoding ? 'loading' : ''}`}
                                onClick={handleDecodeVin}
                                disabled={vehicleData.vin.length !== 17 || isDecoding}
                                type="button"
                            >
                                {!isDecoding ? (
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/>
                                    </svg>
                                ) : (
                                    <svg className="icon-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M14 8A6 6 0 1 1 8 2"/>
                                    </svg>
                                )}
                                <span>{isDecoding ? 'Decoding...' : 'Decode VIN'}</span>
                            </button>
                        </div>

                        <div className="vin-meta">
                            <span className="vin-hint-text">17-character Vehicle Identification Number</span>
                            <span className={`vin-counter ${vehicleData.vin.length === 17 ? 'ready' : ''}`}>{vehicleData.vin.length} / 17</span>
                        </div>

                        {decodeResult === 'success' && (
                            <div className="vin-result success show" role="status">
                                <span className="vin-result-icon">✅</span>
                                <div className="vin-result-text">
                                    <strong>VIN Decoded Successfully</strong>
                                    Fields have been auto-filled above — please review and confirm the details.
                                </div>
                            </div>
                        )}
                        {decodeResult === 'partial' && (
                            <div className="vin-result partial show" role="status">
                                <span className="vin-result-icon">⚠️</span>
                                <div className="vin-result-text">
                                    <strong>Partial Match</strong>
                                    We identified the make and year — please fill in the remaining fields above.
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* PANEL 2 — SERVICE LOCATION */}
                <section className={`panel anim d2 ${vehicleData.location ? 'complete' : ''}`} id="location-panel">
                    <div className="panel-header">
                        <div className="panel-title-group">
                            <span className="panel-icon" aria-hidden="true">📍</span>
                            <h2 className="panel-title">Service Location</h2>
                        </div>
                        <span className="panel-badge" style={{ display: vehicleData.location ? 'flex' : 'none' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Selected
                        </span>
                    </div>

                    <p style={{fontSize:'var(--text-sm)',color:'var(--color-neutral-400)',marginBottom:'var(--space-6)',lineHeight:'var(--leading-normal)'}}>
                        Choose the area closest to where you'd like us to come. We'll confirm the exact address on the next step.
                    </p>

                    <div className="location-grid" role="radiogroup">
                        {LOCATIONS.map(loc => (
                            <label 
                                key={loc.id}
                                className={`location-card ${vehicleData.location === loc.name ? 'selected' : ''}`}
                            >
                                <input 
                                    type="radio" 
                                    name="location" 
                                    value={loc.name}
                                    checked={vehicleData.location === loc.name}
                                    onChange={() => handleInputChange('location', loc.name)}
                                />
                                <div className="loc-check" aria-hidden="true"></div>
                                <span className="loc-icon" aria-hidden="true">{loc.icon}</span>
                                <div className="loc-name">{loc.name}</div>
                                <div className="loc-region">{loc.region}</div>
                                <span className="loc-tag">
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                                        <circle cx="5" cy="5" r="4"/><path d="M5 3v2l1.5 1.5"/>
                                    </svg>
                                    {loc.tag}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>
            </main>

            {/* STICKY CONTINUE BAR */}
            <div className="continue-bar" role="contentinfo">
                <div className="continue-summary">
                    <span className="continue-label">Your selection</span>
                    <div className="continue-detail">
                        {isFormComplete ? (
                            <>
                                {vehicleData.year} {vehicleData.make} {vehicleData.model} 
                                <span style={{color:'var(--color-neutral-400)',fontWeight:400}}> · </span> 
                                {vehicleData.trim} 
                                <span style={{color:'var(--color-neutral-400)',fontWeight:400}}> · </span> 
                                {vehicleData.location}
                            </>
                        ) : (
                            <span className="placeholder">Complete both sections to continue</span>
                        )}
                    </div>
                </div>
                <button 
                    className={`btn-continue ${isFormComplete ? 'active' : ''}`}
                    disabled={!isFormComplete || isLoading}
                    onClick={handleContinue}
                >
                    {isLoading ? 'Processing...' : 'Next: Service'}
                    {!isLoading && (
                        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 4l6 5-6 5"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* VIN TOOLTIP MODAL */}
            {isVinTooltipOpen && (
                <div className="vin-tooltip-overlay show" role="dialog" aria-modal="true">
                    <div className="vin-tooltip-box">
                        <button className="vin-tooltip-close" onClick={() => setIsVinTooltipOpen(false)}>✕</button>
                        <h3>Where to Find Your VIN</h3>
                        <p>Your Vehicle Identification Number (VIN) is a unique 17-character code that identifies your vehicle. Here's where to look:</p>
                        <div className="vin-locations">
                            <div className="vin-loc-item">
                                <span className="vin-loc-icon">🚗</span>
                                <div>
                                    <div className="vin-loc-label">Dashboard (Driver's side)</div>
                                    <div className="vin-loc-desc">Look through the windshield at the lower corner of the dashboard on the driver's side.</div>
                                </div>
                            </div>
                            <div className="vin-loc-item">
                                <span className="vin-loc-icon">🚪</span>
                                <div>
                                    <div className="vin-loc-label">Driver's Door Frame</div>
                                    <div className="vin-loc-desc">Open the driver's door and look at the door frame or door jamb for a sticker or plate.</div>
                                </div>
                            </div>
                            <div className="vin-loc-item">
                                <span className="vin-loc-icon">📄</span>
                                <div>
                                    <div className="vin-loc-label">Vehicle Documents</div>
                                    <div className="vin-loc-desc">Found on your registration, insurance card, and title — usually labelled "VIN".</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING RESUME CART */}
            {totalCartItems > 0 && !isCartDismissed && (
                <div className="floating-cart visible" id="floating-cart">
                    <a href="/" className="floating-cart-bubble" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <div className="floating-cart-icon">
                            <svg viewBox="0 0 16 16"><circle cx="6" cy="14" r="1"/><circle cx="13" cy="14" r="1"/><path d="M1 1h2l1.7 8.5a1 1 0 0 0 1 .8h7.1a1 1 0 0 0 1-.7L15 4H5"/></svg>
                            <span className="floating-cart-count">{totalCartItems}</span>
                        </div>
                        <div className="floating-cart-text">
                            <span className="floating-cart-label">Resume booking</span>
                            <span className="floating-cart-detail">You have {totalCartItems} item{totalCartItems !== 1 ? 's' : ''} in cart</span>
                        </div>
                    </a>
                    <button className="floating-cart-dismiss" onClick={() => setIsCartDismissed(true)}>✕</button>
                </div>
            )}
        </div>
    );
};

export default VehiclePage;
