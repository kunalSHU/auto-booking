-- Generated SQL insert statements from loadServices.js
-- This file is for reference only and is not used for insertion

-- Service: Oil Change
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Oil Change', 'Drain the old engine oil, replace it with fresh oil, and install a new oil filter to keep the engine properly lubricated and running smoothly.', true, NOW());
-- Question: Synthetic (recommended) or conventional?
-- Answer: Y (Option: false)
-- Answer: N (Option: false)
-- Answer: Not sure (Option: true)
-- Question: Is there an oil leak?
-- Answer: Y (Option: false)
-- Answer: N (Option: false)

-- Service: Tires (Repair, Replacement & Flat Fix)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Tires (Repair, Replacement & Flat Fix)', 'We safely remove and install your tires at your location, ensuring they are properly mounted and ready for the road.', true, NOW());
-- Question: What type of tire service do you need?
-- Answer: Seasonal swap (winter ↔ summer on rims) (Option: true)
-- Answer: Tire replacement (new tires) (Option: true)
-- Answer: Flat tire change (install spare) (Option: true)
-- Answer: Not sure (Option: true)
-- Question: Do you have the tires ready at the location?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Do you have a wheel lock key (if applicable)?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Not sure (Option: true)

-- Service: Brake Pad Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Brake Pad Replacement', 'Remove worn brake pads and install new ones to restore safe stopping power and prevent damage to the brake rotors', true, NOW());
-- Question: Are you replacing front, rear, or both?
-- Answer: Front (Option: true)
-- Answer: Rear (Option: true)
-- Answer: Both (Option: true)
-- Question: Any squeaking or grinding noises?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Want the rotors inspected/replaced too?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Battery Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Battery Replacement', 'Remove the old battery and install a new one to ensure the vehicle starts reliably and the electrical system functions properly.', true, NOW());
-- Question: What’s happening with the car?
-- Answer: Won’t start (Option: true)
-- Answer: Slow crank (Option: true)
-- Answer: Battery light on (Option: true)
-- Answer: Dead (Option: true)
-- Question: Do you have jumper cables or need a boost?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: About how old is your battery?
-- Answer: <2 yrs (Option: true)
-- Answer: 2–4 yrs (Option: true)
-- Answer: 4+ yrs (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Tire Rotation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Tire Rotation', 'Move tires between the front and rear positions to promote even tire wear and extend the life of the tires.', true, NOW());
-- Question: Do you have a wheel lock key?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any vibrations or pulling while driving?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Air Filter Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Engine Air Filter Replacement', 'Install a new engine air filter to ensure the engine receives clean air for efficient combustion.', true, NOW());
-- Question: Any noticeable loss of power or unusual engine sounds?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Cabin Air Filter Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Cabin Air Filter Replacement', 'Replace the cabin air filter to improve the quality of air entering the vehicle’s interior through the ventilation system.', true, NOW());

-- Service: Spark Plug Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Spark Plug Replacement', 'Install new spark plugs to improve engine ignition, fuel efficiency, and overall engine performance.', true, NOW());

-- Service: Coolant Flush
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Coolant Flush', 'Drain old coolant from the cooling system and refill with fresh coolant to help prevent engine overheating and corrosion.', true, NOW());

-- Service: Transmission Fluid Change
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Transmission Fluid Change', 'Replace old transmission fluid with new fluid to help maintain smooth gear shifting and protect the transmission.', true, NOW());
-- Question: Are you currently experiencing any transmission issues?
-- Answer: No issues (Option: true)
-- Answer: Vibrating or shaking (Option: true)
-- Answer: Jerking during acceleration (Option: true)
-- Answer: Unusual noises (Option: true)
-- Answer: Other (please describe) (Option: true)
-- Question: How is your vehicle shifting?
-- Answer: Shifting normally (Option: true)
-- Answer: Hard or rough shifting (Option: true)
-- Answer: Slipping between gears (Option: true)
-- Answer: Delayed engagement (slow to move after shifting) (Option: true)
-- Question: When was your last transmission service?
-- Answer: Within the last 30,000 km (Option: true)
-- Answer: 30,000 – 60,000 km ago (Option: true)
-- Answer: Over 60,000 km ago (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Brake Fluid Flush
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Brake Fluid Flush', 'Remove contaminated brake fluid and refill with fresh fluid to maintain proper braking performance and safety.', true, NOW());
-- Question: Any soft brakes or warning lights?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Serpentine Belt Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Serpentine Belt Replacement', 'Install a new serpentine belt to restore proper operation of engine-driven components like the alternator and AC.', true, NOW());
-- Question: Any noise from the engine?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Has the belt ever been replaced before?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)

-- Service: Power Steering Fluid Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Power Steering Fluid Replacement', 'Check the power steering system and add fluid if necessary to ensure smooth and easy steering.', true, NOW());
-- Question: Any difficulty turning the wheel?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Light Bulb Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Light Bulb Replacement', 'Replace faulty or burnt-out headlight or taillight bulbs to restore proper vehicle visibility and road safety.', true, NOW());
-- Question: Which light?
-- Answer: Headlight (Option: true)
-- Answer: Taillight (Option: true)
-- Answer: Brake (Option: true)
-- Answer: Turn signal (Option: true)
-- Answer: Fog (Option: true)
-- Answer: Interior (Option: true)
-- Question: Which side?
-- Answer: Driver (Option: true)
-- Answer: Passenger (Option: true)
-- Answer: Both (Option: true)
-- Question: Bulb type preference?
-- Answer: LED (Option: true)
-- Answer: Halogen (Option: true)
-- Answer: HID (Option: true)
-- Answer: Xenon (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Windshield Wiper Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Windshield Wiper Replacement', 'Install new windshield wiper blades to improve visibility during rain, snow, or windshield cleaning.', true, NOW());
-- Question: Wipers for front, rear, or both?
-- Answer: Front (Option: true)
-- Answer: Rear (Option: true)
-- Answer: Both (Option: true)
-- Question: Wiper type preference?
-- Answer: Standard (Option: true)
-- Answer: Winter (Option: true)
-- Answer: Premium (Option: true)

-- Service: Alternator Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Alternator Replacement', 'Remove a faulty alternator and install a new one to restore proper battery charging and electrical system performance.', true, NOW());
-- Question: Symptoms?
-- Answer: Dim lights (Option: true)
-- Answer: Battery keeps dying (Option: true)
-- Answer: Car won’t start (Option: true)
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: is the battery light on
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Check Engine Light Inspection
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Popular', 'Check Engine Light Inspection', 'Scan your vehicle’s computer for engine codes, identify potential issues, and reset the check engine light if appropriate.', true, NOW());
-- Question: Is the car running normally?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any sounds, smells, or issues when the light is on?
-- Question: Add comment

-- Service: Bronze Package – Essential Checkup
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Packages', 'Bronze Package – Essential Checkup', 'Inspect & top up all under-hood fluid levels
4-wheel tire rotation
Brake inspection
Battery health test
Steering & suspension inspection
Inspect CV axle boots
Check lights, wipers & washers
Inspect air & cabin filters
Weatherstrip lubrication
Underbody inspection for leaks/damage', true, NOW());
-- Question: “Anything else the technician should know?”

-- Service: Silver Maintenace Package - Preventive Care
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Packages', 'Silver Maintenace Package - Preventive Care', 'Oil & filter change
Tire pressure check + adjustment
Brake cleaning & adjustment
Detailed fluid condition check (not just top-up)
Scan for basic diagnostic codes', true, NOW());
-- Question: “Anything else the technician should know?”

-- Service: Gold Mainteanance Package - Premium Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Packages', 'Gold Mainteanance Package - Premium Service', 'Full vehicle diagnostic scan
Battery terminal cleaning
Cabin + engine air filter replacement (if needed)
Brake system deeper inspection (pads + rotors condition report)
Minor fluid top-offs included (washer fluid, coolant, etc.)
Priority booking + faster service', true, NOW());
-- Question: “Anything else the technician should know?”

-- Service: 5000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '5000 km', 'Perform a routine inspection including oil level check, tire inspection, fluid checks, and general safety inspection at the 5,000 km interval.', true, NOW());

-- Service: 10,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '10,000 km', 'Perform manufacturer-recommended maintenance including oil change, tire inspection, cabin filter check, air filter check, fluid checks, and system inspection at the 10,000 km service interval.', true, NOW());

