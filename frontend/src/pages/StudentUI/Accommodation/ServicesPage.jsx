import React from 'react';
import AccommodationNavbar from './components/AccommodationNavbar';

const ServicesPage = ({ user, setUser }) => {
  const services = [
    { title: 'Verified Listings', desc: 'Every listing is reviewed for authenticity and safety.' },
    { title: 'Easy Booking', desc: 'Simple flow to request bookings and manage your stays.' },
    { title: 'Flexible Search', desc: 'Filter by price, location, and more to find your fit.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AccommodationNavbar user={user} setUser={setUser} />

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to find and manage student accommodation with confidence.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-500 text-white flex items-center justify-center mb-4">
                <span className="text-lg font-bold">{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;











