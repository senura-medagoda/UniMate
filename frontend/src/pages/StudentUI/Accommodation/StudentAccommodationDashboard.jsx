import React from 'react';
import { Link } from 'react-router-dom';
import AccommodationNavbar from './components/AccommodationNavbar';

const StudentAccommodationDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <AccommodationNavbar />
      
      {/* Hero Section with Background */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="text-orange-400 block">Student Accommodation</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Discover comfortable, affordable boarding places near your university. 
                Book with confidence and make your student life memorable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/student/accommodation/boarding-places"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore Boarding Places
                </Link>
                <Link
                  to="/student/accommodation/my-bookings"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 border border-white border-opacity-30"
                >
                  View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose UniMate Accommodation?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide a comprehensive platform for students to find, book, and manage their accommodation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All boarding places are verified by our team to ensure quality and safety for students.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and secure booking process with instant confirmation and payment options.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support to help you with any accommodation-related queries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-600 text-lg">
              Get started with these quick actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center items-stretch">
            <Link
              to="/student/accommodation/boarding-places"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group h-full"
            >
              <div className="text-center h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Search Places</h3>
                <p className="text-gray-600 text-sm">Find boarding places near you</p>
                <div className="mt-auto" />
              </div>
            </Link>

            <Link
              to="/student/accommodation/my-bookings"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group h-full"
            >
              <div className="text-center h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Bookings</h3>
                <p className="text-gray-600 text-sm">View and manage bookings</p>
                <div className="mt-auto" />
              </div>
            </Link>

            <Link
              to="/student/accommodation/services"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group h-full"
            >
              <div className="text-center h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                <p className="text-gray-600 text-sm">Explore our services</p>
                <div className="mt-auto" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/src/pages/StudentUI/Accommodation/assets/unimatelogo.png" 
                  alt="UniMate Logo" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x40?text=UniMate";
                  }}
                />
              </div>
              <p className="text-gray-400">
                Your trusted partner for student accommodation and services.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/student/accommodation/boarding-places" className="hover:text-orange-400 transition-colors">Boarding Places</Link></li>
                <li><Link to="/student/accommodation/my-bookings" className="hover:text-orange-400 transition-colors">My Bookings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 support@unimate.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 University District, Campus City</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UniMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentAccommodationDashboard;