-- Service: 15,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '15,000 km', 'Perform a 15,000 km preventative maintenance service with a full multi-point inspection of key systems, including fluids, brakes, tires, and battery to ensure optimal performance and safety. Air and cabin filters are inspected and replaced if needed based on their condition.', true, NOW());

-- Service: 20,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '20,000 km', 'Perform scheduled maintenance including fluid checks, tire inspection, and system diagnostics at the 20,000 km interval.', true, NOW());

-- Service: 25,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '25,000 km', 'Carry out preventative maintenance tasks and vehicle system inspections recommended at 25,000 km.', true, NOW());

-- Service: 30,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '30,000 km', 'Perform manufacturer-recommended maintenance including filter inspection, fluid checks, and component inspection at the 30,000 km milestone.', true, NOW());

-- Service: 35,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '35,000 km', 'Conduct routine maintenance and system checks recommended at the 35,000 km interval.', true, NOW());

-- Service: 40,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '40,000 km', 'Perform a comprehensive 40,000 km scheduled service including full fluid, brake, and tire inspections to maintain performance and safety. Service includes engine oil change, brake fluid, transmission and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 45,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '45,000 km', 'Perform routine inspection and preventative maintenance tasks recommended at 45,000 km.', true, NOW());

-- Service: 50,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '50,000 km', 'Perform a comprehensive maintenance service including inspection of engine components, brakes, suspension, and fluids at 50,000 km.', true, NOW());

-- Service: 55,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '55,000 km', 'Perform a comprehensive maintenance service including inspection of engine components, brakes, suspension, and fluids at 55,000 km.', true, NOW());

-- Service: 60,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '60,000 km', 'Perform major scheduled maintenance including component inspection, fluid replacement, and preventative servicing recommended at 60,000 km.', true, NOW());

-- Service: 65,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '65,000 km', 'Performs routine vehicle inspection and maintenance at 65,000 km including fluid level checks, tire inspection, and basic system evaluations.', true, NOW());

-- Service: 70,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '70,000 km', 'Performs scheduled maintenance at 70,000 km including inspection of brakes, suspension components, belts, hoses, and engine performance systems.', true, NOW());

-- Service: 75,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '75,000 km', 'Performs manufacturer-recommended maintenance at 75,000 km including oil service, fluid checks, and inspection of critical vehicle systems.', true, NOW());

-- Service: 80,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '80,000 km', 'Perform a comprehensive 80,000 km scheduled maintenance including inspection of engine components, brakes, belts, hoses, filters, and all fluid conditions to ensure long-term reliability. Service includes engine oil change, brake, transmission, and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 85,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '85,000 km', 'Performs routine maintenance and inspection at 85,000 km to ensure engine, braking, and electrical systems continue operating properly.', true, NOW());

-- Service: 90,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '90,000 km', 'Performs comprehensive 90,000 km maintenance including inspection of drivetrain, suspension, fluids, filters, and major engine components.', true, NOW());

-- Service: 95,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '95,000 km', 'Performs routine service at 95,000 km including inspection of vehicle safety systems, fluid levels, and wear components.', true, NOW());

-- Service: 100,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '100,000 km', 'Performs major manufacturer-recommended maintenance at 100,000 km including inspection or replacement of key components such as spark plugs, filters, fluids, and belts where required.', true, NOW());

-- Service: 105,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '105,000 km', 'Performs scheduled vehicle maintenance at 105,000 km including system inspections, fluid checks, and replacement of minor service items.', true, NOW());

-- Service: 110,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '110,000 km', 'Performs preventative maintenance at 110,000 km including inspection of braking, steering, cooling, and engine systems.', true, NOW());

-- Service: 115,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '115,000 km', 'Performs routine service at 115,000 km including fluid level inspection, safety checks, and evaluation of wear components.', true, NOW());

-- Service: 120,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '120,000 km', 'Perform a major 120,000 km maintenance service including inspection of timing components, drivetrain, cooling system, and engine performance systems to ensure peak reliability. Service includes engine oil change, brake, transmission, and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 125,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '125,000 km', 'Performs routine vehicle maintenance at 125,000 km including fluid checks, brake inspection, and engine performance evaluation.', true, NOW());

-- Service: 130,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '130,000 km', 'Performs preventative maintenance service at 130,000 km including inspection of suspension, steering, engine, and electrical systems.', true, NOW());

-- Service: 135,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '135,000 km', 'Performs routine service at 135,000 km including system diagnostics, safety checks, and fluid inspections.', true, NOW());

-- Service: 140,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '140,000 km', 'Performs scheduled maintenance at 140,000 km including inspection of belts, hoses, brakes, suspension components, and fluid conditions.', true, NOW());

-- Service: 145,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '145,000 km', 'Performs preventative maintenance at 145,000 km including inspection of engine performance systems and vehicle safety components.', true, NOW());

-- Service: 150,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '150,000 km', 'Performs major maintenance service at 150,000 km including inspection and possible replacement of key drivetrain, ignition, and fluid components.', true, NOW());

-- Service: 155,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '155,000 km', 'Performs routine inspection and maintenance at 155,000 km including fluid checks and evaluation of wear items.', true, NOW());

-- Service: 160,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '160,000 km', 'Perform a comprehensive 160,000 km scheduled maintenance including inspection of engine, cooling, suspension, and braking systems to ensure continued performance and safety. Service includes engine oil change, brake, transmission, and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 165,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '165,000 km', 'Performs preventative maintenance service at 165,000 km including safety inspections and fluid system evaluations.', true, NOW());

-- Service: 170,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '170,000 km', 'Performs routine vehicle maintenance at 170,000 km including inspection of belts, hoses, filters, and brake components.', true, NOW());

-- Service: 175,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '175,000 km', 'Performs scheduled inspection and maintenance at 175,000 km including checks of major vehicle systems.', true, NOW());

-- Service: 180,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '180,000 km', 'Performs major maintenance at 180,000 km including detailed inspection of drivetrain, engine performance components, and cooling systems.', true, NOW());

-- Service: 185,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '185,000 km', 'Performs preventative service at 185,000 km including fluid inspection, safety checks, and system diagnostics.', true, NOW());

-- Service: 190,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '190,000 km', 'Performs routine maintenance and inspection at 190,000 km to ensure continued vehicle reliability.', true, NOW());

-- Service: 195,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '195,000 km', 'Performs scheduled service at 195,000 km including inspection of engine, braking, electrical, and suspension systems.', true, NOW());

-- Service: 200,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '200,000 km', 'Performs major high-mileage service at 200,000 km including inspection of critical engine components, drivetrain systems, and fluid replacements where necessary.', true, NOW());

-- Service: 205,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '205,000 km', 'Performs routine maintenance at 205,000 km including system inspections and fluid checks.', true, NOW());

