import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart, CartItem, CartService } from '../context/CartContext';
import '../styles/ServiceSelectionPage.css';

interface VehicleData {
  vin: string;
  make: string;
  model: string;
  trim: string;
  year: string;
  location?: string;
}

interface Question {
  text: string;
  type: 'yesno' | 'select' | 'comment' | 'text';
  options?: string[];
}

interface ServiceData {
  id: number;
  cat: string;
  name: string;
  time: string;
  desc: string;
  questions?: Question[];
  price?: string; // Some might have fixed prices, others "Quote"
}

const PACKAGES = [
  { id: 'bronze', tier: 'Bronze', icon: '🥉', priceSmall: '$119.95', priceLarge: '$149.95', services: ['Oil Change', 'Vehicle Health Check'], sub: 'Essential' },
  { id: 'silver', tier: 'Silver', icon: '⭐', priceSmall: '$159.95', priceLarge: '$189.95', services: ['Oil Change', 'Alignment Inspection', 'Vehicle Health Check'], sub: 'Popular', featured: true },
  { id: 'gold', tier: 'Gold', icon: '🥇', priceSmall: '$319.95', priceLarge: '$349.95', services: ['Oil Change', 'Alignment Inspection', 'Brake Fluid Flush', 'Cabin Air Filter', 'Vehicle Health Check'], sub: 'Complete' }
];

const HEALTH_CHECK = ['Inspect & adjust all fluid levels under hood', '4-wheel tire rotation', 'Brake inspection', 'Battery test', 'Steering & suspension inspection', 'Inspect CV axle boot condition', 'Inspect lights, wipers & washers', 'Inspect air & cabin air filter', 'Weatherstrip lubrication', 'Check underbody for damage or leaks'];

