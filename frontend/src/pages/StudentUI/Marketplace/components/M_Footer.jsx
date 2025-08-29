import React from 'react'
import { assets } from '../assets/assets'

const M_Footer = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Newsletter Section */}
      

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src={assets.logo} alt="UniMate" className="w-12 h-12 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">UniMate</h2>
                <p className="text-orange-300 text-sm">Student Marketplace</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Your one-stop platform for everything you need as a university student. From textbooks to tech gear, 
              connect with fellow students and find amazing deals on campus essentials.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center hover:from-yellow-700 hover:to-orange-700 transform hover:scale-110 transition-all duration-200">
                <span className="text-white text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center hover:from-orange-700 hover:to-amber-700 transform hover:scale-110 transition-all duration-200">
                <span className="text-white text-sm">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center hover:from-amber-700 hover:to-yellow-700 transform hover:scale-110 transition-all duration-200">
                <span className="text-white text-sm">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 rounded-full flex items-center justify-center hover:from-yellow-700 hover:via-orange-700 hover:to-amber-700 transform hover:scale-110 transition-all duration-200">
                <span className="text-white text-sm">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500"></div>
            </h3>
            <ul className="space-y-3">
              {['Home', 'Browse Items', 'Sell Items', 'About Us', 'Student Deals', 'Campus Events'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-orange-400 hover:translate-x-1 transform transition-all duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 group-hover:bg-amber-500"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative">
              Get In Touch
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">📞</span>
                </div>
                <div>
                  <p className="text-gray-300">+94-76-2578974</p>
                  <p className="text-gray-500 text-xs">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">✉️</span>
                </div>
                <div>
                  <p className="text-gray-300">support@unimate.com</p>
                  <p className="text-gray-500 text-xs">We reply within 24hrs</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">📍</span>
                </div>
                <div>
                  <p className="text-gray-300">Campus Hub</p>
                  <p className="text-gray-500 text-xs">University District</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-5 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 UniMate - Connecting Students, Building Community ❤️
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Student Safety</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default M_Footer