-- Service: 210,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '210,000 km', 'Performs preventative maintenance service at 210,000 km including evaluation of engine performance and safety systems.', true, NOW());

-- Service: 215,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '215,000 km', 'Performs routine vehicle maintenance at 215,000 km including inspection of key wear components and fluid systems.', true, NOW());

-- Service: 220,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '220,000 km', 'Performs scheduled maintenance at 220,000 km including inspection of drivetrain, suspension, and cooling system components.', true, NOW());

-- Service: 225,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '225,000 km', 'Performs preventative maintenance at 225,000 km including system diagnostics, fluid checks, and safety inspections.', true, NOW());

-- Service: 230,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '230,000 km', 'Performs high-mileage maintenance at 230,000 km including inspection of major vehicle systems to ensure continued safe operation.', true, NOW());

-- Service: 235,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '235,000 km', 'Performs high-mileage preventative maintenance at 235,000 km including inspection of engine performance, drivetrain components, fluids, and safety systems.', true, NOW());

-- Service: 240,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '240,000 km', 'Perform a comprehensive 240,000 km scheduled maintenance including inspection of cooling, braking, suspension, and engine components to ensure long-term reliability. Service includes engine oil change, brake, transmission, and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 245,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '245,000 km', 'Performs routine high-mileage service at 245,000 km including fluid inspections, safety checks, and evaluation of wear components.', true, NOW());

-- Service: 250,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '250,000 km', 'Performs major high-mileage maintenance at 250,000 km including inspection of drivetrain systems, engine components, belts, hoses, and fluid conditions.', true, NOW());

-- Service: 255,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '255,000 km', 'Performs preventative maintenance at 255,000 km including system diagnostics, brake inspection, and fluid level checks.', true, NOW());

-- Service: 260,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '260,000 km', 'Performs scheduled service at 260,000 km including inspection of suspension, steering, engine performance systems, and cooling components.', true, NOW());

-- Service: 265,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '265,000 km', 'Performs routine maintenance at 265,000 km including inspection of safety systems, fluid conditions, and high-wear engine components.', true, NOW());

-- Service: 270,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '270,000 km', 'Performs preventative high-mileage service at 270,000 km including inspection of drivetrain components, engine systems, and braking systems.', true, NOW());

-- Service: 275,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '275,000 km', 'Performs scheduled maintenance at 275,000 km including system diagnostics, fluid inspections, and evaluation of major vehicle systems.', true, NOW());

-- Service: 280,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '280,000 km', 'Perform a comprehensive 280,000 km high-mileage maintenance including inspection of engine performance components, cooling systems, and suspension to ensure continued reliability. Service includes engine oil change, brake, transmission, and differential fluid changes, tire rotation, washer fluid top-up, and air & cabin filter replacement.', true, NOW());

-- Service: 285,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '285,000 km', 'Performs routine preventative service at 285,000 km including inspection of fluid systems, brakes, and vehicle safety components.', true, NOW());

-- Service: 290,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '290,000 km', 'Performs scheduled service at 290,000 km including inspection of drivetrain systems, belts, hoses, and electrical components.', true, NOW());

-- Service: 295.000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '295.000 km', 'Performs preventative maintenance at 295,000 km including system inspections, fluid evaluations, and safety checks.', true, NOW());

-- Service: 300,000 km
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Scheduled Maintenace', '300,000 km', 'Performs major high-mileage service at 300,000 km including a comprehensive inspection of engine, drivetrain, suspension, braking, and cooling systems to ensure continued safe operation.', true, NOW());

-- Service: Check Engine Light On
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Check Engine Light On', 'Perform a diagnostic scan and inspection to identify the cause of the check engine light and recommend next steps.', true, NOW());
-- Question: Is the light flashing or solid?
-- Answer: Flashing (Option: true)
-- Answer: Solid (Option: true)
-- Question: Is the vehicle drivable?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any loss of power?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is the car vibrating
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is there any noise
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Car Won’t Start (No Sound or Clicking)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Car Won’t Start (No Sound or Clicking)', 'Diagnose starting system issues including battery, starter, and electrical faults preventing the engine from turning over.', true, NOW());
-- Question: Does the dashboard/ignition turn on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Do you hear any clicking or cranking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any fluid leaks
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Car Shaking or Vibrating
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Car Shaking or Vibrating', 'Inspect tires, suspension, and engine components to identify the source of vibrations and restore smooth driving.', true, NOW());
-- Question: When does it happen?
-- Answer: Idle (Option: true)
-- Answer: Driving (Option: true)
-- Answer: Braking (Option: true)
-- Question: Where is it felt?
-- Answer: Steering (Option: true)
-- Answer: Seat (Option: true)
-- Answer: Whole car (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Brake Noise (Squeaking or Grinding)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Brake Noise (Squeaking or Grinding)', 'Inspect brake pads, rotors, and hardware to diagnose noise and ensure safe braking performance.', true, NOW());
-- Question: What type of noise?
-- Answer: Squeaking (Option: true)
-- Answer: Grinding (Option: true)
-- Question: When do you hear it?
-- Answer: Light braking (Option: true)
-- Answer: Hard braking (Option: true)
-- Answer: Constant (Option: true)
-- Question: Is the brake light on the dashboard
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Car Overheating
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Car Overheating', 'Diagnose cooling system issues including leaks, thermostat, or radiator problems to prevent engine damage.', true, NOW());
-- Question: Is the temperature gauge high?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any coolant leaks or low levels?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Strange Noises (Clicking, Knocking)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Strange Noises (Clicking, Knocking)', 'Identify abnormal noises from engine, suspension, or drivetrain components to prevent further damage.', true, NOW());
-- Question: What type of noise?
-- Answer: Clicking (Option: true)
-- Answer: Knocking (Option: true)
-- Answer: Other (Option: true)
-- Question: When do you hear it?
-- Answer: Startup (Option: true)
-- Answer: Driving (Option: true)
-- Answer: Turning (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Not Sure What’s Wrong (Full Diagnosis)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Not Sure What’s Wrong (Full Diagnosis)', 'Perform a comprehensive multi-point inspection and diagnostic scan to identify any underlying issues.', true, NOW());
-- Question: What symptoms are you noticing? (Short text or select)
-- Answer: Optional (Option: true)
-- Question: Is the car drivable?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Tire Pressure Light On (TPMS)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Tire Pressure Light On (TPMS)', 'Check tire pressures and TPMS sensors to ensure proper inflation and system accuracy.', true, NOW());
-- Question: Do you have a flat tire?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: AC Not Working (No Cold Air)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'AC Not Working (No Cold Air)', 'Diagnose AC system issues including refrigerant levels, compressor function, and airflow problems.', true, NOW());
-- Question: Is there any airflow from vents?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is the air warm or slightly cool?
-- Answer: Add any comments (Option: true)

-- Service: Heater Not Working
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Heater Not Working', 'Diagnose and repair heating system issues by checking airflow from vents, assessing air temperature, 
and identifying any underlying problems to restore proper cabin heating and comfort.', true, NOW());
-- Question: Is there any airflow from vents?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is the air warm or slightly cool?
-- Answer: Add any comments (Option: true)

-- Service: Oil or Fluid Leak
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Oil or Fluid Leak', 'Identify the source of leaks and recommend repairs to prevent damage and fluid loss.', true, NOW());
-- Question: Where do you see the leak?
-- Answer: Front (Option: true)
-- Answer: Middle (Option: true)
-- Answer: Rear (Option: true)
-- Question: What color is the fluid?
-- Answer: Dark (Option: true)
-- Answer: Brown (Option: true)
-- Answer: Green (Option: true)
-- Answer: Clear (Option: true)
-- Answer: Unsure (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Steering Issues (Pulling or Hard to Turn)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Steering Issues (Pulling or Hard to Turn)', 'Inspect steering and suspension components to resolve handling issues and ensure safe control.', true, NOW());
-- Question: Is the car pulling to one side?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is steering stiff or noisy?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Burning Smell from Car
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Burning Smell from Car', 'Identify the source of burning smells to prevent potential mechanical or electrical failures.', true, NOW());
-- Question: What kind of smell?
-- Answer: Rubber (Option: true)
-- Answer: Oil (Option: true)
-- Answer: Electrical (Option: true)
-- Question: When do you notice it?
-- Answer: Driving (Option: true)
-- Answer: Idle (Option: true)
-- Answer: After driving (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Excessive Smoke (White, Blue, Black)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Excessive Smoke (White, Blue, Black)', 'Diagnose engine or exhaust issues based on smoke color to prevent serious engine damage.', true, NOW());
-- Question: What color is the smoke?
-- Answer: White (Option: true)
-- Answer: Blue (Option: true)
-- Answer: Black (Option: true)
-- Question: When does it occur?
-- Answer: Startup (Option: true)
-- Answer: Driving (Option: true)
-- Answer: Acceleration (Option: true)
-- Answer: Add any comments (Option: true)

-- Service: Car Stalling While Driving
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Diagonsis & Testiing', 'Car Stalling While Driving', 'Diagnose fuel, air, or electrical system issues causing the vehicle to stall unexpectedly.', true, NOW());
-- Question: When does it stall?
-- Answer: Idle (Option: true)
-- Answer: Driving (Option: true)
-- Answer: Stopping (Option: true)
-- Question: Does it restart easily?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Add any comments (Option: true)

-- Service: Brake Service  - Brake Pads & Rotors Replacement (Combined)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Service  - Brake Pads & Rotors Replacement (Combined)', 'Replace both pads and rotors together for complete brake system restoration and optimal performance.', true, NOW());
-- Question: Which axle?
-- Answer: Front (Option: true)
-- Answer: Rear (Option: true)
-- Answer: Both (Option: true)
-- Question: Any noise or vibration?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Brake Shoes Replacement (Rear)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Shoes Replacement (Rear)', 'Replace rear brake shoes to restore proper braking function in drum brake systems.', true, NOW());
-- Question: Is this for rear drum brakes?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)
-- Question: Any weak parking brake?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Brake System Flush
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake System Flush', 'Flush and replace old brake fluid to maintain braking performance and protect system components.', true, NOW());
-- Question: When was last brake fluid service? (Approximate)
-- Question: Any soft or spongy brake pedal?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)

-- Service: Parking Brake Service / Adjustment
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Parking Brake Service / Adjustment', 'Adjust or service the parking brake system to ensure proper hold and safety when parked.', true, NOW());
-- Question: Is the parking brake loose or not holding?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Does it need adjustment or full service?
-- Answer: Unsure (Option: true)
-- Answer: Adjust (Option: true)

-- Service: Brake Fluid Top-Up / Minor Brake Maintenance
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Fluid Top-Up / Minor Brake Maintenance', 'Top up brake fluid and perform minor checks to maintain safe braking operation.', true, NOW());
-- Question: Is the brake fluid low?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)
-- Question: Any warning lights on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: General Brake Service / Inspection
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'General Brake Service / Inspection', 'Inspect the full brake system to identify wear, safety issues, and recommended repairs.', true, NOW());
-- Question: Any issues noticed?
-- Answer: Noise (Option: true)
-- Answer: Weak braking (Option: true)
-- Answer: None (Option: true)
-- Question: When was last brake service? (Approximate)