const SERVICES: ServiceData[] = [
  { id: 0, cat: 'Popular', name: 'Oil Change', time: '30 min', desc: 'Drain the old engine oil, replace it with fresh oil, and install a new oil filter to keep the engine properly lubricated and running smoothly.', questions: [{ "text": "Synthetic (recommended) or conventional? Not sure", "type": "yesno" }, { "text": "Is there an oil leak?", "type": "yesno" }] },
  { id: 1, cat: 'Popular', name: 'Tires (Repair, Replacement & Flat Fix)', time: '30–60 min', desc: 'We safely remove and install your tires at your location, ensuring they are properly mounted and ready for the road.', questions: [{ "text": "What type of tire service do you need?", "type": "select", "options": ["Seasonal swap (winter ↔ summer on rims)", "Tire replacement (new tires)", "Flat tire change (install spare)", "Not sure"] }, { "text": "Do you have the tires ready at the location?", "type": "select", "options": ["Yes", "No"] }, { "text": "Do you have a wheel lock key (if applicable)?", "type": "select", "options": ["Yes", "No", "Not sure"] }] },
  { id: 2, cat: 'Popular', name: 'Brake Pad Replacement', time: '45–60 min', desc: 'Remove worn brake pads and install new ones to restore safe stopping power and prevent damage to the brake rotors', questions: [{ "text": "Are you replacing front, rear, or both?", "type": "text" }, { "text": "Any squeaking or grinding noises?", "type": "text" }, { "text": "Want the rotors inspected/replaced too?", "type": "text" }] },
  { id: 3, cat: 'Popular', name: 'Battery Replacement', time: '30–45 min', desc: 'Remove the old battery and install a new one to ensure the vehicle starts reliably and the electrical system functions properly.', questions: [{ "text": "What’s happening with the car?", "type": "select", "options": ["Won’t start", "Slow crank", "Battery light on", "Dead"] }, { "text": "Do you have jumper cables or need a boost?", "type": "yesno" }, { "text": "About how old is your battery? (<2 yrs / 2–4 yrs / 4+ yrs / Not sure)", "type": "text" }] },
  { id: 4, cat: 'Popular', name: 'Tire Rotation', time: '20–30 min', desc: 'Move tires between the front and rear positions to promote even tire wear and extend the life of the tires.', questions: [{ "text": "Do you have a wheel lock key?", "type": "yesno" }, { "text": "Any vibrations or pulling while driving?", "type": "text" }] },
  { id: 5, cat: 'Popular', name: 'Engine Air Filter Replacement', time: '15–20 min', desc: 'Install a new engine air filter to ensure the engine receives clean air for efficient combustion.', questions: [{ "text": "Any noticeable loss of power or unusual engine sounds?", "type": "text" }] },
  { id: 6, cat: 'Popular', name: 'Cabin Air Filter Replacement', time: '15–20 min', desc: 'Replace the cabin air filter to improve the quality of air entering the vehicle’s interior through the ventilation system.', questions: [] },
  { id: 7, cat: 'Popular', name: 'Spark Plug Replacement', time: '30–45 min', desc: 'Install new spark plugs to improve engine ignition, fuel efficiency, and overall engine performance.', questions: [] },
  { id: 8, cat: 'Popular', name: 'Coolant Flush', time: '45–60 min', desc: 'Drain old coolant from the cooling system and refill with fresh coolant to help prevent engine overheating and corrosion.', questions: [] },
  { id: 9, cat: 'Popular', name: 'Transmission Fluid Change', time: '45–60 min', desc: 'Replace old transmission fluid with new fluid to help maintain smooth gear shifting and protect the transmission.', questions: [{ "text": "Are you currently experiencing any transmission issues?", "type": "select", "options": ["No issues", "Vibrating or shaking", "Jerking during acceleration", "Unusual noises", "Other (please describe)"] }, { "text": "How is your vehicle shifting?", "type": "select", "options": ["Shifting normally", "Hard or rough shifting", "Slipping between gears", "Delayed engagement (slow to move after shifting)"] }, { "text": "When was your last transmission service?", "type": "select", "options": ["Within the last 30,000 km", "30,000 – 60,000 km ago", "Over 60,000 km ago", "Not sure"] }] },
  { id: 10, cat: 'Popular', name: 'Brake Fluid Flush', time: '30–45 min', desc: 'Remove contaminated brake fluid and refill with fresh fluid to maintain proper braking performance and safety.', questions: [{ "text": "Any soft brakes or warning lights?", "type": "yesno" }] },
  { id: 11, cat: 'Popular', name: 'Serpentine Belt Replacement', time: '30–60 min', desc: 'Install a new serpentine belt to restore proper operation of engine-driven components like the alternator and AC.', questions: [{ "text": "Any squealing noise from the engine?", "type": "yesno" }, { "text": "Has the belt ever been replaced before?", "type": "yesno" }] },
  { id: 12, cat: 'Popular', name: 'Power Steering Fluid Replacement', time: '15–20 min', desc: 'Check the power steering system and add fluid if necessary to ensure smooth and easy steering.', questions: [{ "text": "Any difficulty turning the wheel?", "type": "yesno" }] },
  { id: 13, cat: 'Popular', name: 'Light Bulb Replacement', time: '20–30 min', desc: 'Replace faulty or burnt-out headlight or taillight bulbs to restore proper vehicle visibility and road safety.', questions: [{ "text": "Which light?", "type": "select", "options": ["Headlight", "Taillight", "Brake", "Turn signal", "Fog", "Interior"] }, { "text": "Which side?", "type": "select", "options": ["Driver", "Passenger", "Both"] }, { "text": "Bulb type preference?", "type": "select", "options": ["LED", "Halogen", "HID", "Xenon", "Not sure"] }] },
  { id: 14, cat: 'Popular', name: 'Windshield Wiper Replacement', time: '10–15 min', desc: 'Install new windshield wiper blades to improve visibility during rain, snow, or windshield cleaning.', questions: [{ "text": "Wipers for front, rear, or both?", "type": "text" }, { "text": "Wiper type preference?", "type": "select", "options": ["Standard", "Winter", "Premium"] }] },
  { id: 15, cat: 'Popular', name: 'Alternator Replacement', time: '60–90 min', desc: 'Remove a faulty alternator and install a new one to restore proper battery charging and electrical system performance.', questions: [{ "text": "Symptoms?", "type": "select", "options": ["Dim lights", "Battery keeps dying", "Car won’t start"] }, { "text": "Check engine light on?", "type": "yesno" }, { "text": "is the battery light on", "type": "yesno" }] },
  { id: 16, cat: 'Popular', name: 'Check Engine Light Inspection', time: '15–30 min', desc: 'Scan your vehicle’s computer for engine codes, identify potential issues, and reset the check engine light if appropriate.', questions: [{ "text": "Is the car running normally?", "type": "yesno" }, { "text": "Any sounds, smells, or issues when the light is on?", "type": "text" }, { "text": "Additional Comments", "type": "comment" }] },
  // ... Adding more categories simplified
  { id: 78, cat: 'Diagnosis & Testing', name: 'Check Engine Light On', time: '30–60 min', desc: 'Perform a diagnostic scan and inspection to identify the cause of the check engine light and recommend next steps.', questions: [{ "text": "Is the light flashing or solid?", "type": "text" }, { "text": "Is the vehicle drivable?", "type": "yesno" }, { "text": "Any loss of power?", "type": "yesno" }, { "text": "Is the car vibrating", "type": "yesno" }, { "text": "Is there any noise", "type": "yesno" }, { "text": "Additional Comments", "type": "comment" }] },
  { id: 79, cat: 'Diagnosis & Testing', name: 'Car Won’t Start (No Sound or Clicking)', time: '30–60 minutes', desc: 'Diagnose starting system issues including battery, starter, and electrical faults preventing the engine from turning over.', questions: [{ "text": "Does the dashboard/ignition turn on?", "type": "yesno" }, { "text": "Do you hear any clicking or cranking?", "type": "yesno" }, { "text": "Any fluid leaks", "type": "yesno" }, { "text": "Additional Comments", "type": "comment" }] },
  { id: 94, cat: 'Brakes', name: 'Brake Service - Brake Pads & Rotors Replacement (Combined)', time: '60–120 min', desc: 'Replace both pads and rotors together for complete brake system restoration and optimal performance.', questions: [{ "text": "Which axle?", "type": "select", "options": ["Front", "Rear", "Both"] }, { "text": "Any noise or vibration?", "type": "yesno" }] },
];

