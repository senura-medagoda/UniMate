import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const SA_Footer = () => {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/Logo.png" 
                alt="UniMate Logo" 
                className="h-8 w-auto mr-3"
              />
              <div>
                <h3 className="text-xl font-bold">UniMate</h3>
                <p className="text-sm text-gray-400">System Administration</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Comprehensive university management platform connecting students, administrators, and service providers across all campus needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-500" />
              Admin Panel
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Student Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Admin Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Reports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Settings</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-gray-400">admin@unimate.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-gray-400">+94 11 234 5678</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-orange-500 mt-1" />
                <span className="text-gray-400">University of Colombo,<br />Colombo 03, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 UniMate. All rights reserved. | System Admin Panel
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default SA_Footer;