-- Service: Brake Caliper Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Caliper Replacement', 'Replace faulty brake calipers to restore proper braking pressure and prevent uneven wear.', true, NOW());
-- Question: Is one wheel sticking or overheating?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any uneven braking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Which wheel needs service?
-- Answer: Front Left (Option: true)
-- Answer: Front Right (Option: true)
-- Answer: Rear Left (Option: true)
-- Answer: Rear Right (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Brake Master Cylinder Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Master Cylinder Replacement', 'Replace the master cylinder to restore proper hydraulic pressure across the braking system.', true, NOW());
-- Question: Is the brake pedal soft or sinking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any brake fluid leaks?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Brake Booster Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Booster Replacement', 'Replace the brake booster to restore assisted braking and reduce pedal effort.', true, NOW());
-- Question: Is the brake pedal hard to press?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any hissing noise when braking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Brake Lines / Hose Repair
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Brake Lines / Hose Repair', 'Repair or replace damaged brake lines or hoses to ensure safe and leak-free braking.', true, NOW());
-- Question: Any visible leaks under the car?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Brake warning light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: How does your brake pedal feel when you press it?
-- Answer: Normal (Option: true)
-- Answer: Soft or spongy (Option: true)
-- Answer: Goes very low / close to the floor (Option: true)

-- Service: Wheel Hub Assembly Replacement/Wheel Hub Bearing
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'Wheel Hub Assembly Replacement/Wheel Hub Bearing', 'Replace worn wheel hub assembly to eliminate noise and ensure proper wheel rotation and safety.', true, NOW());
-- Question: Any humming or grinding noise while driving?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Does noise change with speed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Which wheel is the issue coming from?
-- Answer: Front Left (Option: true)
-- Answer: Front Right (Option: true)
-- Answer: Rear Left (Option: true)
-- Answer: Rear Right (Option: true)
-- Answer: Not sure (Option: true)