interface ServiceSelectionPageProps {
  onCartClick?: () => void;
}

const CATEGORIES = ['All', 'Promo', ...Array.from(new Set(SERVICES.map(s => s.cat)))];

const LARGE_MODELS = ['F-150', 'Silverado', 'Sierra', 'Tundra', 'Tacoma', '1500', '2500', '3500', 'Colorado', 'Canyon', 'Ranger', 'Frontier', 'Titan', 'Ridgeline', 'Maverick', 'Gladiator', 'Tahoe', 'Suburban', 'Expedition', 'Yukon', 'Sequoia', 'Armada', 'Wagoneer', '4Runner', 'Highlander', 'Pilot', 'Palisade', 'Telluride', 'Ascent', 'Atlas', 'Traverse', 'Explorer', 'Pathfinder', 'CX-90', 'GLS', 'X7', 'QX80', 'XC90', 'GX', 'LX', 'Durango', 'Grand Cherokee', 'Cybertruck'];

const ServiceSelectionPage: React.FC<ServiceSelectionPageProps> = ({ onCartClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle: navVehicle, imageBase64 } = (location.state as { vehicle: VehicleData; imageBase64: string }) || { vehicle: null, imageBase64: null };
  const { addToCart, items, removeFromCart, updateCartItem, replacePackageForVehicle } = useCart();

  // Load vehicle from session storage if missing (per template logic)
  const vehicle = useMemo(() => {
    if (navVehicle) return navVehicle;
    try {
      return JSON.parse(sessionStorage.getItem('autovivo_vehicle') || 'null');
    } catch (e) { return null; }
  }, [navVehicle]);

  const isLarge = useMemo(() => vehicle && LARGE_MODELS.includes(vehicle.model), [vehicle]);

  // UI State
  const [activeCat, setActiveCat] = useState('Promo');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFloatingCartDismissed, setIsFloatingCartDismissed] = useState(false);
  
  // Modal State
  const [modalSvc, setModalSvc] = useState<ServiceData | null>(null);
  const [modalPkg, setModalPkg] = useState<any | null>(null);
  const [modalAnswers, setModalAnswers] = useState<Record<number, string>>({});
  const [modalEditMode, setModalEditMode] = useState(false);
  const [isHcOpen, setIsHcOpen] = useState(false);

  // Estimates state
  const [estimatingIds, setEstimatingIds] = useState<Set<number>>(new Set());
  const [estimates, setEstimates] = useState<Record<number, string>>({});

  // Get current cart status for each service
  const currentVehicleKey = vehicle ? (vehicle.vin || `${vehicle.make}-${vehicle.model}-${vehicle.year}`) : '';
  const vehicleCartItem = items.find(item => {
    const key = item.vehicle.vin || `${item.vehicle.make}-${item.vehicle.model}-${item.vehicle.year}`;
    return key === currentVehicleKey;
  });

  const cartPkgId = vehicleCartItem?.packageName;
  const cartServices = vehicleCartItem?.services || [];

  const handleOpenSvcModal = (svc: ServiceData, existingAnswers?: { question: string; answer: string }[]) => {
    setModalSvc(svc);
    setModalPkg(null);
    setModalEditMode(!!existingAnswers);
    
    const initialAnswers: Record<number, string> = {};
    if (existingAnswers) {
      existingAnswers.forEach((a, i) => {
        initialAnswers[i] = a.answer;
      });
    }
    setModalAnswers(initialAnswers);
    setIsCartOpen(false);
  };

  const handleOpenPkgModal = (pkg: any) => {
    setModalPkg(pkg);
    setModalSvc(null);
    setIsHcOpen(false);
    setIsCartOpen(false);
  };

  const handleCloseModal = () => {
    setModalSvc(null);
    setModalPkg(null);
    setModalAnswers({});
  };

  const handleModalAnswerChange = (qi: number, val: string) => {
    setModalAnswers(prev => ({ ...prev, [qi]: val }));
  };

  const isModalReady = useMemo(() => {
    if (modalPkg) return true;
    if (!modalSvc) return false;
    const qs = modalSvc.questions || [];
    return qs.every((q, qi) => {
      if (q.type === 'comment') return true;
      const ans = modalAnswers[qi];
      return ans && ans.trim() !== '';
    });
  }, [modalSvc, modalPkg, modalAnswers]);

  const handleAddToCart = () => {
    if (!vehicle) return;

    if (modalPkg) {
      const price = isLarge ? modalPkg.priceLarge : modalPkg.priceSmall;
      const alreadySelected = cartPkgId === modalPkg.tier;
      
      if (alreadySelected) {
        // Remove package
        const newItem: CartItem = {
          ...(vehicleCartItem || {
            id: '',
            vehicle,
            imageBase64,
            packageName: null,
            services: [],
            totalPrice: 0
          }),
          packageName: null,
          totalPrice: (vehicleCartItem?.totalPrice || 0) - parseFloat(price.replace('$', ''))
        };
        replacePackageForVehicle(vehicle, newItem);
      } else {
        // Add package
        const oldPrice = cartPkgId ? parseFloat(PACKAGES.find(p => p.tier === cartPkgId)?.[isLarge ? 'priceLarge' : 'priceSmall'].replace('$', '') || '0') : 0;
        const newPkgPrice = parseFloat(price.replace('$', ''));
        
        const newItem: CartItem = {
          ...(vehicleCartItem || {
            id: '',
            vehicle,
            imageBase64,
            packageName: null,
            services: [],
            totalPrice: 0
          }),
          packageName: modalPkg.tier,
          totalPrice: (vehicleCartItem?.totalPrice || 0) - oldPrice + newPkgPrice
        };
        replacePackageForVehicle(vehicle, newItem);
      }
      handleCloseModal();
    } else if (modalSvc) {
      const qs = modalSvc.questions || [];
      const answers = qs.map((q, qi) => ({ question: q.text, answer: modalAnswers[qi] || '' }));
      
      const newService: CartService = {
        title: modalSvc.name,
        price: modalSvc.price || 'Quote',
        desc: modalSvc.desc,
        answers
      };

      if (modalEditMode) {
        // Update existing service
        const updatedServices = cartServices.map(s => s.title === modalSvc.name ? newService : s);
        const newItem: CartItem = {
          ...vehicleCartItem!,
          services: updatedServices
        };
        updateCartItem(vehicleCartItem!.id, newItem);
      } else {
        // Add new service
        const existingServices = cartServices.filter(s => s.title !== modalSvc.name);
        const newItem: CartItem = {
          ...(vehicleCartItem || {
            id: '',
            vehicle,
            imageBase64,
            packageName: null,
            services: [],
            totalPrice: 0
          }),
          services: [...existingServices, newService]
        };
        if (vehicleCartItem) {
          updateCartItem(vehicleCartItem.id, newItem);
        } else {
          addToCart(newItem);
        }
      }
      handleCloseModal();
    }
  };

  const handleToggleService = (svc: ServiceData) => {
    if (!vehicle) return;

    const inCart = cartServices.some(s => s.title === svc.name);
    if (inCart) {
      // Remove
      const updatedServices = cartServices.filter(s => s.title !== svc.name);
      const newItem: CartItem = {
        ...vehicleCartItem!,
        services: updatedServices
      };
      updateCartItem(vehicleCartItem!.id, newItem);
    } else {
      // Add (check for questions)
      const qs = (svc.questions || []).filter(q => q.type !== 'comment');
      if (qs.length > 0) {
        handleOpenSvcModal(svc);
      } else {
        const newItem: CartItem = {
          ...(vehicleCartItem || {
            id: '',
            vehicle,
            imageBase64,
            packageName: null,
            services: [],
            totalPrice: 0
          }),
          services: [...cartServices, { title: svc.name, price: svc.price || 'Quote', desc: svc.desc }]
        };
        if (vehicleCartItem) {
          updateCartItem(vehicleCartItem.id, newItem);
        } else {
          addToCart(newItem);
        }
      }
    }
  };

  const handleRemoveService = (title: string) => {
    if (!vehicleCartItem) return;
    const updatedServices = cartServices.filter(s => s.title !== title);
    updateCartItem(vehicleCartItem.id, { ...vehicleCartItem, services: updatedServices });
  };

  const handleRemovePackage = () => {
    if (!vehicleCartItem) return;
    const pkg = PACKAGES.find(p => p.tier === cartPkgId);
    const price = pkg ? parseFloat(pkg[isLarge ? 'priceLarge' : 'priceSmall'].replace('$', '')) : 0;
    updateCartItem(vehicleCartItem.id, { ...vehicleCartItem, packageName: null, totalPrice: vehicleCartItem.totalPrice - price });
  };

  const handleEditService = (title: string) => {
    const svc = SERVICES.find(s => s.name === title);
    const cartSvc = cartServices.find(s => s.title === title);
    if (svc && cartSvc) {
      handleOpenSvcModal(svc, cartSvc.answers);
    }
  };

  const filteredServices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const showPromo = (activeCat === 'All' || activeCat === 'Promo') && !q;
    
    let list = SERVICES;
    if (activeCat !== 'Promo' && activeCat !== 'All') {
      list = list.filter(s => s.cat === activeCat);
    }
    if (q) {
      list = SERVICES.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.cat.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q)
      );
    }

    return activeCat === 'Promo' && !q ? [] : list;
  }, [activeCat, searchTerm]);

  const showPromo = (activeCat === 'All' || activeCat === 'Promo') && !searchTerm;

  const cartCount = (cartPkgId ? 1 : 0) + cartServices.length;
  const cartTotalText = useMemo(() => {
    if (!vehicleCartItem) return '—';
    const pkg = PACKAGES.find(p => p.tier === cartPkgId);
    const pkgPrice = pkg ? pkg[isLarge ? 'priceLarge' : 'priceSmall'] : null;
    if (pkgPrice) {
      return `From ${pkgPrice}${cartServices.length ? ' + quotes' : ''}`;
    }
    return cartServices.length ? 'Quoted at service' : '—';
  }, [vehicleCartItem, cartPkgId, cartServices, isLarge]);

  return (
    <div className="service-selection-container">
      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          AUTO <span>VIVO.</span>
        </a>
        <button className="nav-back" onClick={() => navigate('/select-vehicle')}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5"/></svg>
          Back
        </button>
      </nav>

      {/* VEHICLE HEADER */}
      <div className="vehicle-bar">
        <div className="vb-info">
          <span className="vb-car">🚗</span>
          <span className="vb-name">{vehicle?.year} {vehicle?.make} {vehicle?.model} {vehicle?.trim}</span>
          <span className="vb-sep"></span>
          <span className="vb-loc">📍 {vehicle?.location || 'Select Location'}</span>
        </div>
        <button className="vb-cart-btn" onClick={() => setIsCartOpen(true)} type="button">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="14" r="1"/><circle cx="13" cy="14" r="1"/><path d="M1 1h2l1.7 8.5a1 1 0 0 0 1 .8h7.1a1 1 0 0 0 1-.7L15 4H5"/></svg>
          Cart
          <span className={`cart-badge ${cartCount > 0 ? 'show' : ''}`}>{cartCount}</span>
        </button>
      </div>

      {/* PROGRESS */}
      <div className="booking-progress">
        <div className="progress-inner">
          <div className="progress-step done"><div className="step-bubble">✓</div><span className="step-name">Vehicle</span></div>
          <div className="progress-line"></div>
          <div className="progress-step active" aria-current="step"><div className="step-bubble">2</div><span className="step-name">Service</span></div>
          <div className="progress-line"></div>
          <div className="progress-step"><div className="step-bubble">3</div><span className="step-name">Schedule</span></div>
        </div>
      </div>

      {/* MAIN */}
      <main className="page">
        <header className="anim">
          <div className="page-eyebrow">Step 2 of 3</div>
          <h1 className="page-title">Choose Your Services</h1>
          <p className="page-sub">Select a package or individual services — or mix and match both.</p>
        </header>

        <div className="svc-controls anim d1">
          <div className="svc-search-wrap">
            <span className="svc-search-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="5"/><path d="M12 12l3 3"/></svg></span>
            <input 
              className="svc-search" 
              type="search" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off" 
            />
          </div>
        </div>

        <div className="filter-bar anim d2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`filter-pill ${cat === 'Promo' ? 'promo-pill' : ''} ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="svc-grid">
          {/* Promo Packages */}
          {showPromo && PACKAGES.map(pkg => {
            const price = isLarge ? pkg.priceLarge : pkg.priceSmall;
            const inCart = cartPkgId === pkg.tier;
            return (
              <div key={pkg.id} className={`svc-card promo-card ${inCart ? 'in-cart' : ''}`} onClick={() => handleOpenPkgModal(pkg)}>
                <div className="svc-body">
                  <div className="svc-name">{pkg.icon} {pkg.tier} Package</div>
                  <div className="svc-meta">
                    <span className="svc-cat promo">Promo</span>
                    <span className="svc-time">from {price}</span>
                    {pkg.featured && <span className="svc-has-qs">Most Popular</span>}
                  </div>
                  <div className="svc-desc">{pkg.services.join(' · ')}</div>
                </div>
                <button className={`svc-add promo-add ${inCart ? 'added' : ''}`} type="button">
                  {inCart ? '✓' : '+'}
                </button>
              </div>
            );
          })}

          {/* Regular Services */}
          {filteredServices.map(svc => {
            const inCart = cartServices.some(s => s.title === svc.name);
            const hasQs = svc.questions && svc.questions.filter(q => q.type !== 'comment').length > 0;
            return (
              <div key={svc.id} className={`svc-card ${inCart ? 'in-cart' : ''}`}>
                <div className="svc-body" onClick={() => handleToggleService(svc)} style={{ cursor: 'pointer' }}>
                  <div className="svc-name">{svc.name}</div>
                  <div className="svc-meta">
                    <span className="svc-cat">{svc.cat}</span>
                    {svc.time && <span className="svc-time">{svc.time}</span>}
                    {hasQs && <span className="svc-has-qs">Intake form</span>}
                  </div>
                  {svc.desc && <div className="svc-desc">{svc.desc}</div>}
                </div>
                <button 
                  className={`svc-add ${inCart ? 'added' : ''}`} 
                  onClick={() => handleToggleService(svc)}
                >
                  {inCart ? '✓' : '+'}
                </button>
              </div>
            );
          })}

          {!filteredServices.length && !showPromo && (
            <div className="svc-empty">
              <h3>No services found</h3>
              <p>Try a different search or category.</p>
            </div>
          )}
        </div>
      </main>

      {/* SERVICE POPUP MODAL */}
      <div className={`svc-modal-overlay ${modalSvc || modalPkg ? 'open' : ''}`} onClick={handleCloseModal}>
        <div className="svc-modal" onClick={e => e.stopPropagation()}>
          <div className="svc-modal-header">
            <div className="svc-modal-title-group">
              <div className="svc-modal-eyebrow">
                {modalPkg ? 'Maintenance Package' : 'A few quick questions'}
              </div>
              <div className="svc-modal-title">
                {modalPkg ? `${modalPkg.icon} ${modalPkg.tier} Package` : modalSvc?.name}
              </div>
            </div>
            <button className="svc-modal-close" onClick={handleCloseModal}>✕</button>
          </div>
          
          <div className="svc-modal-body">
            {modalPkg ? (
              <>
                <div className="pkg-modal-prices">
                  <div className="pkg-modal-price-row">
                    <span className="pkg-modal-price-type">{isLarge ? 'Truck / Large SUV' : 'Car / Small SUV'}</span>
                    <span className="pkg-modal-price-val hi">from {isLarge ? modalPkg.priceLarge : modalPkg.priceSmall}</span>
                  </div>
                  <div className="pkg-modal-price-row">
                    <span className="pkg-modal-price-type">{!isLarge ? 'Truck / Large SUV' : 'Car / Small SUV'}</span>
                    <span className="pkg-modal-price-val">from {!isLarge ? modalPkg.priceLarge : modalPkg.priceSmall}</span>
                  </div>
                </div>
                <ul className="pkg-modal-services">
                  {modalPkg.services.map((s: string) => <li key={s}>{s}</li>)}
                </ul>
                <button className="pkg-modal-hc-toggle" onClick={() => setIsHcOpen(!isHcOpen)}>
                  {isHcOpen ? 'Hide Health Check details' : 'View 15-point Health Check details'}
                </button>
                {isHcOpen && (
                  <ul className="pkg-modal-hc-list open">
                    {HEALTH_CHECK.map(h => <li key={h}>{h}</li>)}
                  </ul>
                )}
                <p className="pkg-modal-fine">* Includes up to 5L of Dexos full synthetic oil, OE filter, lube and 15-point check. Diesel engines subject to surcharge (+$99.95). Not valid with same service offers/discounts.</p>
              </>
            ) : (
              <>
                {modalSvc?.questions?.length ? (
                  <p className="svc-modal-intro">Please answer the questions below so our technician can prepare for your appointment.</p>
                ) : (
                  <p className="svc-modal-intro">No additional information required. Click "Add to Cart" to proceed.</p>
                )}
                {modalSvc?.questions?.map((q, qi) => (
                  <div key={qi} className="modal-q-block">
                    <div className="modal-q-label">{q.text} {q.type !== 'comment' && <span className="modal-q-required">*</span>}</div>
                    
                    {q.type === 'yesno' && (
                      <div className="modal-radio-group">
                        {['Yes', 'No'].map(opt => (
                          <label key={opt} className={`modal-radio-opt ${modalAnswers[qi] === opt ? 'selected' : ''}`} onClick={() => handleModalAnswerChange(qi, opt)}>
                            <div className="modal-radio-dot"></div>
                            <span className="modal-radio-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {q.type === 'select' && (
                      <div className="modal-radio-group">
                        {q.options?.map(opt => (
                          <label key={opt} className={`modal-radio-opt ${modalAnswers[qi] === opt ? 'selected' : ''}`} onClick={() => handleModalAnswerChange(qi, opt)}>
                            <div className="modal-radio-dot"></div>
                            <span className="modal-radio-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === 'text' && (
                      <input 
                        className="modal-text-input" 
                        type="text" 
                        placeholder="Type your answer..." 
                        value={modalAnswers[qi] || ''}
                        onChange={(e) => handleModalAnswerChange(qi, e.target.value)}
                      />
                    )}

                    {q.type === 'comment' && (
                      <textarea 
                        className="modal-textarea" 
                        placeholder="Optional — add any notes for your technician..." 
                        rows={3}
                        value={modalAnswers[qi] || ''}
                        onChange={(e) => handleModalAnswerChange(qi, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="svc-modal-footer">
            <button className="btn-modal-cancel" onClick={handleCloseModal}>Cancel</button>
            <button 
              className={`btn-modal-add ${isModalReady ? 'ready' : ''}`} 
              disabled={!isModalReady}
              onClick={handleAddToCart}
            >
              {modalPkg ? (cartPkgId === modalPkg.tier ? 'Remove Package' : 'Add to Cart') : (modalEditMode ? 'Save Changes' : 'Add to Cart')}
            </button>
          </div>
        </div>
      </div>

      {/* CART MODAL (SIDE PANEL) */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart {cartCount > 0 && `(${cartCount})`}</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        
        <div className="cart-items">
          {cartCount === 0 ? (
            <div className="cart-empty">
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <p>Your cart is empty.<br />Add a package or individual services.</p>
            </div>
          ) : (
            <>
              {cartPkgId && (
                <>
                  <div className="cart-section-label">Package</div>
                  <div className="cart-item">
                    <div className="cart-item-main">
                      <div className="cart-item-body">
                        <div className="cart-item-name">
                          {PACKAGES.find(p => p.tier === cartPkgId)?.icon} {cartPkgId} Maintenance Package
                        </div>
                        <div className="cart-item-detail">Oil change, health check & more</div>
                      </div>
                      <span className="cart-item-price">
                        {PACKAGES.find(p => p.tier === cartPkgId)?.[isLarge ? 'priceLarge' : 'priceSmall']}
                      </span>
                      <div className="cart-item-actions">
                        <button className="cart-item-btn cart-item-rm" onClick={handleRemovePackage}>✕</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {cartServices.length > 0 && (
                <>
                  <div className="cart-section-label">Individual Services</div>
                  {cartServices.map((s, idx) => (
                    <div key={idx} className="cart-item">
                      <div className="cart-item-main">
                        <div className="cart-item-body">
                          <div className="cart-item-name">{s.title}</div>
                          <div className="cart-item-detail">{s.price}</div>
                        </div>
                        <span className="cart-item-price" style={{ color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)' }}>Quote</span>
                        <div className="cart-item-actions">
                          {s.answers?.length ? (
                            <button className="cart-item-btn cart-item-edit" onClick={() => handleEditService(s.title)}>✎</button>
                          ) : null}
                          <button className="cart-item-btn cart-item-rm" onClick={() => handleRemoveService(s.title)}>✕</button>
                        </div>
                      </div>
                      {s.answers?.length ? (
                        <div className="cart-answers">
                          {s.answers.map((a, ai) => (
                            <div key={ai} className="cart-answer-row">
                              <span className="cart-answer-q">{a.question.substring(0, 40)}:</span>
                              <span className="cart-answer-a">{a.answer}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Estimated Total</span>
            <span className="cart-total-val">{cartTotalText}</span>
          </div>
          <p className="cart-note">Individual service pricing confirmed at appointment. Package prices are starting rates.</p>
          <button className="btn-cart-continue" disabled={cartCount === 0} onClick={() => navigate('/booking-appointment')}>
            Next: Schedule
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l6 5-6 5"/></svg>
          </button>
        </div>
      </div>

      {/* STICKY BAR */}
      <div className="sticky-bar">
        <div className="sb-info">
          <span className="sb-label">Your Cart</span>
          <div className="sb-detail">
            {cartCount === 0 ? (
              <span className="muted">No items yet</span>
            ) : (
              <>
                {cartPkgId ? `${cartPkgId} Package` : ''}
                {cartPkgId && cartServices.length ? ' + ' : ''}
                {cartServices.length ? `${cartServices.length} service${cartServices.length !== 1 ? 's' : ''}` : ''}
              </>
            )}
          </div>
        </div>
        <div className="sb-actions">
          <button className="btn-view-cart" onClick={() => setIsCartOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><circle cx="6" cy="14" r="1"/><circle cx="13" cy="14" r="1"/><path d="M1 1h2l1.7 8.5a1 1 0 0 0 1 .8h7.1a1 1 0 0 0 1-.7L15 4H5"/></svg>
            View Cart
          </button>
          <button className={`btn-continue ${cartCount > 0 ? 'active' : ''}`} disabled={cartCount === 0} onClick={() => navigate('/booking-appointment')}>
            Next: Schedule
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l6 5-6 5"/></svg>
          </button>
        </div>
      </div>

      {/* FLOATING RESUME CART */}
      {cartCount > 0 && !isFloatingCartDismissed && (
        <div className="floating-cart visible">
          <button className="floating-cart-bubble" onClick={() => setIsCartOpen(true)}>
            <div className="floating-cart-icon">
              <svg viewBox="0 0 16 16"><circle cx="6" cy="14" r="1"/><circle cx="13" cy="14" r="1"/><path d="M1 1h2l1.7 8.5a1 1 0 0 0 1 .8h7.1a1 1 0 0 0 1-.7L15 4H5"/></svg>
              <span className="floating-cart-count">{cartCount}</span>
            </div>
            <div className="floating-cart-text">
              <span className="floating-cart-label">Resume booking</span>
              <span className="floating-cart-detail">Your selections are saved</span>
            </div>
          </button>
          <button className="floating-cart-dismiss" onClick={() => setIsFloatingCartDismissed(true)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionPage;
