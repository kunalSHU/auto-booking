import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Welcome to APEX Auto Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted partner for professional auto detailing, maintenance, and booking services.
          </p>
          <Link
            to="#book"
            className="inline-block px-8 py-3 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded transition"
          >
            Book a Service Today
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Car Detailing',
                description: 'Professional exterior and interior detailing to keep your vehicle looking pristine.',
              },
              {
                title: 'Maintenance',
                description: 'Regular maintenance services to ensure your vehicle runs smoothly and safely.',
              },
              {
                title: 'Quick Wash',
                description: 'Fast and efficient car wash services for those on the go.',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-black mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Basic Wash', price: '$25' },
              { name: 'Premium Detail', price: '$79' },
              { name: 'Full Service Package', price: '$199' },
            ].map((plan, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition text-center"
              >
                <h3 className="text-2xl font-bold text-black mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold text-lime-600 mb-6">{plan.price}</p>
                <button className="w-full px-6 py-2 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded transition">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to book?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Choose a service and schedule your appointment today.
          </p>
          <Link
            to="#book"
            className="inline-block px-8 py-3 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded transition"
          >
            Book Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