-- Service: ABS System Reset / ABS Sensor Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Brakes', 'ABS System Reset / ABS Sensor Replacement', 'Diagnose and repair ABS system issues to restore anti-lock braking functionality and safety.', true, NOW());
-- Question: Is the ABS light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Pre Purchase Car Inspection
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Car Buying', 'Pre Purchase Car Inspection', 'Inspect a vehicle before purchase to identify mechanical issues, accident damage, or maintenance concerns.', true, NOW());
-- Question: Where is the vehicle located?
-- Answer: Seller’s home (Option: true)
-- Answer: Dealership (Option: true)
-- Answer: Other (Option: true)
-- Question: Has the car been driven recently?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Not sure (Option: true)
-- Question: Anything specific you want us to focus on?
-- Answer: Engine (Option: true)
-- Answer: Brakes (Option: true)
-- Answer: Body / accident damage (Option: true)
-- Answer: Full inspection (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Used Car Inspection
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Car Buying', 'Used Car Inspection', 'Perform a comprehensive inspection of a used vehicle to identify mechanical issues and estimate repair needs.', true, NOW());
-- Question: What’s the main reason for the inspection?
-- Answer: General check-up (Option: true)
-- Answer: Issue diagnosis (Option: true)
-- Answer: Preparing for sale (Option: true)
-- Answer: Not sure (Option: true)
-- Question: Any known issues with the vehicle?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Not sure (Option: true)
-- Question: Would you like a repair estimate included?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Car Won’t Start (Battery / Starter Issue)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Car Won’t Start (Battery / Starter Issue)', 'Diagnose no-start issues related to the battery, starter, or electrical system and recommend the fix.', true, NOW());
-- Question: Do you hear clicking or cranking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Do dashboard lights turn on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Car Battery Dead / Needs Boost
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Car Battery Dead / Needs Boost', 'Provide a battery boost to get your vehicle started and check for underlying issues.', true, NOW());
-- Question: Is the car completely dead?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Do you need a jump-start now?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Does the car stay running after disconnecting the jump-start?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Battery Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Battery Replacement', 'Replace your vehicle battery to restore reliable starting and electrical performance.', true, NOW());
-- Question: Do you already have a battery?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is the current battery completely dead?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Battery Keeps Dying (Charging System Check)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Battery Keeps Dying (Charging System Check)', 'Test the charging system to identify battery drain or alternator-related issues.', true, NOW());
-- Question: How often does the battery die?
-- Answer: Once (Option: true)
-- Answer: Repeatedly (Option: true)
-- Question: Are there any warning lights on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Are there any aftermarket accessories plugged into the vehicle?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Car Not Charging (Alternator Issue)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Car Not Charging (Alternator Issue)', 'Diagnose alternator and charging system faults to restore proper battery charging.', true, NOW());
-- Question: Is the battery light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Does the car die while driving?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Alternator / Charging System Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Alternator / Charging System Service', 'Service or replace alternator components to ensure consistent power supply.', true, NOW());
-- Question: Any dim lights or electrical issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Battery recently replaced?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Starter Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Starter Replacement', 'Replace a faulty starter motor to restore proper engine starting.', true, NOW());
-- Question: Do you hear a clicking sound?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Engine not cranking at all?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Lights Not Working (Headlights, Brake Lights, Signals)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Lights Not Working (Headlights, Brake Lights, Signals)', 'Diagnose and repair lighting issues to ensure visibility and road safety.', true, NOW());
-- Question: Which lights are out?
-- Answer: Headlights (Option: true)
-- Answer: Brake (Option: true)
-- Answer: Signals (Option: true)
-- Question: Fully out or intermittent?

-- Service: Dashboard Warning Lights On
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Dashboard Warning Lights On', 'Scan and diagnose dashboard warning lights to identify system faults.', true, NOW());
-- Question: Which light is on?
-- Answer: Battery (Option: true)
-- Answer: Engine (Option: true)
-- Answer: ABS (Option: true)
-- Answer: Other (Option: true)
-- Question: Is the car driving normally?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Wipers Not Working (Blades / Motor / Pump)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Wipers Not Working (Blades / Motor / Pump)', 'Diagnose and repair wiper system issues for clear visibility in all conditions.', true, NOW());
-- Question: Are wipers not moving or just ineffective?
-- Question: Washer fluid spraying?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Power Locks Not Working
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Power Locks Not Working', 'Diagnose and repair door lock system faults for proper vehicle security.', true, NOW());
-- Question: All doors or just one?
-- Question: Using key fob or interior switch?
-- Answer: Add comment (Option: true)

-- Service: Backup Camera / Sensors Not Working
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Backup Camera / Sensors Not Working', 'Diagnose and repair parking camera or sensor issues for safe reversing.', true, NOW());
-- Question: Camera not showing or sensors not beeping?
-- Question: Any recent impact or damage?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Electrical Issue Diagnosis
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Electrical Issue Diagnosis', 'Perform a full electrical system diagnosis to locate faults and recommend repairs.', true, NOW());
-- Question: What issue are you experiencing?
-- Answer: Short input (Option: true)
-- Answer: select (Option: true)
-- Question: Is it constant or intermittent?

-- Service: Key Fob Battery Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Key Fob Battery Replacement', 'Replace the key fob battery to restore remote locking and unlocking functionality.', true, NOW());
-- Question: Is the key fob unresponsive or weak?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Do you have a spare key?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Battery Test
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Battery Test', 'Test battery health and performance to determine if replacement is needed.', true, NOW());
-- Question: Any starting issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Battery age known?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Parasitic Draw Testing (Battery Drain)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Parasitic Draw Testing (Battery Drain)', 'Identify electrical drains causing battery discharge when the vehicle is off.', false, NOW());
-- Question: Does the battery die overnight?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any recent electrical installs?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Battery Cable / Terminal Service or Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Battery Cable / Terminal Service or Replacement', 'Clean or replace battery cables and terminals to restore proper electrical flow.', false, NOW());
-- Question: Any corrosion on terminals?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Intermittent power issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Headlight / Taillight / Turn Signal Bulb Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Headlight / Taillight / Turn Signal Bulb Replacement', 'Replace faulty bulbs to maintain visibility and compliance with road safety laws.', false, NOW());
-- Question: Which bulb needs replacement?
-- Answer: Headlight (Option: true)
-- Answer: Taillight (Option: true)
-- Answer: Turn signal (Option: true)
-- Question: Is the bulb fully out or dim?
-- Answer: Fully out (Option: true)
-- Answer: Dim (Option: true)
-- Question: Is the bulb an aftermarket type?
-- Answer: LED (Option: true)
-- Answer: HID (Option: true)
-- Answer: Halogen (Option: true)
-- Answer: OEM / Standard (Option: true)
-- Answer: Not Sure (Option: true)

-- Service: Brake Light Switch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Brake Light Switch Replacement', 'Replace the brake light switch to restore proper brake light and system function.', false, NOW());
-- Question: Brake lights not turning on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Cruise control issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Windshield Wiper Motor Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Windshield Wiper Motor Replacement', 'Replace faulty wiper motor to restore proper windshield clearing.', false, NOW());
-- Question: Are the wipers not moving at all?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Is only one wiper arm moving, or are none moving?
-- Answer: One arm moving (Option: true)
-- Answer: None moving (Option: true)
-- Question: Are you noticing any unusual noises from the wipers?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Windshield Washer Pump Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Windshield Washer Pump Replacement', 'Replace washer pump to restore windshield cleaning function.', false, NOW());
-- Question: No fluid spraying?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Pump noise present?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Ignition Switch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Ignition Switch Replacement', 'Replace ignition switch to restore proper vehicle startup and electrical control.', false, NOW());
-- Question: Key not turning or no response?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any intermittent starting issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Multi-Function Switch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Multi-Function Switch Replacement', 'Replace the multi-function switch to restore control of key driving functions.', false, NOW());
-- Question: Which function not working?
-- Answer: Signals (Option: true)
-- Answer: Wipers (Option: true)
-- Answer: Lights (Option: true)
-- Question: Is it intermittent or fully not working?

-- Service: Horn Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Horn Replacement', 'Replace faulty horn to ensure proper vehicle signaling and safety.', true, NOW());
-- Question: Horn not working at all?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any clicking sound when pressed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Power Door Lock/Window Glass Not Working
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Power Door Lock/Window Glass Not Working', 'Replace faulty actuator to restore automatic locking and unlocking.', true, NOW());
-- Question: Which door is affected?
-- Answer: Left front (Option: true)
-- Answer: Right front (Option: true)
-- Answer: Left rear (Option: true)
-- Answer: Right rear (Option: true)
-- Question: Are you hearing any unusual noise when locking or unlocking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Backup Sensor Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Backup Sensor Replacement', 'Replace faulty parking sensors to restore accurate obstacle detection.', false, NOW());
-- Question: Which sensor not working?
-- Answer: Front (Option: true)
-- Answer: Rear (Option: true)
-- Answer: Unsure (Option: true)
-- Question: Constant beeping or no sound?
-- Answer: Beeping (Option: true)
-- Answer: No Sound (Option: true)

-- Service: Park Assist Camera Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Electrical & Lights', 'Park Assist Camera Replacement', 'Replace malfunctioning backup camera to restore clear rear visibility.', true, NOW());
-- Question: Is the camera blank or blurry?
-- Answer: Blank (Option: true)
-- Answer: Blurry (Option: true)
-- Answer: Other (please descibe) (Option: true)
-- Question: Any visible damage?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Diagnosis
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Diagnosis', 'Perform a full engine diagnostic to identify faults and recommend repairs.', true, NOW());
-- Question: What symptoms are you noticing?
-- Question: Is the car drivable?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Running Rough / Misfiring
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Running Rough / Misfiring', 'Diagnose misfires caused by ignition, fuel, or air issues to restore smooth engine performance.', true, NOW());
-- Question: Is the engine shaking or jerking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Loss of Power / Slow Acceleration
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Loss of Power / Slow Acceleration', 'Identify performance issues affecting acceleration such as fuel delivery, airflow, or engine faults.', false, NOW());
-- Question: Happens during acceleration?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any warning lights?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Won’t Start (Fuel / Air Issue)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Won’t Start (Fuel / Air Issue)', 'Diagnose fuel or air supply issues preventing the engine from starting', true, NOW());
-- Question: Does the engine crank?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Smell fuel or notice no fuel?

-- Service: Hard Start (Takes Multiple Attempts)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Hard Start (Takes Multiple Attempts)', 'Identify causes of delayed starting such as fuel pressure loss or ignition issues.', false, NOW());
-- Question: Happens when cold or warm?
-- Question: Recently getting worse?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Stalling
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Stalling', 'Diagnose stalling caused by fuel, airflow, or electrical system faults.', false, NOW());
-- Question: When does it stall?
-- Answer: Idle (Option: true)
-- Answer: Driving (Option: true)
-- Question: Does it restart easily?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Overheating
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Overheating', 'Identify cooling system or internal issues causing the engine to overheat.', true, NOW());
-- Question: Temperature gauge high?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Coolant level low?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Unsure (Option: true)

-- Service: Engine Knocking or Ticking Noise
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Knocking or Ticking Noise', 'Diagnose internal or valvetrain noises to prevent serious engine damage.', true, NOW());
-- Question: Noise at idle or acceleration?
-- Question: Gets louder with speed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Check Engine Light (Engine Related)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Check Engine Light (Engine Related)', 'Scan engine codes and diagnose faults affecting engine performance and emissions.', true, NOW());
-- Question: Light flashing or solid?
-- Question: Any performance issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Oil Leak (Engine Area)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oil Leak (Engine Area)', 'Locate and diagnose oil leaks to prevent engine damage and fluid loss.', true, NOW());
-- Question: Where is the leak?
-- Answer: Top (Option: true)
-- Answer: Bottom (Option: true)
-- Answer: Unsure (Option: true)
-- Question: Any burning smell?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Low Oil Pressure Warning
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Low Oil Pressure Warning', 'Diagnose oil pressure issues to protect engine components from damage.', false, NOW());
-- Question: Warning constant or intermittent?
-- Question: Any engine noise?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Burning Oil Smell / Oil Consumption
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Burning Oil Smell / Oil Consumption', 'Identify oil leaks or internal burning issues affecting engine health.', true, NOW());
-- Question: Smell while driving or after?
-- Question: Oil level dropping quickly?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Vibration at Idle (Rough Idle)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Vibration at Idle (Rough Idle)', 'Diagnose rough idle caused by misfires, mounts, or airflow issues.', true, NOW());
-- Question: Only at idle?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Is it cold or warm engine condion (Option: true)

-- Service: Fuel Delivery Issue / Fuel Pump Problem
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Fuel Delivery Issue / Fuel Pump Problem', 'Diagnose fuel system issues affecting pressure and engine performance', false, NOW());
-- Question: Loss of power or stalling?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Hard starting?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Spark Plug Replacement / Tune-Up
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Spark Plug Replacement / Tune-Up', 'Replace spark plugs to improve ignition, efficiency, and performance.', true, NOW());
-- Question: Any misfires or rough running?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: When last replaced?

-- Service: Ignition Coil Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Ignition Coil Replacement', 'Replace faulty ignition coils to restore proper engine firing.', false, NOW());
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Misfire symptoms?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Fuel System Service (Injectors / Fuel Delivery)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Fuel System Service (Injectors / Fuel Delivery)', 'Clean or service fuel system components to restore proper fuel delivery.', false, NOW());
-- Question: Poor fuel economy or rough running?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any hesitation?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Throttle Body Service / Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Throttle Body Service / Replacement', 'Clean or replace throttle body to improve airflow and engine response.', true, NOW());
-- Question: Rough idle or hesitation?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any throttle response issues?

-- Service: Air Intake / Filter Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Air Intake / Filter Service', 'Replace or clean air filter to ensure proper airflow and engine efficiency.', true, NOW());
-- Question: When last changed?
-- Question: Driving in dusty conditions?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: PCV Valve Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'PCV Valve Replacement', 'Replace PCV valve to regulate engine pressure and reduce oil issues', false, NOW());
-- Question: Oil consumption issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Rough idle?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Serpentine Belt Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Serpentine Belt Replacement', 'Replace worn belt to ensure proper operation of engine accessories.', true, NOW());
-- Question: Any squealing noise?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Cracks visible on belt?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Timing Belt
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Timing Belt', '', true, NOW());
-- Question: Replacement, mainteance, damage, starting issue

-- Service: Engine Mount Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Engine Mount Replacement', 'Replace worn mounts to reduce vibration and stabilize the engine.', true, NOW());
-- Question: Excess vibration?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Clunk when shifting?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Radiator Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Radiator Replacement', 'Replace radiator to restore proper cooling and prevent overheating.', true, NOW());
-- Question: Any visible leaks?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Overheating issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Water Pump Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Water Pump Replacement', 'Replace water pump to maintain coolant circulation and engine temperature.', true, NOW());
-- Question: Coolant leak near engine?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Overheating or noise?

-- Service: Thermostat Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Thermostat Replacement', 'Replace thermostat to regulate engine temperature properly.', true, NOW());
-- Question: Engine overheating or not warming up?
-- Question: Temperature fluctuating?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Cooling Fan / Motor Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Cooling Fan / Motor Service', 'Repair or replace cooling fan components to prevent overheating.', true, NOW());
-- Question: Fan running when hot?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Overheating in traffic?

-- Service: Cooling System Flush
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Cooling System Flush', 'Flush old coolant and contaminants to maintain cooling efficiency.', true, NOW());
-- Question: When last coolant service?
-- Question: Any overheating issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Coolant Leak Repair
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Coolant Leak Repair', 'Identify and repair coolant leaks to prevent overheating.', true, NOW());
-- Question: Where is leak visible?
-- Question: Coolant level dropping?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Valve Cover Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Valve Cover Gasket Replacement', 'Replace gasket to stop oil leaks from the engine top.', true, NOW());
-- Question: Oil leaking from top of engine?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Burning smell?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Oil Pan / Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oil Pan / Gasket Replacement', 'Replace oil pan gasket to stop leaks from the bottom of the engine.', true, NOW());
-- Question: Oil leak under vehicle?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Oil spots when parked?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Oil Filter Housing Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oil Filter Housing Gasket Replacement', 'Replace gasket to stop leaks around the oil filter housing.', true, NOW());
-- Question: Oil leak near filter area?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Recent oil service?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Oil Pressure Sensor Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oil Pressure Sensor Replacement', 'Replace faulty sensor to ensure accurate oil pressure readings.', true, NOW());
-- Question: Oil pressure warning light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any leaks near sensor?

-- Service: Oil Cooler / Lines Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oil Cooler / Lines Replacement', 'Replace oil cooler components to maintain proper oil temperature and flow.', true, NOW());
-- Question: Oil leaking near cooler lines?
-- Question: Overheating or oil mixing issues?

-- Service: EGR Valve / System Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'EGR Valve / System Service', 'Clean or replace EGR system to improve emissions and engine performance.', true, NOW());
-- Question: Rough idle or stalling?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Exhaust Manifold / Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Exhaust Manifold / Gasket Replacement', 'Repair exhaust leaks to restore performance and reduce noise.', true, NOW());
-- Question: Loud exhaust noise?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Smell of exhaust?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Oxygen Sensor / Air-Fuel Sensor Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Oxygen Sensor / Air-Fuel Sensor Replacement', 'Replace faulty sensors to optimize fuel mixture and emissions.', true, NOW());
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Poor fuel economy?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Turbo / Boost / Wastegate Issues (if applicable)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Turbo / Boost / Wastegate Issues (if applicable)', 'Diagnose turbo system issues affecting power and performance.', true, NOW());
-- Question: Loss of boost/power?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Whistling or smoke?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Timing Cover / Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Timing Cover / Gasket Replacement', 'Replace timing cover gasket to stop leaks and protect engine components.', true, NOW());
-- Question: Oil leak from front of engine?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Any unusual noise?

-- Service: Timing Chain / Gear Components
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Timing Chain / Gear Components', 'Service or replace timing components to maintain engine synchronization.', true, NOW());
-- Question: Rattling noise at startup?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: High mileage engine?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Camshaft Seal Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Camshaft Seal Replacement', 'Replace camshaft seals to prevent oil leaks and contamination.', true, NOW());
-- Question: Oil leak near camshaft area?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Burning smell?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Intake Manifold / Gasket Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Intake Manifold / Gasket Replacement', 'Repair intake leaks to restore proper airflow and engine performance.', true, NOW());
-- Question: Rough idle or vacuum leaks?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Coolant or air leak signs?

-- Service: Cylinder Head / Head Gasket Repair
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Cylinder Head / Head Gasket Repair', 'Repair major internal engine damage to restore compression and prevent failure.', true, NOW());
-- Question: White smoke or overheating?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Coolant loss with no leak?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Variable Valve Timing (VVT) Solenoid Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Engine', 'Variable Valve Timing (VVT) Solenoid Replacement', 'Replace VVT solenoid to restore proper engine timing and efficiency.', true, NOW());
-- Question: Check engine light on?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Performance issues at certain speeds?

-- Service: ECU Tuning / Performance Tune
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'ECU Tuning / Performance Tune', 'Reprogram the ECU to improve power, throttle response, and overall engine performance.', false, NOW());
-- Question: Stock vehicle or modified?
-- Question: Any performance goals?
-- Answer: Power (Option: true)
-- Answer: Efficiency (Option: true)

-- Service: Cold Air Intake Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Cold Air Intake Installation', 'Install a cold air intake to increase airflow and enhance engine performance and sound.', true, NOW());
-- Question: Do you have the intake kit?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Stock or modified engine?

-- Service: Performance Exhaust Upgrade (Bolt-On Systems)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Performance Exhaust Upgrade (Bolt-On Systems)', 'Install a performance exhaust system to improve sound and exhaust flow.', false, NOW());
-- Question: Full system or axle-back?
-- Question: Louder sound preference?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Suspension Upgrade (Lowering Springs / Coilovers)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Suspension Upgrade (Lowering Springs / Coilovers)', 'Upgrade suspension components to improve handling, stance, and ride quality.', false, NOW());
-- Question: Springs or coilovers?
-- Question: Comfort or performance focus?

-- Service: Wheel & Spacer Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Wheel & Spacer Installation', 'Install wheels or spacers to improve vehicle stance and fitment.', false, NOW());
-- Question: New wheels or spacers?
-- Question: Do you need torque check?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Performance Brake Upgrade (Pads & Rotors)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Performance Brake Upgrade (Pads & Rotors)', 'Upgrade brake components for improved stopping power and heat resistance.', true, NOW());
-- Question: Street or performance setup?
-- Question: Any current brake issues?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Remote Starter Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Remote Starter Installation', 'Install a remote starter system for convenient vehicle start from a distance.', true, NOW());
-- Question: Automatic or manual vehicle?
-- Question: Do you have a kit?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Apple CarPlay / Android Auto Upgrade
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Apple CarPlay / Android Auto Upgrade', 'Upgrade your system to enable smartphone integration for navigation, calls, and media.', true, NOW());
-- Question: Wired or wireless preference?
-- Question: Factory screen or aftermarket?

-- Service: Aftermarket Stereo / Subwoofer Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Aftermarket Stereo / Subwoofer Installation', 'Install audio components to enhance sound quality and bass performance.', true, NOW());
-- Question: Full system or sub only?
-- Question: Do you have components?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Backup Camera Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Backup Camera Installation', 'Install a backup camera system to improve rear visibility and safety.', true, NOW());
-- Question: Factory screen available?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Need wiring integration?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Dash Cam Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Dash Cam Installation', 'Install dash cam for continuous recording and driving security.', true, NOW());
-- Question: Front only or front/rear?
-- Question: Hardwire or plug-in?

-- Service: LED Lighting Upgrade (Interior / Exterior)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'LED Lighting Upgrade (Interior / Exterior)', 'Upgrade lighting to LED for improved visibility and modern styling.', true, NOW());
-- Question: Interior or exterior lights?
-- Question: Color preference?

-- Service: Sway Bar Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Sway Bar Installation', 'Install sway bars to improve cornering stability and reduce body roll.', false, NOW());
-- Question: Front, rear, or both?
-- Question: Handling upgrade goal?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Throttle Body Cleaning Service
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Throttle Body Cleaning Service', '', true, NOW());

-- Service: Lift Kit Installation (Trucks / SUVs)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Lift Kit Installation (Trucks / SUVs)', 'Install lift kit to increase ground clearance and off-road capability.', true, NOW());
-- Question: Lift height?
-- Question: Off-road or appearance?

-- Service: Performance Tire Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Performance Tire Installation', 'Install performance tires for improved grip, handling, and safety.', true, NOW());
-- Question: Do you have tires already?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Seasonal or performance tires?

-- Service: Interior Ambient Lighting Upgrade
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Interior Ambient Lighting Upgrade', 'Install ambient lighting to enhance interior aesthetics and driving experience.', true, NOW());
-- Question: Single color or multi-color?
-- Question: App-controlled?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Custom Audio / Speaker Upgrades
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Custom Audio / Speaker Upgrades', 'Upgrade speakers and audio components for premium sound quality.', true, NOW());
-- Question: Replace speakers or full system?
-- Question: Sound preference?
-- Answer: Bass (Option: true)
-- Answer: Clarity (Option: true)

-- Service: USB / Charging Port Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'USB / Charging Port Installation', 'Install additional charging ports for convenience and device connectivity.', true, NOW());
-- Question: Front or rear install?
-- Question: Fast charging needed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Grille / Spoiler / Exterior Trim Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Grille / Spoiler / Exterior Trim Installation', 'Install exterior components to enhance vehicle styling and appearance.', true, NOW());
-- Question: Which part installing?
-- Question: OEM or aftermarket?

-- Service: Roof Rack Installation
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Roof Rack Installation', 'Install roof rack system for additional cargo carrying capacity.', true, NOW());
-- Question: Crossbars or full rack?
-- Question: Vehicle has mounting points?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Engine Bay Cosmetic Upgrades
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Engine Bay Cosmetic Upgrades', 'Enhance engine bay appearance with cosmetic upgrades and detailing components.', true, NOW());
-- Question: Covers, caps, or full kit?
-- Question: Show or daily use?

-- Service: Intake + Tune Performance Packages
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Intake + Tune Performance Packages', 'Combine intake upgrade with ECU tuning for noticeable performance gains.', false, NOW());
-- Question: Intake already installed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Performance goal?

-- Service: Exhaust Component Bolt-On Mods
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Performance and Modification', 'Exhaust Component Bolt-On Mods', 'Install bolt-on exhaust components to customize sound and performance.', true, NOW());
-- Question: Which component?
-- Answer: Muffler (Option: true)
-- Answer: Resonator (Option: true)
-- Answer: etc. (Option: true)
-- Question: Sound preference?

-- Service: Door Won’t Open / Close Properly (Diagnosis)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Won’t Open / Close Properly (Diagnosis)', 'We inspect your door to identify why it’s stuck, misaligned, or not closing properly and recommend the right fix.', true, NOW());
-- Question: What’s happening?
-- Answer: Won’t open (Option: true)
-- Answer: Won’t close (Option: true)
-- Answer: Hard to open (Option: true)
-- Answer: Misaligned (Option: true)
-- Question: Which door?
-- Answer: Driver (Option: true)
-- Answer: Passenger (Option: true)
-- Answer: Rear (Option: true)
-- Answer: Not sure (Option: true)

-- Service: Door Latch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Latch Replacement', 'We replace the faulty door latch so your door opens and closes securely again.', true, NOW());
-- Question: Which door needs repair?
-- Question: Is the door currently stuck closed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Door Lock Not Working (Actuator / Lock Repair)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Lock Not Working (Actuator / Lock Repair)', 'We fix or replace the locking mechanism so your door locks and unlocks properly.', true, NOW());
-- Question: What’s the issue?
-- Answer: Won’t lock (Option: true)
-- Answer: Won’t unlock (Option: true)
-- Answer: Intermittent (Option: true)
-- Question: Is it affecting one door or multiple?

-- Service: Exterior Door Handle Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Exterior Door Handle Replacement', 'We replace broken or loose exterior handles so you can open your door from outside normally.', true, NOW());
-- Question: Which door?
-- Question: Is the handle completely broken or just loose?

-- Service: Interior Door Handle Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Interior Door Handle Replacement', 'We replace the inside door handle so you can safely open the door from within the vehicle.', true, NOW());
-- Question: Which door?
-- Question: Is it snapped, loose, or not opening the door?

-- Service: Window Not Working (Regulator / Motor Repair)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Window Not Working (Regulator / Motor Repair)', 'We repair or replace the window motor or regulator so your window moves up and down properly.', true, NOW());
-- Question: What’s happening?
-- Answer: Won’t move (Option: true)
-- Answer: Stuck down (Option: true)
-- Answer: Slow (Option: true)
-- Answer: Noise (Option: true)
-- Question: Which window?

-- Service: Lubricate Doors / Hinges
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Lubricate Doors / Hinges', 'We lubricate door hinges and moving parts to eliminate squeaks and ensure smooth operation.', true, NOW());
-- Question: Which doors need service?
-- Answer: All (Option: true)
-- Answer: Specific door (Option: true)
-- Question: Any squeaking noise?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Door Alignment / Adjustment
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Alignment / Adjustment', 'We adjust your door alignment so it closes properly and seals correctly.', true, NOW());
-- Question: What’s the issue?
-- Answer: Not closing (Option: true)
-- Answer: Misaligned (Option: true)
-- Answer: Wind noise (Option: true)
-- Question: Which door?

-- Service: Trunk / Tailgate Won’t Open (Diagnosis)
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Won’t Open (Diagnosis)', 'We diagnose why your trunk or tailgate won’t open and determine the required repair.', true, NOW());
-- Question: What’s happening?
-- Answer: Won’t open (Option: true)
-- Answer: Stuck (Option: true)
-- Answer: Opens manually only (Option: true)
-- Question: Is it electric or manual?

-- Service: Trunk / Tailgate Latch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Latch Replacement', 'We replace the faulty latch so your trunk or tailgate opens and closes securely.', true, NOW());
-- Question: Is it stuck closed?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Manual or power trunk?

-- Service: Trunk / Tailgate Lift Support / Shocks Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Lift Support / Shocks Replacement', 'We replace worn lift supports so your trunk or tailgate stays open safely.', true, NOW());
-- Question: Does the trunk fall down on its own?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: One side or both sides weak?

-- Service: Door Lock Relay / Switch Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Lock Relay / Switch Replacement', 'We replace faulty switches or relays to restore proper door lock controls.', true, NOW());
-- Question: Are locks not responding to buttons?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: One door or all doors affected?

-- Service: Door Striker Plate Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Door Striker Plate Replacement', 'We replace or adjust the striker plate so your door latches securely.', false, NOW());
-- Question: Door not latching properly?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Which door?

-- Service: Sliding Door Track / Roller Adjustment
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Sliding Door Track / Roller Adjustment', 'We adjust or repair sliding door tracks so the door opens and closes smoothly.', true, NOW());
-- Question: Is the door stuck or hard to slide?
-- Question: Any grinding or noise?

-- Service: Hood Latch / Hood Latch Adjustment
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Hood Latch / Hood Latch Adjustment', 'We repair or adjust the hood latch so it opens and closes safely.', true, NOW());
-- Question: Hood won’t open or won’t close?
-- Question: Is the latch stuck?

-- Service: Hood Lift Support / Shocks Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Hood Lift Support / Shocks Replacement', 'We replace worn hood supports so your hood stays open securely.', true, NOW());
-- Question: Does the hood fall down?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)

-- Service: Trunk / Tailgate Lock Cylinder Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Lock Cylinder Replacement', 'We replace the physical lock cylinder so your key works properly in the trunk.', true, NOW());
-- Question: Key not turning or stuck?
-- Question: Manual key or keyless entry vehicle?

-- Service: Trunk / Tailgate Lock Solenoid Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Lock Solenoid Replacement', 'We replace the solenoid responsible for electronic trunk release.', true, NOW());
-- Question: Trunk not opening with button?
-- Question: Does it work manually?

-- Service: Trunk / Tailgate Locking Assembly Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk / Tailgate Locking Assembly Replacement', 'We replace the complete trunk/tailgate locking assembly so your trunk locks and unlocks reliably.', true, NOW());
-- Question: Is the trunk/tailgate not locking or unlocking?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Manual or electronic locking system?

-- Service: Trunk Latch Release Cable Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk Latch Release Cable Replacement', 'We replace the trunk release cable so your trunk opens smoothly from inside or with the release button.', true, NOW());
-- Question: Is the release cable broken or stretched?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Does the trunk open manually or with a button?

-- Service: Trunk Lock Actuator Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk Lock Actuator Replacement', 'We replace the actuator that controls electronic trunk locking to restore proper functionality.', true, NOW());
-- Question: Is the trunk not responding to the remote or button?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Works manually?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Not sure (Option: true)

-- Service: Trunk Striker Plate Replacement
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Trunk Striker Plate Replacement', 'We replace or adjust the striker plate to ensure the trunk latches securely every time.', true, NOW());
-- Question: Trunk not latching properly?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Answer: Not sure (Option: true)
-- Question: Manual or power trunk?

-- Service: Lubricate Hood / Trunk Hinge
INSERT INTO "Services" (category, name, description, service_active, created_at) VALUES ('Doors', 'Lubricate Hood / Trunk Hinge', 'We lubricate hinges and moving parts on your hood and trunk to eliminate squeaks and ensure smooth operation.', true, NOW());
-- Question: Any squeaking or stiffness?
-- Answer: Yes (Option: false)
-- Answer: No (Option: false)
-- Question: Which parts need lubrication?
-- Answer: Hood (Option: true)
-- Answer: Trunk (Option: true)
-- Answer: Both (Option: true)
-- Answer: Not sure (Option: true)

